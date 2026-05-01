-- ============================================================
-- OptiSpace - Smart Campus Facility Booking System
-- Core Queries
-- CS232 - Database Management Systems
-- ============================================================


-- ============================================================
-- SECTION 1: BASIC RETRIEVAL QUERIES
-- ============================================================

-- Q1: Get all users with their role and department
SELECT
    u.user_id,
    u.full_name,
    u.email,
    u.reg_number,
    r.role_name,
    d.dept_name,
    u.is_active,
    u.created_at
FROM users u
JOIN roles       r ON u.role_id       = r.role_id
LEFT JOIN departments d ON u.department_id = d.department_id
ORDER BY r.role_name, u.full_name;


-- Q2: Get all facilities with their equipment count
SELECT
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    f.location,
    d.dept_name         AS owned_by_dept,
    f.is_available,
    COUNT(e.equipment_id) AS total_equipment
FROM facilities f
LEFT JOIN departments d  ON f.department_id = d.department_id
LEFT JOIN equipment   e  ON f.facility_id   = e.facility_id
GROUP BY
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    f.location,
    d.dept_name,
    f.is_available
ORDER BY f.facility_type, f.facility_name;


-- Q3: Get all equipment for a specific facility
SELECT
    e.equipment_id,
    e.equipment_name,
    e.equipment_type,
    e.quantity,
    e.condition,
    f.facility_name,
    f.location
FROM equipment e
JOIN facilities f ON e.facility_id = f.facility_id
WHERE f.facility_name = 'Cyber Lab'
ORDER BY e.equipment_type;


-- Q4: Get all pending booking requests with full details
SELECT * FROM view_pending_requests;


-- Q5: Get all active (upcoming) bookings
SELECT * FROM view_active_bookings;


-- Q6: Get full booking history of a specific user
SELECT
    br.request_id,
    f.facility_name,
    f.facility_type,
    f.location,
    br.start_time,
    br.end_time,
    br.purpose,
    br.status,
    br.attendees_count,
    br.created_at
FROM booking_requests br
JOIN facilities f ON br.facility_id = f.facility_id
WHERE br.user_id = (SELECT user_id FROM users WHERE email = 'reyan.kashif@giki.edu.pk')
ORDER BY br.created_at DESC;


-- Q7: Get all bookings for a specific facility
SELECT
    br.request_id,
    u.full_name      AS requested_by,
    r.role_name,
    br.start_time,
    br.end_time,
    br.purpose,
    br.status,
    br.attendees_count
FROM booking_requests br
JOIN users      u ON br.user_id     = u.user_id
JOIN roles      r ON u.role_id      = r.role_id
WHERE br.facility_id = (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab')
ORDER BY br.start_time;


-- ============================================================
-- SECTION 2: CONFLICT DETECTION
-- ============================================================

-- Q8: Check if a facility is already booked for a given time slot
-- Replace the timestamps with the requested slot to check
-- Returns rows if there IS a conflict (booking exists in that window)
SELECT
    ab.booking_id,
    f.facility_name,
    u.full_name      AS booked_by,
    ab.start_time,
    ab.end_time
FROM approved_bookings ab
JOIN facilities f ON ab.facility_id = f.facility_id
JOIN users      u ON ab.user_id     = u.user_id
WHERE ab.facility_id = (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab')
  AND (
        ('2026-04-14 09:30:00' >= ab.start_time AND '2026-04-14 09:30:00' < ab.end_time)
     OR ('2026-04-14 10:30:00' >  ab.start_time AND '2026-04-14 10:30:00' <= ab.end_time)
     OR ('2026-04-14 09:30:00' <= ab.start_time AND '2026-04-14 10:30:00' >= ab.end_time)
  );
-- If this returns 0 rows → no conflict, safe to approve
-- If this returns rows   → conflict exists, reject or suggest alternative


-- Q9: Find all available facilities for a specific time slot
-- Facilities NOT in approved_bookings during the requested window
SELECT
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    f.location
FROM facilities f
WHERE f.is_available = TRUE
  AND f.facility_id NOT IN (
      SELECT ab.facility_id
      FROM approved_bookings ab
      WHERE (
            ('2026-04-14 09:00:00' >= ab.start_time AND '2026-04-14 09:00:00' < ab.end_time)
         OR ('2026-04-14 11:00:00' >  ab.start_time AND '2026-04-14 11:00:00' <= ab.end_time)
         OR ('2026-04-14 09:00:00' <= ab.start_time AND '2026-04-14 11:00:00' >= ab.end_time)
      )
  )
ORDER BY f.facility_type, f.capacity;


-- ============================================================
-- SECTION 3: ADMIN QUERIES
-- ============================================================

-- Q10: Get all approval records with admin and request details
SELECT
    ar.approval_id,
    u_admin.full_name    AS approved_by,
    u_req.full_name      AS requested_by,
    f.facility_name,
    br.start_time,
    br.end_time,
    ar.action,
    ar.remarks,
    ar.action_taken_at
FROM approval_records ar
JOIN users            u_admin ON ar.admin_id    = u_admin.user_id
JOIN booking_requests br      ON ar.request_id  = br.request_id
JOIN users            u_req   ON br.user_id      = u_req.user_id
JOIN facilities       f       ON br.facility_id  = f.facility_id
ORDER BY ar.action_taken_at DESC;


-- Q11: Count of bookings by status
SELECT
    status,
    COUNT(*) AS total
FROM booking_requests
GROUP BY status
ORDER BY total DESC;


-- Q12: Get all users created by admin (admin audit)
SELECT
    u.user_id,
    u.full_name,
    u.email,
    r.role_name,
    d.dept_name,
    u.created_at,
    creator.full_name AS created_by
FROM users u
JOIN roles          r       ON u.role_id       = r.role_id
LEFT JOIN departments d     ON u.department_id = d.department_id
LEFT JOIN users     creator ON u.created_by    = creator.user_id
ORDER BY u.created_at;


-- ============================================================
-- SECTION 4: SMART RECOMMENDATION SYSTEM
-- ============================================================

-- Q13: Least utilized facilities
-- Facilities with fewest approved bookings → recommend these first
SELECT
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    f.location,
    COUNT(ab.booking_id)                    AS total_bookings,
    COALESCE(SUM(ua.duration_minutes), 0)   AS total_minutes_used
FROM facilities f
LEFT JOIN approved_bookings ab  ON f.facility_id = ab.facility_id
LEFT JOIN usage_analytics   ua  ON f.facility_id = ua.facility_id
WHERE f.is_available = TRUE
GROUP BY
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    f.location
ORDER BY total_bookings ASC, total_minutes_used ASC;


-- Q14: Recommend best available time slots for a facility
-- Shows hours of the day that have NEVER been booked for a given facility
-- (Cyber Lab example)
SELECT
    hours.hour_slot,
    CASE
        WHEN hours.hour_slot BETWEEN 8  AND 12 THEN 'Morning'
        WHEN hours.hour_slot BETWEEN 13 AND 17 THEN 'Afternoon'
        ELSE 'Evening'
    END AS time_of_day
FROM (
    SELECT generate_series(8, 20) AS hour_slot
) hours
WHERE hours.hour_slot NOT IN (
    SELECT DISTINCT ua.hour_of_day
    FROM usage_analytics ua
    WHERE ua.facility_id = (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab')
)
ORDER BY hours.hour_slot;


-- Q15: Peak hours per facility
-- Which hours are most booked across all facilities
SELECT * FROM view_peak_hours
LIMIT 20;


-- Q16: Peak hours for a specific facility
SELECT
    ua.hour_of_day,
    TRIM(TO_CHAR(ua.date, 'Day')) AS day_of_week,
    COUNT(*) AS booking_count,
    SUM(ua.duration_minutes) AS total_minutes
FROM usage_analytics ua
WHERE ua.facility_id = (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab')
GROUP BY ua.hour_of_day, TRIM(TO_CHAR(ua.date, 'Day'))
ORDER BY booking_count DESC;


-- Q17: Recommend similar facilities based on type
-- If a user wants a Lab but their preferred one is busy, suggest alternatives
SELECT
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    f.location,
    COUNT(ab.booking_id) AS times_booked
FROM facilities f
LEFT JOIN approved_bookings ab ON f.facility_id = ab.facility_id
WHERE f.facility_type = 'Lab'
  AND f.is_available  = TRUE
  AND f.facility_id  != (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab')
GROUP BY
    f.facility_id,
    f.facility_name,
    f.facility_type,
    f.capacity,
    f.location
ORDER BY times_booked ASC;


-- Q18: Department-based recommendations
-- What facilities does a specific department use most
-- Useful to recommend familiar facilities to users of that dept
SELECT
    f.facility_name,
    f.facility_type,
    f.location,
    COUNT(ua.analytics_id)          AS total_bookings,
    SUM(ua.duration_minutes)        AS total_minutes,
    d.dept_name
FROM usage_analytics ua
JOIN facilities   f ON ua.facility_id   = f.facility_id
JOIN departments  d ON ua.department_id = d.department_id
WHERE d.dept_code = 'CS'
GROUP BY
    f.facility_name,
    f.facility_type,
    f.location,
    d.dept_name
ORDER BY total_bookings DESC;


-- Q19: Smart slot suggestion
-- For a given facility, find the next available 2-hour window
-- starting from NOW during working hours (8am - 8pm)
SELECT
    slots.slot_start,
    slots.slot_start + INTERVAL '2 hours' AS slot_end
FROM (
    SELECT
        generate_series(
            date_trunc('hour', NOW()),
            date_trunc('day', NOW()) + INTERVAL '20 hours',
            INTERVAL '1 hour'
        ) AS slot_start
) slots
WHERE
    EXTRACT(HOUR FROM slots.slot_start) BETWEEN 8 AND 18
    AND NOT EXISTS (
        SELECT 1
        FROM approved_bookings ab
        WHERE ab.facility_id = (SELECT facility_id FROM facilities WHERE facility_name = 'Cyber Lab')
          AND (
                (slots.slot_start >= ab.start_time AND slots.slot_start < ab.end_time)
             OR (slots.slot_start + INTERVAL '2 hours' > ab.start_time
                 AND slots.slot_start + INTERVAL '2 hours' <= ab.end_time)
             OR (slots.slot_start <= ab.start_time
                 AND slots.slot_start + INTERVAL '2 hours' >= ab.end_time)
          )
    )
ORDER BY slots.slot_start
LIMIT 5;


-- ============================================================
-- SECTION 5: ANALYTICS & REPORTS
-- ============================================================

-- Q20: Full facility utilization report
SELECT * FROM view_facility_utilization
ORDER BY total_bookings DESC;


-- Q21: Booking trends by day of week (busiest days)
SELECT
    TRIM(TO_CHAR(ua.date, 'Day')) AS day_of_week,
    COUNT(*)                    AS total_bookings,
    SUM(ua.duration_minutes)    AS total_minutes,
    ROUND(AVG(ua.duration_minutes), 2) AS avg_duration_minutes
FROM usage_analytics ua
GROUP BY TRIM(TO_CHAR(ua.date, 'Day'))
ORDER BY total_bookings DESC;


-- Q22: Booking trends by facility type
SELECT
    f.facility_type,
    COUNT(br.request_id)    AS total_requests,
    SUM(CASE WHEN br.status = 'Approved'  THEN 1 ELSE 0 END) AS approved,
    SUM(CASE WHEN br.status = 'Rejected'  THEN 1 ELSE 0 END) AS rejected,
    SUM(CASE WHEN br.status = 'Pending'   THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN br.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM booking_requests br
JOIN facilities f ON br.facility_id = f.facility_id
GROUP BY f.facility_type
ORDER BY total_requests DESC;


-- Q23: Most active users (who books the most)
SELECT
    u.full_name,
    r.role_name,
    d.dept_name,
    COUNT(br.request_id)    AS total_requests,
    SUM(CASE WHEN br.status = 'Approved' THEN 1 ELSE 0 END) AS approved_bookings
FROM booking_requests br
JOIN users        u ON br.user_id       = u.user_id
JOIN roles        r ON u.role_id        = r.role_id
LEFT JOIN departments d ON u.department_id = d.department_id
GROUP BY
    u.full_name,
    r.role_name,
    d.dept_name
ORDER BY total_requests DESC;


-- Q24: Monthly booking report
SELECT
    TO_CHAR(br.created_at, 'YYYY-MM')   AS month,
    COUNT(*)                             AS total_requests,
    SUM(CASE WHEN br.status = 'Approved'  THEN 1 ELSE 0 END) AS approved,
    SUM(CASE WHEN br.status = 'Rejected'  THEN 1 ELSE 0 END) AS rejected,
    SUM(CASE WHEN br.status = 'Pending'   THEN 1 ELSE 0 END) AS pending
FROM booking_requests br
GROUP BY TO_CHAR(br.created_at, 'YYYY-MM')
ORDER BY month DESC;


-- Q25: Facilities with equipment in poor condition
SELECT
    f.facility_name,
    f.location,
    e.equipment_name,
    e.equipment_type,
    e.quantity,
    e.condition
FROM equipment e
JOIN facilities f ON e.facility_id = f.facility_id
WHERE e.condition IN ('Needs Repair', 'Out of Service')
ORDER BY f.facility_name;


-- Q26: Department-wise booking summary
SELECT
    d.dept_name,
    COUNT(br.request_id)    AS total_requests,
    SUM(CASE WHEN br.status = 'Approved'  THEN 1 ELSE 0 END) AS approved,
    SUM(CASE WHEN br.status = 'Rejected'  THEN 1 ELSE 0 END) AS rejected,
    SUM(CASE WHEN br.status = 'Pending'   THEN 1 ELSE 0 END) AS pending
FROM booking_requests br
JOIN users        u ON br.user_id       = u.user_id
JOIN departments  d ON u.department_id  = d.department_id
GROUP BY d.dept_name
ORDER BY total_requests DESC;


-- Q27: Average booking duration per facility type
SELECT
    f.facility_type,
    ROUND(AVG(ua.duration_minutes), 2)  AS avg_duration_minutes,
    MIN(ua.duration_minutes)            AS min_duration,
    MAX(ua.duration_minutes)            AS max_duration,
    COUNT(*)                            AS total_bookings
FROM usage_analytics ua
JOIN facilities f ON ua.facility_id = f.facility_id
GROUP BY f.facility_type
ORDER BY avg_duration_minutes DESC;

--Q28: View Past Booking Records
SELECT br.request_id, u.full_name AS requester, f.facility_name,
       br.start_time, br.end_time, br.purpose, br.status,
       ar.action, ar.remarks, ar.action_taken_at,
       admin.full_name AS decided_by
FROM booking_requests br
JOIN users u ON br.user_id = u.user_id
JOIN facilities f ON br.facility_id = f.facility_id
LEFT JOIN approval_records ar ON br.request_id = ar.request_id
LEFT JOIN users admin ON ar.admin_id = admin.user_id
WHERE br.status IN ('Approved', 'Rejected')
ORDER BY ar.action_taken_at DESC


-- ============================================================
-- SECTION 6: TRANSACTION EXAMPLES
-- (Demonstrates ACID properties for viva)
-- ============================================================

-- T1: Approve a booking request (atomic operation)
-- Either all steps succeed or none do
BEGIN;

    -- Step 1: Update booking request status
    UPDATE booking_requests
    SET status = 'Approved'
    WHERE request_id = 6;

    -- Step 2: Insert into approved bookings
    INSERT INTO approved_bookings (request_id, facility_id, user_id, start_time, end_time)
    SELECT
        request_id,
        facility_id,
        user_id,
        start_time,
        end_time
    FROM booking_requests
    WHERE request_id = 6;

    -- Step 3: Log the approval record
    INSERT INTO approval_records (request_id, admin_id, action, remarks)
    VALUES (
        6,
        (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
        'Approved',
        'Approved after conflict check passed.'
    );

COMMIT;


-- T2: Reject a booking request (atomic operation)
BEGIN;

    UPDATE booking_requests
    SET status = 'Rejected'
    WHERE request_id = 7;

    INSERT INTO approval_records (request_id, admin_id, action, remarks)
    VALUES (
        7,
        (SELECT user_id FROM users WHERE email = 'admin@giki.edu.pk'),
        'Rejected',
        'Facility not available for requested time.'
    );

COMMIT;


-- T3: Cancel a booking (user cancels their own request)
BEGIN;

    UPDATE booking_requests
    SET status = 'Cancelled'
    WHERE request_id = 8
      AND status = 'Pending';

COMMIT;


-- ============================================================
-- SECTION 7: NORMALIZATION VERIFICATION QUERIES
-- (Useful for viva - proves 3NF compliance)
-- ============================================================

-- Verify no transitive dependencies: users → department info
-- Department data lives in departments table, not duplicated in users
SELECT
    u.full_name,
    u.email,
    d.dept_name,    -- comes from departments, not stored in users
    d.dept_code
FROM users u
LEFT JOIN departments d ON u.department_id = d.department_id;

-- Verify no redundancy: facility type info not repeated per booking
SELECT
    br.request_id,
    f.facility_name,
    f.facility_type,  -- single source of truth in facilities table
    f.capacity
FROM booking_requests br
JOIN facilities f ON br.facility_id = f.facility_id;


-- ============================================================
-- END OF QUERIES
-- ============================================================
