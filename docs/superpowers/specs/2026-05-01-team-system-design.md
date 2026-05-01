# Team System Design

## Goal

Add a team proposal workflow where admins create credentials only for the student team lead. The team lead is the only student account that uses the app, and they submit a proposal containing their own information plus one or more additional team members.

## Requirements

- Admin continues to create student credentials for the team lead only.
- Team lead can submit a project proposal with team roster information.
- The team roster must include at least two students total: the lead plus at least one other member.
- Team size is variable with no fixed upper limit in the UI or API.
- Each team member stores full name, roll number, department, and CNIC.
- Teachers can see team member names while reviewing proposals.
- Other team members do not receive app credentials and do not log in.
- Existing `student_group` stays separate from project team membership.

## Architecture

### Data Model

Create a `project_team_members` table linked to `projects.id`.

Fields:
- `project_id`: owning project.
- `full_name`: team member full name.
- `roll_no`: university roll number.
- `department`: department name.
- `cnic`: CNIC value.
- `is_lead`: marks the authenticated student/team lead.
- `position`: preserves the order entered in the proposal form.

The team lead is stored as a team member too, so the teacher and dashboard views can render one unified roster.

### API Flow

`POST /api/student/project` accepts a `teamMembers` array along with proposal fields.

Validation rules:
- Proposal fields keep existing validation.
- `teamMembers` must contain at least two valid entries.
- Exactly one entry should be marked as lead; if not supplied, the first member is treated as lead.
- Each member requires full name, roll number, department, and CNIC.

Persistence rules:
- Create or update the `projects` row as today.
- Replace the roster for that project with the submitted members.
- Use a database transaction so proposal and roster stay consistent.

`GET /api/student/project` and teacher project listing responses include `teamMembers`.

### UI Flow

The student proposal form gets a new Team Members section:
- First row represents the team lead.
- Add/remove controls support any number of additional members.
- The lead row cannot be removed.
- Submission is blocked until at least one non-lead member exists.

Teacher-facing project data includes all member names and roll numbers so review screens can show the full team.

## Error Handling

- Missing member fields return a clear validation error.
- Less than two members returns a clear validation error.
- Invalid supervisor still uses the existing supervisor validation.
- If saving team members fails, the proposal change rolls back.

## Testing

Add focused tests for team roster validation and normalization if the project has a runnable test setup. If no test runner is configured, validate with static checks and a production build/lint command where available.

