function asInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function monthRange(maxMonth) {
  return Array.from({ length: Math.max(0, maxMonth) }, (_, index) => index + 1);
}

export function computeMonthlySeries({ projects, tasks, maxMonthCap = 12 }) {
  const monthValues = tasks.map((task) => asInt(task.month_number, 0)).filter((m) => m > 0);
  const maxMonth = Math.min(maxMonthCap, monthValues.length ? Math.max(...monthValues) : 0);
  const months = monthRange(maxMonth);

  const tasksByProject = new Map();
  for (const task of tasks) {
    const projectId = task.project_id;
    if (!projectId) continue;
    const list = tasksByProject.get(projectId) || [];
    list.push(task);
    tasksByProject.set(projectId, list);
  }

  const progressByProjectMonth = new Map(); // `${projectId}:${month}` => progress int
  for (const project of projects) {
    const projectId = project.projectId;
    const pts = (tasksByProject.get(projectId) || [])
      .slice()
      .sort((a, b) => asInt(a.month_number) - asInt(b.month_number));

    let total = 0;
    let verified = 0;
    let cursor = 0;

    for (const month of months) {
      while (cursor < pts.length && asInt(pts[cursor].month_number) <= month) {
        total += 1;
        if (pts[cursor].status === "verified") verified += 1;
        cursor += 1;
      }
      const progress = total ? Math.round((verified / total) * 100) : 0;
      progressByProjectMonth.set(`${projectId}:${month}`, progress);
    }
  }

  const groups = Array.from(new Set(projects.map((p) => p.group || "Unassigned")));
  const byGroup = groups.map((group) => {
    const groupProjects = projects.filter((p) => (p.group || "Unassigned") === group);
    const series = months.map((month) => {
      const values = groupProjects.map((p) => progressByProjectMonth.get(`${p.projectId}:${month}`) ?? 0);
      const avg = values.length ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length) : 0;
      return { month, progress: avg };
    });
    return { group, series };
  });

  const overall = months.map((month) => {
    const values = projects.map((p) => progressByProjectMonth.get(`${p.projectId}:${month}`) ?? 0);
    const avg = values.length ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length) : 0;
    return { month, progress: avg };
  });

  const latestMonth = months.at(-1) ?? 0;
  const topGroupsLatestMonth = latestMonth
    ? byGroup
        .map((group) => ({ name: group.group, progress: group.series.find((s) => s.month === latestMonth)?.progress ?? 0 }))
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 10)
    : [];

  return { months, byGroup, overall, topGroupsLatestMonth };
}

