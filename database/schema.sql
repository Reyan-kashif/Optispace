DROP TABLE IF EXISTS usage_analytics    CASCADE;
DROP TABLE IF EXISTS approval_records   CASCADE;
DROP TABLE IF EXISTS approved_bookings  CASCADE;
DROP TABLE IF EXISTS booking_requests   CASCADE;
DROP TABLE IF EXISTS equipment          CASCADE;
DROP TABLE IF EXISTS facilities         CASCADE;
DROP TABLE IF EXISTS users              CASCADE;
DROP TABLE IF EXISTS roles              CASCADE;
DROP TABLE IF EXISTS departments        CASCADE;


-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================

CREATE TABLE departments (
    department_id   SERIAL          PRIMARY KEY,
    dept_name       VARCHAR(100)    NOT NULL UNIQUE,
    dept_code       VARCHAR(10)     NOT NULL UNIQUE,
    created_at      TIMESTAMP       DEFAULT NOW()
);


-- ============================================================
-- 2. ROLES
-- ============================================================

CREATE TABLE roles (
    role_id         SERIAL          PRIMARY KEY,
    role_name       VARCHAR(50)     NOT NULL UNIQUE,
    -- 'Admin', 'Faculty', 'Student', 'Society Head'
    permissions     TEXT,
    created_at      TIMESTAMP       DEFAULT NOW()
);


-- ============================================================
-- 3. USERS
-- ============================================================

CREATE TABLE users (
    user_id         SERIAL          PRIMARY KEY,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    role_id         INT             NOT NULL REFERENCES roles(role_id)          ON DELETE RESTRICT,
    department_id   INT             REFERENCES departments(department_id)        ON DELETE SET NULL,
    reg_number      VARCHAR(20)     UNIQUE,         -- for students only
    is_active       BOOLEAN         DEFAULT TRUE,
    created_by      INT             REFERENCES users(user_id)                   ON DELETE SET NULL,
    -- self-referencing: which admin created this user
    created_at      TIMESTAMP       DEFAULT NOW()
);


-- ============================================================
-- 4. FACILITIES
-- ============================================================

CREATE TABLE facilities (
    facility_id     SERIAL          PRIMARY KEY,
    facility_name   VARCHAR(100)    NOT NULL,
    facility_type   VARCHAR(50)     NOT NULL,
    -- 'Classroom', 'Lab', 'Seminar Hall', 'Sports Ground'
    capacity        INT             NOT NULL CHECK (capacity > 0),
    location        VARCHAR(100),
    department_id   INT             REFERENCES departments(department_id)        ON DELETE SET NULL,
    is_available    BOOLEAN         DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT NOW()
);


-- ============================================================
-- 5. EQUIPMENT  (informational - what a facility has)
-- ============================================================

CREATE TABLE equipment (
    equipment_id    SERIAL          PRIMARY KEY,
    equipment_name  VARCHAR(100)    NOT NULL,
    equipment_type  VARCHAR(50),
    -- 'Projector', 'Whiteboard', 'AC', 'Computer', 'Speaker'
    quantity        INT             NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    facility_id     INT             NOT NULL REFERENCES facilities(facility_id)  ON DELETE CASCADE,
    condition       VARCHAR(20)     DEFAULT 'Good',
    -- 'Good', 'Needs Repair', 'Out of Service'
    created_at      TIMESTAMP       DEFAULT NOW()
);


-- ============================================================
-- 6. BOOKING REQUESTS
-- ============================================================

CREATE TABLE booking_requests (
    request_id      SERIAL          PRIMARY KEY,
    user_id         INT             NOT NULL REFERENCES users(user_id)           ON DELETE CASCADE,
    facility_id     INT             NOT NULL REFERENCES facilities(facility_id)  ON DELETE CASCADE,
    start_time      TIMESTAMP       NOT NULL,
    end_time        TIMESTAMP       NOT NULL,
    purpose         TEXT            NOT NULL,
    status          VARCHAR(20)     DEFAULT 'Pending',
    -- 'Pending', 'Approved', 'Rejected', 'Cancelled'
    attendees_count INT             CHECK (attendees_count > 0),
    created_at      TIMESTAMP       DEFAULT NOW(),

    CONSTRAINT chk_valid_time CHECK (start_time < end_time)
);


-- ============================================================
-- 7. APPROVED BOOKINGS
-- ============================================================

CREATE TABLE approved_bookings (
    booking_id      SERIAL          PRIMARY KEY,
    request_id      INT             NOT NULL UNIQUE REFERENCES booking_requests(request_id) ON DELETE CASCADE,
    facility_id     INT             NOT NULL REFERENCES facilities(facility_id)             ON DELETE CASCADE,
    user_id         INT             NOT NULL REFERENCES users(user_id)                      ON DELETE CASCADE,
    start_time      TIMESTAMP       NOT NULL,
    end_time        TIMESTAMP       NOT NULL,
    approved_at     TIMESTAMP       DEFAULT NOW(),

    CONSTRAINT chk_approved_time CHECK (start_time < end_time)
);


-- ============================================================
-- 8. APPROVAL RECORDS
-- ============================================================

CREATE TABLE approval_records (
    approval_id     SERIAL          PRIMARY KEY,
    request_id      INT             NOT NULL REFERENCES booking_requests(request_id) ON DELETE CASCADE,
    admin_id        INT             NOT NULL REFERENCES users(user_id)               ON DELETE RESTRICT,
    action          VARCHAR(20)     NOT NULL,
    -- 'Approved', 'Rejected'
    remarks         TEXT,
    action_taken_at TIMESTAMP       DEFAULT NOW(),

    CONSTRAINT chk_action CHECK (action IN ('Approved', 'Rejected'))
);


-- ============================================================
-- 9. USAGE ANALYTICS
-- ============================================================

CREATE TABLE usage_analytics (
    analytics_id        SERIAL      PRIMARY KEY,
    facility_id         INT         NOT NULL REFERENCES facilities(facility_id)      ON DELETE CASCADE,
    booking_id          INT         NOT NULL REFERENCES approved_bookings(booking_id) ON DELETE CASCADE,
    date                DATE        NOT NULL,
    hour_of_day         INT         CHECK (hour_of_day BETWEEN 0 AND 23),
    duration_minutes    INT         CHECK (duration_minutes > 0),
    department_id       INT         REFERENCES departments(department_id)            ON DELETE SET NULL,
    recorded_at         TIMESTAMP   DEFAULT NOW()
);


-- ============================================================
-- INDEXES  (for performance on heavy queries)
-- ============================================================

-- Booking lookups by user and facility
CREATE INDEX idx_booking_requests_user_id     ON booking_requests(user_id);
CREATE INDEX idx_booking_requests_facility_id ON booking_requests(facility_id);
CREATE INDEX idx_booking_requests_status      ON booking_requests(status);
CREATE INDEX idx_booking_requests_time        ON booking_requests(start_time, end_time);

-- Approved bookings time range lookups (conflict detection)
CREATE INDEX idx_approved_bookings_facility   ON approved_bookings(facility_id);
CREATE INDEX idx_approved_bookings_time       ON approved_bookings(start_time, end_time);

-- Analytics queries
CREATE INDEX idx_usage_analytics_facility     ON usage_analytics(facility_id);
CREATE INDEX idx_usage_analytics_date         ON usage_analytics(date);
CREATE INDEX idx_usage_analytics_dept         ON usage_analytics(department_id);

-- User lookups
CREATE INDEX idx_users_role_id                ON users(role_id);
CREATE INDEX idx_users_department_id          ON users(department_id);

-- Equipment by facility
CREATE INDEX idx_equipment_facility_id        ON equipment(facility_id);


-- ============================================================
-- VIEWS
-- ============================================================

-- View 1: Active bookings with user and facility details
CREATE OR REPLACE VIEW view_active_bookings AS
SELECT
    ab.booking_id,
    u.full_name          AS booked_by,
    r.role_name          AS user_role,
    d.dept_name          AS department,
    f.facility_name,
    f.facility_type,
    f.location,
    ab.start_time,
    ab.end_time,
    ab.approved_at
FROM approved_bookings ab
JOIN users       u ON ab.user_id     = u.user_id
JOIN roles       r ON u.role_id      = r.role_id
JOIN facilities  f ON ab.facility_id = f.facility_id
LEFT JOIN departments d ON u.department_id = d.department_id
WHERE ab.end_time > NOW();


-- View 2: Facility utilization summary
CREATE OR REPLACE VIEW view_facility_utilization AS
SELECT
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    COUNT(ua.analytics_id)          AS total_bookings,
    COALESCE(SUM(ua.duration_minutes), 0) AS total_minutes_used,
    ROUND(
        COALESCE(SUM(ua.duration_minutes), 0) / NULLIF(
            EXTRACT(EPOCH FROM (NOW() - MIN(ua.recorded_at))) / 60, 0
        ) * 100, 2
    )                               AS utilization_pct
FROM facilities f
LEFT JOIN usage_analytics ua ON f.facility_id = ua.facility_id
GROUP BY f.facility_id, f.facility_name, f.facility_type, f.capacity;


-- View 3: Pending requests with requester info
CREATE OR REPLACE VIEW view_pending_requests AS
SELECT
    br.request_id,
    u.full_name      AS requested_by,
    r.role_name      AS user_role,
    d.dept_name      AS department,
    f.facility_name,
    f.location,
    br.start_time,
    br.end_time,
    br.purpose,
    br.attendees_count,
    br.created_at
FROM booking_requests br
JOIN users      u ON br.user_id     = u.user_id
JOIN roles      r ON u.role_id      = r.role_id
JOIN facilities f ON br.facility_id = f.facility_id
LEFT JOIN departments d ON u.department_id = d.department_id
WHERE br.status = 'Pending'
ORDER BY br.created_at ASC;


-- View 4: Peak hours per facility
CREATE OR REPLACE VIEW view_peak_hours AS
SELECT
    f.facility_name,
    TRIM(TO_CHAR(ua.date, 'Day')) AS day_of_week,
    ua.hour_of_day,
    COUNT(*)  AS booking_count
FROM usage_analytics ua
JOIN facilities f ON ua.facility_id = f.facility_id
GROUP BY f.facility_name, TRIM(TO_CHAR(ua.date, 'Day')), ua.hour_of_day
ORDER BY booking_count DESC;


-- ============================================================
-- CONFLICT DETECTION FUNCTION
-- Prevents double booking of the same facility
-- ============================================================

CREATE OR REPLACE FUNCTION check_booking_conflict(
    p_facility_id   INT,
    p_start_time    TIMESTAMP,
    p_end_time      TIMESTAMP
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INT;
BEGIN
    SELECT COUNT(*) INTO conflict_count
    FROM approved_bookings
    WHERE facility_id = p_facility_id
      AND status_check = TRUE
      AND (
          (p_start_time >= start_time AND p_start_time < end_time) OR
          (p_end_time > start_time AND p_end_time <= end_time)     OR
          (p_start_time <= start_time AND p_end_time >= end_time)
      );

    RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TRIGGER: Auto-populate usage_analytics after booking approval
-- ============================================================

CREATE OR REPLACE FUNCTION populate_usage_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO usage_analytics (
        facility_id,
        booking_id,
        date,
        hour_of_day,
        duration_minutes,
        department_id
    )
    SELECT
        NEW.facility_id,
        NEW.booking_id,
        DATE(NEW.start_time),
        EXTRACT(HOUR FROM NEW.start_time)::INT,
        EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))::INT / 60,
        u.department_id
    FROM users u
    WHERE u.user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_populate_analytics
AFTER INSERT ON approved_bookings
FOR EACH ROW
EXECUTE FUNCTION populate_usage_analytics();


-- ============================================================
-- END OF SCHEMA
-- ============================================================
