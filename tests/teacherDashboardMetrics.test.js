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
    { project_id: "p1", month_number: 1, status: "verified" },
    { project_id: "p1", month_number: 2, status: "submitted" },

    { project_id: "p2", month_number: 1, status: "verified" },
    { project_id: "p2", month_number: 2, status: "verified" },

    { project_id: "p3", month_number: 1, status: "pending" },
    { project_id: "p3", month_number: 2, status: "pending" },
  ];

  const out = computeMonthlySeries({ projects, tasks, maxMonthCap: 12 });

  assert.deepEqual(out.months, [1, 2]);

  assert.deepEqual(out.byGroup.find((g) => g.group === "Group 1").series, [
    { month: 1, progress: 100 },
    { month: 2, progress: 75 },
  ]);

  assert.deepEqual(out.byGroup.find((g) => g.group === "Group 2").series, [
    { month: 1, progress: 0 },
    { month: 2, progress: 0 },
  ]);

  assert.deepEqual(out.overall, [
    { month: 1, progress: 67 },
    { month: 2, progress: 50 },
  ]);

  assert.deepEqual(out.topGroupsLatestMonth, [
    { name: "Group 1", progress: 75 },
    { name: "Group 2", progress: 0 },
  ]);
});

