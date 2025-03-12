
-- Seed data for Sprint Retrospection App

-- Sample Teams
INSERT INTO teams (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Frontend Team', 'Responsible for user interface development'),
('22222222-2222-2222-2222-222222222222', 'Backend Team', 'Responsible for API and database development'),
('33333333-3333-3333-3333-333333333333', 'QA Team', 'Responsible for quality assurance and testing'),
('44444444-4444-4444-4444-444444444444', 'Design Team', 'UI/UX design and user research');

-- Sample Users
INSERT INTO users (id, windows_username, email, full_name, employee_id, department, is_admin, team_id) VALUES
-- Frontend Team
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'johndoe', 'john.doe@company.com', 'John Doe', 'EMP001', 'Engineering', TRUE, '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'janedoe', 'jane.doe@company.com', 'Jane Doe', 'EMP002', 'Engineering', FALSE, '11111111-1111-1111-1111-111111111111'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bobsmith', 'bob.smith@company.com', 'Bob Smith', 'EMP003', 'Engineering', FALSE, '11111111-1111-1111-1111-111111111111'),

-- Backend Team
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'alicejones', 'alice.jones@company.com', 'Alice Jones', 'EMP004', 'Engineering', TRUE, '22222222-2222-2222-2222-222222222222'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'charliebrown', 'charlie.brown@company.com', 'Charlie Brown', 'EMP005', 'Engineering', FALSE, '22222222-2222-2222-2222-222222222222'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'dianamiller', 'diana.miller@company.com', 'Diana Miller', 'EMP006', 'Engineering', FALSE, '22222222-2222-2222-2222-222222222222'),

-- QA Team
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'evanwilson', 'evan.wilson@company.com', 'Evan Wilson', 'EMP007', 'Quality Assurance', TRUE, '33333333-3333-3333-3333-333333333333'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'frankthomas', 'frank.thomas@company.com', 'Frank Thomas', 'EMP008', 'Quality Assurance', FALSE, '33333333-3333-3333-3333-333333333333'),

-- Design Team
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'gracemartinez', 'grace.martinez@company.com', 'Grace Martinez', 'EMP009', 'Design', TRUE, '44444444-4444-4444-4444-444444444444'),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'henryjackson', 'henry.jackson@company.com', 'Henry Jackson', 'EMP010', 'Design', FALSE, '44444444-4444-4444-4444-444444444444');

-- Update teams with admin_id
UPDATE teams SET admin_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE teams SET admin_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE teams SET admin_id = 'gggggggg-gggg-gggg-gggg-gggggggggggg' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE teams SET admin_id = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii' WHERE id = '44444444-4444-4444-4444-444444444444';

-- Sample Sprint Boards
INSERT INTO sprint_boards (id, name, date, description, team_id, created_by) VALUES
-- Frontend Team Sprints
('55555555-5555-5555-5555-555555555555', 'Frontend Sprint 42', '2023-10-01', 'Implemented new UI components', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('66666666-6666-6666-6666-666666666666', 'Frontend Sprint 43', '2023-10-15', 'Responsive design improvements', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),

-- Backend Team Sprints
('77777777-7777-7777-7777-777777777777', 'Backend Sprint 42', '2023-10-05', 'API performance optimization', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),

-- QA Team Sprints
('88888888-8888-8888-8888-888888888888', 'QA Sprint 42', '2023-10-10', 'Automation testing framework', '33333333-3333-3333-3333-333333333333', 'gggggggg-gggg-gggg-gggg-gggggggggggg');

-- Sample Cards for Frontend Sprint 42
INSERT INTO cards (id, content, category, sprint_id, author_id) VALUES
-- Good cards
('aabb1111-1111-1111-1111-111111111111', 'Successfully implemented new UI components ahead of schedule', 'good', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('aabb2222-2222-2222-2222-222222222222', 'Great collaboration with the design team', 'good', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('aabb3333-3333-3333-3333-333333333333', 'Code reviews were thorough and helpful', 'good', '55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

-- Bad cards
('aabb4444-4444-4444-4444-444444444444', 'Too many meetings disrupted development flow', 'bad', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('aabb5555-5555-5555-5555-555555555555', 'Some technical debt was accumulated', 'bad', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),

-- Ideas cards
('aabb6666-6666-6666-6666-666666666666', 'Implement pair programming for complex features', 'ideas', '55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('aabb7777-7777-7777-7777-777777777777', 'Create a component library for reusable UI elements', 'ideas', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),

-- Actions cards
('aabb8888-8888-8888-8888-888888888888', 'Schedule dedicated focus time with no meetings', 'actions', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('aabb9999-9999-9999-9999-999999999999', 'Set up automated tests for all new components', 'actions', '55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- Sample Cards for Backend Sprint 42
INSERT INTO cards (id, content, category, sprint_id, author_id) VALUES
-- Good cards
('bbcc1111-1111-1111-1111-111111111111', 'API response time improved by 30%', 'good', '77777777-7777-7777-7777-777777777777', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('bbcc2222-2222-2222-2222-222222222222', 'Successfully implemented caching strategy', 'good', '77777777-7777-7777-7777-777777777777', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),

-- Bad cards
('bbcc3333-3333-3333-3333-333333333333', 'Database migrations took longer than expected', 'bad', '77777777-7777-7777-7777-777777777777', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),

-- Ideas cards
('bbcc4444-4444-4444-4444-444444444444', 'Implement GraphQL for more efficient data fetching', 'ideas', '77777777-7777-7777-7777-777777777777', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),

-- Actions cards
('bbcc5555-5555-5555-5555-555555555555', 'Create a more detailed database migration plan for future sprints', 'actions', '77777777-7777-7777-7777-777777777777', 'dddddddd-dddd-dddd-dddd-dddddddddddd');

-- Sample Votes
-- Votes for Frontend Sprint 42 cards
INSERT INTO votes (card_id, user_id) VALUES
-- Votes for "Successfully implemented new UI components ahead of schedule"
('aabb1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('aabb1111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('aabb1111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

-- Votes for "Great collaboration with the design team"
('aabb2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('aabb2222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

-- Votes for "Too many meetings disrupted development flow"
('aabb4444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('aabb4444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('aabb4444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

-- Votes for "Implement pair programming for complex features"
('aabb6666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('aabb6666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

-- Votes for Backend Sprint 42 cards
INSERT INTO votes (card_id, user_id) VALUES
-- Votes for "API response time improved by 30%"
('bbcc1111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('bbcc1111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('bbcc1111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),

-- Votes for "Database migrations took longer than expected"
('bbcc3333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('bbcc3333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');
