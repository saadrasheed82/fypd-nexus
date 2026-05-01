## Goal

Replace the teacher dashboard’s demo-looking charts with **database-backed “progress over time”** charts that reflect supervised projects’ verified monthly task completion.

Scope: teacher dashboard only (`/tch/dashboard`), monthly granularity.

## Current state

- Teacher dashboard UI renders:
  - “Group progress” bar chart (uses `groups[]`)
  - “Top rankings” pie chart (uses `rankings[]`)
- Data comes from `GET /api/teacher/projects` which:
  - Queries Postgres for the teacher’s supervised projects
  - Hydrates projects with monthly tasks
  - Computes `groups` and `rankings` as averages of `projects.progress`
- `projects.progress` is stored in the `projects` table and updated via `recalculateProjectProgress(projectId)` based on `fydp_monthly_tasks` verification status.

## Requirements

- Show **monthly progress over time** in the teacher dashboard graph section.
- Charts must be driven by live database data (Postgres via existing `query()`).
- Must respect authorization: only the logged-in teacher can see aggregates for their supervised projects.
- Good UI behavior:
  - Loading state while metrics are fetched
  - Empty state when there are no supervised projects or no monthly tasks
  - Refresh button should re-fetch and update charts

## Definitions

### Monthly project progress (cumulative)

For a given project and month \(m\):

- Let:
  - \(T_m\) = number of monthly tasks with `month_number <= m`
  - \(V_m\) = number of those tasks where `status = 'verified'`
- Project progress at month \(m\):
  - \(P_m = round((V_m / T_m) * 100)\) if \(T_m > 0\), else \(0\)

This definition yields a monotonic non-decreasing progress curve per project as tasks get verified.

### Group monthly progress

For each month \(m\) and each teacher-supervised group:

- Compute \(P_m\) per project in the group
- Group’s month value is the arithmetic mean of those projects’ \(P_m\), rounded to integer

### Overall monthly progress

Compute the arithmetic mean of all supervised projects’ \(P_m\) for each month.

### Month range

- Determine the month range from the data:
  - `maxMonth = MAX(fydp_monthly_tasks.month_number)` over teacher-supervised projects
- Clamp to avoid overly wide charts:
  - `maxMonth = min(maxMonth, 12)`
- Months returned: `1..maxMonth`

## API design (recommended)

Add a dedicated endpoint:

- **Route**: `GET /api/teacher/dashboard/metrics`
- **Auth**: `requireUser("teacher")`
- **Response shape**:

```json
{
  "months": [1,2,3,4,5,6],
  "overall": [
    { "month": 1, "progress": 12 },
    { "month": 2, "progress": 24 }
  ],
  "byGroup": [
    {
      "group": "Group 1",
      "series": [
        { "month": 1, "progress": 10 },
        { "month": 2, "progress": 25 }
      ]
    }
  ],
  "topGroupsLatestMonth": [
    { "name": "Group 1", "progress": 68 },
    { "name": "Group 2", "progress": 61 }
  ]
}
```

Notes:
- `topGroupsLatestMonth` is optional, but allows keeping a “rankings” widget grounded in time. It should compute ranking for the latest month returned (maxMonth).

## Implementation notes (backend)

- Source of truth:
  - Projects: `projects` joined with `users` (student) to filter by teacher (`projects.supervisor_id = teacher.id`) and to read `student.student_group`
  - Monthly tasks: `fydp_monthly_tasks` for those project IDs
- Aggregation strategy:
  - Avoid per-project per-month loops that trigger many DB queries.
  - Fetch the supervised project IDs and their `student_group` in one query.
  - Fetch all monthly tasks for those project IDs in one query, then compute cumulative totals in memory.

## UI changes (teacher dashboard)

- Replace current “Group progress” chart with a **monthly trend** chart:
  - X axis = Month 1..N
  - Either:
    - One line per group (preferred if group count is small), or
    - Stacked/clustered bars (preferred if many groups)
- Replace “Top rankings” pie chart with:
  - “Top groups (latest month)” donut/pie OR a simple ranked list + optional mini chart.
- Keep existing loading/refresh patterns: re-use `load()` or add a separate `loadMetrics()`.

## Error handling

- API returns 401/unauthorized if not teacher.
- UI:
  - If metrics fetch fails, show a toast “Failed to load dashboard metrics.” and render an empty/placeholder state.

## Non-goals

- No weekly granularity.
- No student dashboard chart changes.
- No schema migrations beyond existing feature tables.

## Acceptance criteria

- Teacher dashboard graph section shows a monthly progress-over-time visualization based on verified monthly tasks.
- For a teacher with multiple groups, charts reflect correct group separation and ordering by month.
- For empty datasets (no tasks/projects), UI displays a clear empty state without crashing.

