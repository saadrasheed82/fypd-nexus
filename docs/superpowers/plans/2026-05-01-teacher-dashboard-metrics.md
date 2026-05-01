# Teacher Dashboard Monthly Metrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add DB-backed monthly “progress over time” charts to the teacher dashboard.

**Architecture:** Create a dedicated server endpoint that aggregates monthly progress series from `fydp_monthly_tasks` for the teacher’s supervised projects, then update the teacher dashboard UI to fetch and render those series in Recharts with loading/empty states.

**Tech Stack:** Next.js App Router route handlers, Postgres (`pg`), Recharts, Node built-in `node:test` for unit tests.

---

## File map (create/modify)

- Create: `app/api/teacher/dashboard/metrics/route.js` (new GET metrics endpoint)
- Create: `app/lib/teacherDashboardMetrics.js` (pure aggregation helpers, imported by route)
- Create: `tests/teacherDashboardMetrics.test.js` (unit tests for aggregation logic)
- Modify: `package.json` (add `test` script using Node’s test runner)
- Modify: `app/tch/dashboard/page.js` (replace chart section to use time-series endpoint)

---

### Task 1: Add unit tests for monthly aggregation (RED)

**Files:**
- Create: `tests/teacherDashboardMetrics.test.js`

- [ ] **Step 1: Write the failing test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { computeMonthlySeries } from "../app/lib/teacherDashboardMetrics.js";

test("computeMonthlySeries produces cumulative progress per group and overall", () => {
  const projects = [
    { projectId: "p1", group: "Group 1" },
    { projectId: "p2", group: "Group 1" },
    { projectId: "p3", group: "Group 2" },
  ];

  const tasks = [
    // p1: 2 months, 1 verified by month 2
    { project_id: "p1", month_number: 1, status: "verified" },
    { project_id: "p1", month_number: 2, status: "submitted" },
    // p2: 2 months, both verified
    { project_id: "p2", month_number: 1, status: "verified" },
    { project_id: "p2", month_number: 2, status: "verified" },
    // p3: 2 months, none verified
    { project_id: "p3", month_number: 1, status: "pending" },
    { project_id: "p3", month_number: 2, status: "pending" },
  ];

  const out = computeMonthlySeries({ projects, tasks, maxMonthCap: 12 });

  assert.deepEqual(out.months, [1, 2]);

  // Group 1 month1: (100 + 100)/2 = 100
  // Group 1 month2: (50 + 100)/2 = 75
  assert.deepEqual(out.byGroup.find((g) => g.group === "Group 1").series, [
    { month: 1, progress: 100 },
    { month: 2, progress: 75 },
  ]);

  // Group 2 month1: 0, month2: 0
  assert.deepEqual(out.byGroup.find((g) => g.group === "Group 2").series, [
    { month: 1, progress: 0 },
    { month: 2, progress: 0 },
  ]);

  // Overall month1: (100,100,0) avg = 67; month2: (50,100,0) avg = 50
  assert.deepEqual(out.overall, [
    { month: 1, progress: 67 },
    { month: 2, progress: 50 },
  ]);

  assert.deepEqual(out.topGroupsLatestMonth, [
    { name: "Group 1", progress: 75 },
    { name: "Group 2", progress: 0 },
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/teacherDashboardMetrics.test.js`

Expected: FAIL with module not found / missing export `computeMonthlySeries`.

---

### Task 2: Implement aggregation helpers (GREEN)

**Files:**
- Create: `app/lib/teacherDashboardMetrics.js`
- Test: `tests/teacherDashboardMetrics.test.js`

- [ ] **Step 1: Write minimal implementation**

```js
export function computeMonthlySeries({ projects, tasks, maxMonthCap = 12 }) {
  const monthValues = tasks.map((t) => Number(t.month_number) || 0).filter((m) => m > 0);
  const maxMonth = Math.min(maxMonthCap, monthValues.length ? Math.max(...monthValues) : 0);
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);

  const tasksByProject = new Map();
  for (const task of tasks) {
    const id = task.project_id;
    if (!tasksByProject.has(id)) tasksByProject.set(id, []);
    tasksByProject.get(id).push(task);
  }

  const progressByProjectMonth = new Map(); // key: `${projectId}:${month}` => progress int
  for (const { projectId } of projects) {
    const pts = (tasksByProject.get(projectId) || []).slice().sort((a, b) => a.month_number - b.month_number);
    let total = 0;
    let verified = 0;
    let cursor = 0;
    for (const month of months) {
      while (cursor < pts.length && Number(pts[cursor].month_number) <= month) {
        total += 1;
        if (pts[cursor].status === "verified") verified += 1;
        cursor += 1;
      }
      const progress = total ? Math.round((verified / total) * 100) : 0;
      progressByProjectMonth.set(`${projectId}:${month}`, progress);
    }
  }

  const groupNames = Array.from(new Set(projects.map((p) => p.group || "Unassigned")));
  const byGroup = groupNames.map((group) => {
    const groupProjects = projects.filter((p) => (p.group || "Unassigned") === group);
    const series = months.map((month) => {
      const values = groupProjects.map((p) => progressByProjectMonth.get(`${p.projectId}:${month}`) ?? 0);
      const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      return { month, progress: avg };
    });
    return { group, series };
  });

  const overall = months.map((month) => {
    const values = projects.map((p) => progressByProjectMonth.get(`${p.projectId}:${month}`) ?? 0);
    const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    return { month, progress: avg };
  });

  const latestMonth = months.at(-1) ?? 0;
  const topGroupsLatestMonth = latestMonth
    ? byGroup
        .map((g) => ({ name: g.group, progress: g.series.find((s) => s.month === latestMonth)?.progress ?? 0 }))
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 10)
    : [];

  return { months, byGroup, overall, topGroupsLatestMonth };
}
```

- [ ] **Step 2: Run test to verify it passes**

Run: `node --test tests/teacherDashboardMetrics.test.js`

Expected: PASS.

---

### Task 3: Wire the teacher metrics API route

**Files:**
- Create: `app/api/teacher/dashboard/metrics/route.js`
- Modify (if needed): `app/lib/fydpFeatures.js` (schema ensure already exists; re-use)

- [ ] **Step 1: Write failing integration check (optional)**
Skip automated integration tests if not set up; rely on unit tests + manual API call during dev.

- [ ] **Step 2: Implement `GET /api/teacher/dashboard/metrics`**

Implementation requirements:
- `requireUser("teacher")`
- Fetch supervised projects (`projects.supervisor_id = teacher.id`) and their `student.student_group`
- Fetch all `fydp_monthly_tasks` for those project IDs
- Return `computeMonthlySeries(...)` output as JSON

---

### Task 4: Add `test` script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add**

```json
"test": "node --test"
```

- [ ] **Step 2: Run**

Run: `npm test`

Expected: PASS.

---

### Task 5: Update teacher dashboard charts to time-series

**Files:**
- Modify: `app/tch/dashboard/page.js`

- [ ] **Step 1: Add state for metrics**
Add:
- `metricsLoading`
- `metricsError` (optional)
- `metrics` containing `{ months, overall, byGroup, topGroupsLatestMonth }`

- [ ] **Step 2: Fetch metrics in parallel with existing `load()`**
Add a `loadMetrics()` that hits `/api/teacher/dashboard/metrics`, and call it from refresh + initial mount.

- [ ] **Step 3: Render**
Replace current charts with:
- “Group progress over time”: a `LineChart` or `BarChart` over `months`, rendering:
  - default view: overall progress line
  - and/or a selectable group list that updates the chart (keep UI simple)
- “Top groups (latest month)”: donut/pie using `topGroupsLatestMonth`

- [ ] **Step 4: Manual check**
Run `npm run dev`, open `/tch/dashboard`, verify charts update when tasks get verified.

---

### Task 6: Verification

- [ ] Run: `npm test` (expected PASS)
- [ ] Run: `npm run lint` (expected no new lint errors)
- [ ] Run: `npm run build` (expected build succeeds)

