
# Sprint Retrospection App - Database Documentation

This documentation provides an overview of the database schema for the Sprint Retrospection App. The schema is designed for PostgreSQL and implements all required features including Windows Authentication, role-based access control, team management, sprint boards, and retrospection cards with voting.

## Table Structure

### Teams
- Primary key: `id` (UUID)
- Stores team information and has a reference to the admin user
- Contains soft delete (`deleted_at`) for data recovery

### Users
- Primary key: `id` (UUID)
- Stores user information including Windows username for authentication
- References the team they belong to
- Has an `is_admin` flag to indicate administrative privileges
- Contains soft delete (`deleted_at`) for data recovery

### Sprint Boards
- Primary key: `id` (UUID)
- References the team it belongs to and the user who created it
- Contains soft delete (`deleted_at`) for data recovery

### Cards
- Primary key: `id` (UUID)
- Stores retrospection cards with categories: good, bad, ideas, actions
- References the sprint board it belongs to and the author
- Contains soft delete (`deleted_at`) for data recovery

### Votes
- Primary key: `id` (UUID)
- Implements the voting system by linking users to cards they voted for
- Has a unique constraint to ensure a user can only vote once per card

## Windows Authentication Integration

The database schema is designed to work with Windows Authentication:

1. Users are authenticated via their Windows credentials
2. The `windows_username` field in the `users` table stores the Windows username (e.g., "DOMAIN\\username")
3. When a user accesses the application, their Windows identity is matched against the `windows_username` field
4. No passwords are stored in the database, as authentication is handled by Windows

## Views

### view_card_details
- Provides card information with vote counts and author details
- Used to display cards in the UI

### view_sprint_boards
- Provides sprint board information with team name, creator, and card count
- Used to display sprint boards in the UI

## Functions

The schema includes several utility functions:

### update_timestamp()
- Updates the `updated_at` timestamp whenever a record is modified

### Role-based access control functions:
- `is_team_admin(user_id, team_id)` - Checks if a user is an admin of a team
- `is_team_member(user_id, team_id)` - Checks if a user belongs to a team
- `can_access_sprint(user_id, sprint_id)` - Checks if a user can access a sprint board

## Usage

### Setup
1. Create a PostgreSQL database
2. Run the `schema.sql` script to create the tables, views, and functions
3. Run the `seed.sql` script to populate the database with sample data

### Windows Authentication Configuration
1. Ensure your .NET backend is configured to use Windows Authentication
2. Configure your database connection to use integrated security
3. Map incoming Windows identities to the `windows_username` field in the `users` table

### Sample Queries

#### Get user details from Windows username
```sql
SELECT * FROM users WHERE windows_username = 'DOMAIN\\username';
```

#### Get all sprint boards for a user's team
```sql
SELECT * FROM view_sprint_boards 
WHERE team_id = (SELECT team_id FROM users WHERE windows_username = 'DOMAIN\\username');
```

#### Get all cards for a specific sprint board
```sql
SELECT * FROM view_card_details 
WHERE sprint_id = 'sprint_id_here' 
ORDER BY category, vote_count DESC;
```

#### Check if a user can access a sprint board
```sql
SELECT can_access_sprint('user_id_here', 'sprint_id_here');
```

#### Get all voters for a card (admin view)
```sql
SELECT u.full_name, u.employee_id, v.created_at 
FROM votes v 
JOIN users u ON v.user_id = u.id 
WHERE v.card_id = 'card_id_here';
```

## Entity-Relationship Diagram

Please refer to the `erd.md` file for a visual representation of the database schema and relationships between tables.
