
-- Sprint Retrospection App Schema

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------
-- Table: teams
-- -----------------------------------------------------
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    admin_id UUID, -- Will be updated after users table is created
    CONSTRAINT teams_name_unique UNIQUE (name)
);

CREATE INDEX idx_teams_admin_id ON teams(admin_id);
CREATE INDEX idx_teams_deleted_at ON teams(deleted_at);

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    windows_username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50),
    department VARCHAR(100),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    team_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_windows_username_unique UNIQUE (windows_username),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_employee_id_unique UNIQUE (employee_id),
    CONSTRAINT fk_users_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_users_windows_username ON users(windows_username);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Update teams table with admin_id foreign key
ALTER TABLE teams 
ADD CONSTRAINT fk_teams_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL;

-- -----------------------------------------------------
-- Table: sprint_boards
-- -----------------------------------------------------
CREATE TABLE sprint_boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    team_id UUID NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_sprint_boards_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_sprint_boards_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sprint_boards_team_id ON sprint_boards(team_id);
CREATE INDEX idx_sprint_boards_created_by ON sprint_boards(created_by);
CREATE INDEX idx_sprint_boards_deleted_at ON sprint_boards(deleted_at);

-- -----------------------------------------------------
-- Table: cards
-- -----------------------------------------------------
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    sprint_id UUID NOT NULL,
    author_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_cards_sprint FOREIGN KEY (sprint_id) REFERENCES sprint_boards(id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT cards_category_check CHECK (category IN ('good', 'bad', 'ideas', 'actions'))
);

CREATE INDEX idx_cards_sprint_id ON cards(sprint_id);
CREATE INDEX idx_cards_author_id ON cards(author_id);
CREATE INDEX idx_cards_category ON cards(category);
CREATE INDEX idx_cards_deleted_at ON cards(deleted_at);

-- -----------------------------------------------------
-- Table: votes
-- -----------------------------------------------------
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_votes_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_votes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT votes_card_user_unique UNIQUE (card_id, user_id)
);

CREATE INDEX idx_votes_card_id ON votes(card_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- -----------------------------------------------------
-- Views
-- -----------------------------------------------------

-- View for card details with vote counts
CREATE OR REPLACE VIEW view_card_details AS
SELECT 
    c.id,
    c.content,
    c.category,
    c.sprint_id,
    c.author_id,
    u.full_name AS author_name,
    c.created_at,
    COUNT(v.id) AS vote_count
FROM 
    cards c
LEFT JOIN 
    votes v ON c.id = v.card_id
JOIN 
    users u ON c.author_id = u.id
WHERE 
    c.deleted_at IS NULL
GROUP BY 
    c.id, u.full_name;

-- View for sprint boards with card counts
CREATE OR REPLACE VIEW view_sprint_boards AS
SELECT 
    sb.id,
    sb.name,
    sb.date,
    sb.description,
    sb.team_id,
    t.name AS team_name,
    sb.created_by,
    u.full_name AS created_by_name,
    COUNT(c.id) AS card_count
FROM 
    sprint_boards sb
JOIN 
    teams t ON sb.team_id = t.id
JOIN 
    users u ON sb.created_by = u.id
LEFT JOIN 
    cards c ON sb.id = c.sprint_id AND c.deleted_at IS NULL
WHERE 
    sb.deleted_at IS NULL
GROUP BY 
    sb.id, t.name, u.full_name;

-- -----------------------------------------------------
-- Functions & Triggers
-- -----------------------------------------------------

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update 'updated_at'
CREATE TRIGGER update_teams_timestamp
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_sprint_boards_timestamp
BEFORE UPDATE ON sprint_boards
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cards_timestamp
BEFORE UPDATE ON cards
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- -----------------------------------------------------
-- Sample queries
-- -----------------------------------------------------

-- 1. Get all sprint boards for a specific team
-- SELECT * FROM view_sprint_boards WHERE team_id = 'team_id_here';

-- 2. Get all cards for a specific sprint board
-- SELECT * FROM view_card_details WHERE sprint_id = 'sprint_id_here' ORDER BY category, vote_count DESC;

-- 3. Get all votes for a specific card with voter details (admin view)
-- SELECT v.id, u.full_name, u.employee_id, v.created_at 
-- FROM votes v 
-- JOIN users u ON v.user_id = u.id 
-- WHERE v.card_id = 'card_id_here';

-- 4. Check if a user has voted for a specific card
-- SELECT EXISTS(SELECT 1 FROM votes WHERE card_id = 'card_id_here' AND user_id = 'user_id_here');

-- 5. Get all team members for a specific team
-- SELECT id, full_name, email, employee_id, department, is_admin 
-- FROM users 
-- WHERE team_id = 'team_id_here' AND deleted_at IS NULL;

-- -----------------------------------------------------
-- Role-based access control functions
-- -----------------------------------------------------

-- Check if a user is an admin of a team
CREATE OR REPLACE FUNCTION is_team_admin(user_id UUID, check_team_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM teams 
        WHERE id = check_team_id AND admin_id = user_id AND deleted_at IS NULL
    ) INTO is_admin;
    
    RETURN is_admin;
END;
$$ LANGUAGE plpgsql;

-- Check if a user belongs to a team
CREATE OR REPLACE FUNCTION is_team_member(user_id UUID, check_team_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_member BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM users 
        WHERE id = user_id AND team_id = check_team_id AND deleted_at IS NULL
    ) INTO is_member;
    
    RETURN is_member;
END;
$$ LANGUAGE plpgsql;

-- Check if a user can access a sprint board
CREATE OR REPLACE FUNCTION can_access_sprint(user_id UUID, sprint_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    team_id UUID;
    is_access_allowed BOOLEAN;
BEGIN
    -- Get the team ID of the sprint
    SELECT sb.team_id INTO team_id
    FROM sprint_boards sb
    WHERE sb.id = sprint_id AND sb.deleted_at IS NULL;
    
    -- Check if user is a member of the team or an admin
    SELECT 
        EXISTS(
            SELECT 1 FROM users 
            WHERE id = user_id AND team_id = team_id AND deleted_at IS NULL
        ) OR 
        EXISTS(
            SELECT 1 FROM teams 
            WHERE id = team_id AND admin_id = user_id AND deleted_at IS NULL
        )
    INTO is_access_allowed;
    
    RETURN is_access_allowed;
END;
$$ LANGUAGE plpgsql;
