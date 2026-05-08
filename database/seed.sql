-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================

INSERT INTO departments (dept_name, dept_code) VALUES
('Faculty of Computer Science and Electrical Engineering',          'FCSE'),
('Faculty of Mechanical Engineering',                               'FME'),
('Faculty of Materials and Chemical Engineering',                   'FMCE'),
('Brabers Building (School of Management Sciences and Humanities)', 'BB'),
('Faculty of Basic Sciences',                                       'FBS'),
('New Academic Block (Faculty of Civil Engineering)',                'NAB');


-- ============================================================
-- 2. ROLES
-- ============================================================

INSERT INTO roles (role_name, permissions) VALUES
('Admin',           'full_access'),
('Faculty',         'book_facility, view_analytics'),
('Student',         'book_facility'),
('Society Head',    'book_facility, manage_society_bookings');


-- ============================================================
-- 3. USERS
-- password hash = bcrypt of '********'
-- ============================================================

INSERT INTO users (full_name, email, password_hash, role_id, department_id, reg_number, is_active, created_by) VALUES

-- Admin (created_by NULL as he is the root user)
(
    'System Admin',
    'admin@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Admin'),
    NULL,
    NULL,
    TRUE,
    NULL
),

-- Faculty
(
    'Dr. Ahmed Khan',
    'ahmed.khan@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Faculty'),
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE'),
    NULL,
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),
(
    'Dr. Sara Malik',
    'sara.malik@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Faculty'),
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE'),
    NULL,
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),
(
    'Dr. Usman Tariq',
    'usman.tariq@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Faculty'),
    (SELECT department_id FROM departments WHERE dept_code = 'FME'),
    NULL,
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),

-- Students
(
    'Reyan Kashif',
    'reyan.kashif@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Student'),
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE'),
    '2024538',
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),
(
    'Ghazali Khan',
    'ghazali.khan@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Student'),
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE'),
    '2024380',
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),
(
    'Sohaib Bin Tausif',
    'sohaib.tausif@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Student'),
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE'),
    '2024595',
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),
(
    'Ali Hassan',
    'ali.hassan@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Student'),
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE'),
    '2023112',
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),
(
    'Zara Ahmed',
    'zara.ahmed@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Student'),
    (SELECT department_id FROM departments WHERE dept_code = 'FME'),
    '2023245',
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
),

-- Society Head
(
    'Hamza Rauf',
    'hamza.rauf@giki.edu.pk',
    '$2b$10$XH5QWJx8mdR31K26RSdKJeEnrCqVS.FDL7dVd64iG6a8dNvOspzuu',
    (SELECT role_id FROM roles WHERE role_name = 'Society Head'),
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE'),
    '2022401',
    TRUE,
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk')
);


-- ============================================================
-- 4. FACILITIES
-- ============================================================

INSERT INTO facilities (facility_name, facility_type, capacity, location, department_id, is_available) VALUES

-- Labs (FCSE)
('Software Engineering Lab',    'Lab', 40, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),
('Robotics & AI Lab',           'Lab', 30, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),
('Programming & Computing Lab', 'Lab', 40, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),

-- Labs (NAB)
('Cyber Lab',                   'Lab', 40, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('Data Analytics Lab',          'Lab', 40, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('Artificial Intelligence Lab', 'Lab', 40, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),

-- NAB Lecture Halls
('NAB LH-1',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-2',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-3',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-4',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-5',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-6',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-7',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-8',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-9',  'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-10', 'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-11', 'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB LH-12', 'Classroom', 70, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),

-- NAB Main Lecture Halls
('NAB MLH-1', 'Classroom', 150, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB MLH-2', 'Classroom', 150, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),
('NAB MLH-3', 'Classroom', 150, 'NAB', (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),

-- FCSE Lecture Halls
('FCSE LH-1', 'Classroom', 70, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),
('FCSE LH-2', 'Classroom', 70, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),
('FCSE LH-3', 'Classroom', 70, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),
('FCSE LH-4', 'Classroom', 70, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),

-- Faculty MLHs
('FCSE MLH',  'Classroom', 150, 'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),
('FBS MLH',   'Classroom', 150, 'FBS Building',  (SELECT department_id FROM departments WHERE dept_code = 'FBS'),  TRUE),
('FMCE MLH',  'Classroom', 150, 'FMCE Building', (SELECT department_id FROM departments WHERE dept_code = 'FMCE'), TRUE),

-- Seminar Halls
('FCSE Seminar Hall', 'Seminar Hall', 80,  'FCSE Building', (SELECT department_id FROM departments WHERE dept_code = 'FCSE'), TRUE),
('Faculty Club',      'Seminar Hall', 200, 'Main Campus',   NULL, TRUE),
('Conference Room',   'Seminar Hall', 30,  'NAB',           (SELECT department_id FROM departments WHERE dept_code = 'NAB'), TRUE),

-- Sports
('Cricket Ground',   'Sports Ground', 2000, 'Sports Complex', NULL, TRUE),
('Football Ground',  'Sports Ground', 2000, 'Sports Complex', NULL, TRUE),
('Tennis Court',     'Sports Ground', 20,   'Sports Complex', NULL, TRUE),
('Basketball Court', 'Sports Ground', 30,   'Sports Complex', NULL, TRUE),
('Futsal Court',     'Sports Ground', 30,   'Sports Complex', NULL, TRUE),

-- Auditorium
('Aagha Hassan Abdi Auditorium', 'Auditorium', 1000, 'Main Campus', NULL, TRUE);


-- ============================================================
-- 5. EQUIPMENT
-- ============================================================

INSERT INTO equipment (equipment_name, equipment_type, quantity, facility_id, condition) VALUES

-- Software Engineering Lab
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Software Engineering Lab'),  'Good'),
('Computers',   'Computer',     40, (SELECT facility_id FROM facilities WHERE facility_name = 'Software Engineering Lab'),  'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Software Engineering Lab'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Software Engineering Lab'),  'Good'),

-- Robotics & AI Lab
('Computers',   'Computer',     30, (SELECT facility_id FROM facilities WHERE facility_name = 'Robotics & AI Lab'),         'Good'),
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Robotics & AI Lab'),         'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Robotics & AI Lab'),         'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Robotics & AI Lab'),         'Good'),

-- Programming & Computing Lab
('Computers',   'Computer',     40, (SELECT facility_id FROM facilities WHERE facility_name = 'Programming & Computing Lab'), 'Good'),
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Programming & Computing Lab'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Programming & Computing Lab'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Programming & Computing Lab'), 'Good'),

-- Cyber Lab
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab'),                 'Good'),
('Computers',   'Computer',     40, (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab'),                 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab'),                 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab'),                 'Good'),

-- Data Analytics Lab
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Data Analytics Lab'),        'Good'),
('Computers',   'Computer',     40, (SELECT facility_id FROM facilities WHERE facility_name = 'Data Analytics Lab'),        'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Data Analytics Lab'),        'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Data Analytics Lab'),        'Good'),

-- Artificial Intelligence Lab
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Artificial Intelligence Lab'), 'Good'),
('Computers',   'Computer',     40, (SELECT facility_id FROM facilities WHERE facility_name = 'Artificial Intelligence Lab'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Artificial Intelligence Lab'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Artificial Intelligence Lab'), 'Good'),

-- NAB LH-1 to NAB LH-12 (Projector + Whiteboard + AC each)
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-1'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-1'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-1'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-2'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-2'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-2'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-3'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-3'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-3'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-4'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-4'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-4'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-5'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-5'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-5'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-6'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-6'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-6'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-7'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-7'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-7'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-8'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-8'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-8'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-9'),  'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-9'),  'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-9'),  'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-10'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-10'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-10'), 'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-11'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-11'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-11'), 'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-12'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-12'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-12'), 'Good'),

-- NAB MLH-1 to NAB MLH-3 (Projector + Whiteboard + AC + Speaker)
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-1'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-1'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-1'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-1'), 'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-2'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-2'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-2'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-2'), 'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-3'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-3'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-3'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-3'), 'Good'),

-- FCSE LH-1 to FCSE LH-4 (Projector + Whiteboard + AC each)
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-1'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-1'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-1'), 'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-2'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-2'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-2'), 'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-3'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-3'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-3'), 'Good'),

('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-4'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-4'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE LH-4'), 'Good'),

-- FCSE MLH (Projector + Whiteboard + AC + Speaker)
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE MLH'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE MLH'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE MLH'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE MLH'), 'Good'),

-- FBS MLH
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FBS MLH'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FBS MLH'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FBS MLH'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FBS MLH'), 'Good'),

-- FMCE MLH
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FMCE MLH'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FMCE MLH'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FMCE MLH'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FMCE MLH'), 'Good'),

-- FCSE Seminar Hall
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE Seminar Hall'), 'Good'),
('Whiteboard',  'Whiteboard',   2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE Seminar Hall'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE Seminar Hall'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE Seminar Hall'), 'Good'),

-- Faculty Club
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Faculty Club'), 'Good'),
('Speaker',     'Speaker',      2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Faculty Club'), 'Good'),
('AC Unit',     'AC',           2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Faculty Club'), 'Good'),

-- Conference Room
('Projector',   'Projector',    1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Conference Room'), 'Good'),
('Whiteboard',  'Whiteboard',   1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Conference Room'), 'Good'),
('AC Unit',     'AC',           1,  (SELECT facility_id FROM facilities WHERE facility_name = 'Conference Room'), 'Good'),

-- Aagha Hassan Abdi Auditorium
('Projector',   'Projector',    2,  (SELECT facility_id FROM facilities WHERE facility_name = 'Aagha Hassan Abdi Auditorium'), 'Good'),
('AC Unit',     'AC',           6,  (SELECT facility_id FROM facilities WHERE facility_name = 'Aagha Hassan Abdi Auditorium'), 'Good'),
('Speaker',     'Speaker',      8,  (SELECT facility_id FROM facilities WHERE facility_name = 'Aagha Hassan Abdi Auditorium'), 'Good');


-- ============================================================
-- 6. BOOKING REQUESTS
-- ============================================================

INSERT INTO booking_requests (user_id, facility_id, start_time, end_time, purpose, status, attendees_count) VALUES

-- Approved bookings
(
    (SELECT user_id FROM users WHERE email = 'ahmed.khan@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab'),
    '2026-04-14 09:00:00', '2026-04-14 11:00:00',
    'CS232 Lab Session', 'Approved', 35
),
(
    (SELECT user_id FROM users WHERE email = 'sara.malik@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-1'),
    '2026-04-14 11:00:00', '2026-04-14 13:00:00',
    'EE301 Lecture', 'Approved', 120
),
(
    (SELECT user_id FROM users WHERE email = 'reyan.kashif@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Data Analytics Lab'),
    '2026-04-15 14:00:00', '2026-04-15 16:00:00',
    'Final Year Project Meeting', 'Approved', 10
),
(
    (SELECT user_id FROM users WHERE email = 'hamza.rauf@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Aagha Hassan Abdi Auditorium'),
    '2026-04-20 17:00:00', '2026-04-20 21:00:00',
    'GDSC GIK Annual Tech Fest', 'Approved', 800
),
(
    (SELECT user_id FROM users WHERE email = 'usman.tariq@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-5'),
    '2026-04-16 08:00:00', '2026-04-16 10:00:00',
    'ME201 Lecture', 'Approved', 60
),

-- Pending bookings
(
    (SELECT user_id FROM users WHERE email = 'ghazali.khan@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'FCSE Seminar Hall'),
    '2026-04-17 10:00:00', '2026-04-17 12:00:00',
    'Database Project Presentation Practice', 'Pending', 20
),
(
    (SELECT user_id FROM users WHERE email = 'sohaib.tausif@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Artificial Intelligence Lab'),
    '2026-04-18 13:00:00', '2026-04-18 15:00:00',
    'AI Course Project Demo', 'Pending', 15
),
(
    (SELECT user_id FROM users WHERE email = 'zara.ahmed@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Football Ground'),
    '2026-04-19 15:00:00', '2026-04-19 17:00:00',
    'Inter-department Football Match', 'Pending', 30
),

-- Rejected bookings
(
    (SELECT user_id FROM users WHERE email = 'ali.hassan@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Aagha Hassan Abdi Auditorium'),
    '2026-04-14 18:00:00', '2026-04-14 22:00:00',
    'Farewell Party', 'Rejected', 400
),
(
    (SELECT user_id FROM users WHERE email = 'reyan.kashif@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-2'),
    '2026-04-15 09:00:00', '2026-04-15 11:00:00',
    'Study Group Session', 'Rejected', 140
),

-- Cancelled booking
(
    (SELECT user_id FROM users WHERE email = 'hamza.rauf@giki.edu.pk'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Basketball Court'),
    '2026-04-13 16:00:00', '2026-04-13 18:00:00',
    'GDSC Sports Event', 'Cancelled', 25
);


-- ============================================================
-- 7. APPROVED BOOKINGS
-- (Only for requests with status = 'Approved')
-- ============================================================

INSERT INTO approved_bookings (request_id, facility_id, user_id, start_time, end_time) VALUES
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'CS232 Lab Session'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab'),
    (SELECT user_id FROM users WHERE email = 'ahmed.khan@giki.edu.pk'),
    '2026-04-14 09:00:00', '2026-04-14 11:00:00'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'EE301 Lecture'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-1'),
    (SELECT user_id FROM users WHERE email = 'sara.malik@giki.edu.pk'),
    '2026-04-14 11:00:00', '2026-04-14 13:00:00'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'Final Year Project Meeting'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Data Analytics Lab'),
    (SELECT user_id FROM users WHERE email = 'reyan.kashif@giki.edu.pk'),
    '2026-04-15 14:00:00', '2026-04-15 16:00:00'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'GDSC GIK Annual Tech Fest'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'Aagha Hassan Abdi Auditorium'),
    (SELECT user_id FROM users WHERE email = 'hamza.rauf@giki.edu.pk'),
    '2026-04-20 17:00:00', '2026-04-20 21:00:00'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'ME201 Lecture'),
    (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-5'),
    (SELECT user_id FROM users WHERE email = 'usman.tariq@giki.edu.pk'),
    '2026-04-16 08:00:00', '2026-04-16 10:00:00'
);


-- ============================================================
-- 8. APPROVAL RECORDS
-- ============================================================

INSERT INTO approval_records (request_id, admin_id, action, remarks) VALUES

-- Approved
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'CS232 Lab Session'),
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
    'Approved', 'Regular faculty session, approved.'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'EE301 Lecture'),
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
    'Approved', 'Regular faculty session, approved.'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'Final Year Project Meeting'),
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
    'Approved', 'FYP meeting approved.'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'GDSC GIK Annual Tech Fest'),
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
    'Approved', 'Society event approved by admin.'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'ME201 Lecture'),
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
    'Approved', 'Regular faculty session, approved.'
),

-- Rejected
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'Farewell Party'),
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
    'Rejected', 'Auditorium reserved for official events only. Personal events not permitted.'
),
(
    (SELECT request_id FROM booking_requests WHERE purpose = 'Study Group Session'),
    (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
    'Rejected', 'NAB MLH-2 capacity exceeds requirement. Please book a smaller facility.'
);


-- ============================================================
-- 9. USAGE ANALYTICS
-- (Manually inserted for approved bookings for demonstration)
-- In production this is handled by the trigger automatically
-- ============================================================

INSERT INTO usage_analytics (facility_id, booking_id, date, hour_of_day, duration_minutes, department_id) VALUES
(
    (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab'),
    (SELECT booking_id FROM approved_bookings WHERE start_time = '2026-04-14 09:00:00'),
    '2026-04-14', 9, 120,
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE')
),
(
    (SELECT facility_id FROM facilities WHERE facility_name = 'NAB MLH-1'),
    (SELECT booking_id FROM approved_bookings WHERE start_time = '2026-04-14 11:00:00'),
    '2026-04-14', 11, 120,
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE')
),
(
    (SELECT facility_id FROM facilities WHERE facility_name = 'Data Analytics Lab'),
    (SELECT booking_id FROM approved_bookings WHERE start_time = '2026-04-15 14:00:00'),
    '2026-04-15', 14, 120,
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE')
),
(
    (SELECT facility_id FROM facilities WHERE facility_name = 'Aagha Hassan Abdi Auditorium'),
    (SELECT booking_id FROM approved_bookings WHERE start_time = '2026-04-20 17:00:00'),
    '2026-04-20', 17, 240,
    (SELECT department_id FROM departments WHERE dept_code = 'FCSE')
),
(
    (SELECT facility_id FROM facilities WHERE facility_name = 'NAB LH-5'),
    (SELECT booking_id FROM approved_bookings WHERE start_time = '2026-04-16 08:00:00'),
    '2026-04-16', 8, 120,
    (SELECT department_id FROM departments WHERE dept_code = 'FME')
);


-- ============================================================
-- END OF SEED DATA
-- ============================================================
