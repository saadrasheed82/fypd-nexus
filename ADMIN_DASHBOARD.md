# Admin Dashboard - User Management

## Overview

The Admin Dashboard provides a comprehensive view of all users in the system with management capabilities.

## Features

### Dashboard Statistics
- **Total Users**: Count of all users in the system
- **Students**: Number of student accounts
- **Teachers**: Number of teacher accounts
- **Admins**: Number of admin accounts

### User Management
- View all users in a table format
- Search users by name or email
- Filter users by role (All, Students, Teachers, Admins)
- Delete users (with confirmation)
- View user details (avatar, email, role, department, join date)

### Navigation
- Quick access to Create Credentials page
- Seamless navigation between dashboard and credential creation

## Access

### Dashboard URL
```
http://localhost:3000/admin/dashboard
```

### Create Credentials URL
```
http://localhost:3000/admin
```

## Features in Detail

### 1. Statistics Cards

Four cards at the top showing:
- Total Users (blue)
- Students (green)
- Teachers (purple)
- Admins (orange)

These update in real-time based on filters and search.

### 2. Search Functionality

Search bar allows you to find users by:
- Name (case-insensitive)
- Email (case-insensitive)

Search is performed in real-time as you type.

### 3. Role Filter

Dropdown filter with options:
- All Users
- Students
- Teachers
- Admins

Filters update the user list and statistics immediately.

### 4. User Table

Displays user information:
- **Avatar**: Profile picture
- **Name**: Full name
- **Email**: Email address
- **Role**: Badge showing role (color-coded)
- **Department**: User department
- **Joined**: Account creation date
- **Actions**: Delete button

### 5. Delete User

Delete functionality:
- Click trash icon next to user
- Confirmation dialog appears
- User is deleted from database
- Cannot delete your own admin account
- Table refreshes automatically

## API Endpoints

### GET /api/admin/users

Fetch all users with optional filters.

**Query Parameters:**
- `role` (optional): Filter by role (student, teacher, admin)
- `search` (optional): Search by name or email

**Example:**
```
GET /api/admin/users?role=student&search=john
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science",
      "student_group": "New Group",
      "designation": null,
      "avatar": "https://...",
      "created_at": "2026-04-30T10:00:00Z"
    }
  ],
  "total": 1
}
```

### DELETE /api/admin/users

Delete a user by ID.

**Query Parameters:**
- `id` (required): User ID to delete

**Example:**
```
DELETE /api/admin/users?id=5
```

**Response:**
```json
{
  "message": "User deleted successfully",
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Cases:**
- 400: Missing user ID
- 400: Cannot delete your own account
- 404: User not found
- 401: Unauthorized (not admin)

## Security

### Access Control
- Only users with `admin` role can access dashboard
- All API endpoints check admin authentication
- Admins cannot delete their own account

### Data Protection
- Passwords are not displayed in the user list
- Only necessary user information is shown
- All database queries use parameterized statements

## UI Components

### Stat Cards
- Animated on load
- Color-coded by category
- Icon representation
- Real-time updates

### Search Bar
- Debounced search (updates on input)
- Clear placeholder text
- Search icon indicator

### Filter Dropdown
- Easy role selection
- Filter icon indicator
- Immediate filtering

### User Table
- Responsive design
- Hover effects on rows
- Staggered animation on load
- Avatar images
- Color-coded role badges
- Formatted dates

### Action Buttons
- Delete with confirmation
- Hover effects
- Icon-based actions
- Disabled states during loading

## Navigation Flow

```
Admin Login
    |
    v
/admin/dashboard (Main Dashboard)
    |
    +-- View all users
    +-- Search/Filter users
    +-- Delete users
    |
    +-- Click "Create Credentials" button
    |
    v
/admin (Create Credentials Page)
    |
    +-- Fill form
    +-- Create user
    +-- Send email/Download PDF
    |
    +-- Click "View Dashboard" button
    |
    v
Back to /admin/dashboard
```

## Files Created

```
app/
  admin/
    page.js                              [UPDATED] Added dashboard link
    dashboard/
      page.js                            [NEW] Dashboard UI
  api/
    admin/
      users/
        route.js                         [NEW] User management API
```

## Usage Examples

### View All Students
1. Go to `/admin/dashboard`
2. Select "Students" from filter dropdown
3. View all student accounts

### Search for a User
1. Go to `/admin/dashboard`
2. Type name or email in search bar
3. Results filter in real-time

### Delete a User
1. Go to `/admin/dashboard`
2. Find user in table
3. Click trash icon
4. Confirm deletion
5. User is removed

### Create New User
1. From dashboard, click "Create Credentials"
2. Fill in user details
3. Click "Create Credentials"
4. Send email or download PDF
5. Click "View Dashboard" to return

## Responsive Design

The dashboard is fully responsive:
- **Desktop**: Full table with all columns
- **Tablet**: Adjusted spacing and layout
- **Mobile**: Optimized for smaller screens

## Performance

- Lazy loading of user data
- Efficient database queries with indexes
- Client-side filtering for instant results
- Optimized animations
- Minimal re-renders

## Future Enhancements

- [ ] Bulk user operations
- [ ] Export users to CSV
- [ ] Edit user details
- [ ] User activity logs
- [ ] Advanced filtering options
- [ ] Pagination for large datasets
- [ ] User role management
- [ ] Password reset functionality

---

**Created**: April 30, 2026
**Version**: 1.0.0
**Status**: Production Ready
