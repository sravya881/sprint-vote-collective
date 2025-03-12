
# Entity-Relationship Diagram (ERD) for Sprint Retrospection App

```
+------------------+         +------------------+         +------------------+
|      teams       |         |       users      |         | sprint_boards    |
+------------------+         +------------------+         +------------------+
| id (PK)          |<----+   | id (PK)          |<----+   | id (PK)          |
| name             |     |   | windows_username |     |   | name             |
| description      |     |   | email            |     |   | date             |
| created_at       |     |   | full_name        |     |   | description      |
| updated_at       |     |   | employee_id      |     |   | team_id (FK)     |----+
| deleted_at       |     |   | department       |     |   | created_by (FK)  |--+ |
| admin_id (FK) ---+-----+---| is_admin         |     |   | created_at       | | |
+------------------+         | team_id (FK) ----+-----+---| updated_at       | | |
                             | created_at       |     |   | deleted_at       | | |
                             | updated_at       |     |   +------------------+ | |
                             | deleted_at       |     |                        | |
                             +------------------+     |                        | |
                                    ^                 |                        | |
                                    |                 |                        | |
+------------------+                |                 |                        | |
|      cards       |                |                 |                        | |
+------------------+                |                 |                        | |
| id (PK)          |                |                 |                        | |
| content          |                |                 |                        | |
| category         |                |                 |                        | |
| sprint_id (FK) --+----------------+-----------------+------------------------+ |
| author_id (FK) --+----------------+                                           |
| created_at       |                                                            |
| updated_at       |                v                                           |
| deleted_at       |       +------------------+                                 |
+------------------+       |       votes      |                                 |
        ^                  +------------------+                                 |
        |                  | id (PK)          |                                 |
        |                  | card_id (FK) ----+                                 |
        +------------------| user_id (FK) ----+---------------------------------+
                           | created_at       |
                           +------------------+
```

## Explanation of Relationships

1. **Teams and Users**:
   - One-to-many relationship: A team has many users
   - One-to-one relationship: A team has one admin user

2. **Teams and Sprint Boards**:
   - One-to-many relationship: A team has many sprint boards

3. **Users and Sprint Boards**:
   - One-to-many relationship: A user (admin) creates many sprint boards

4. **Sprint Boards and Cards**:
   - One-to-many relationship: A sprint board contains many cards

5. **Users and Cards**:
   - One-to-many relationship: A user authors many cards

6. **Cards and Votes**:
   - One-to-many relationship: A card receives many votes

7. **Users and Votes**:
   - One-to-many relationship: A user casts many votes

## Key Constraints and Business Rules

1. A user can belong to only one team
2. A team has exactly one admin
3. A sprint board belongs to one team
4. A card belongs to one sprint board
5. A user can vote only once per card
6. Cards must have one of four categories: good, bad, ideas, actions
7. Soft delete is implemented for teams, users, sprint boards, and cards
8. Users are authenticated via Windows authentication (windows_username)
