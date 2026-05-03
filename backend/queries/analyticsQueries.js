const facilityUtilization = `
  SELECT * FROM view_facility_utilization
`;

const bookingsByDay = `
  SELECT TRIM(TO_CHAR(ua.date, 'Day')) AS day_of_week,
         COUNT(*) AS total_bookings,
         SUM(ua.duration_minutes) AS total_duration
  FROM usage_analytics ua
  GROUP BY TRIM(TO_CHAR(ua.date, 'Day')),
           EXTRACT(DOW FROM ua.date)
  ORDER BY EXTRACT(DOW FROM ua.date)
`;

const bookingsByType = `
  SELECT f.facility_type,
         COUNT(ua.analytics_id) AS total_bookings,
         SUM(ua.duration_minutes) AS total_duration,
         ROUND(AVG(ua.duration_minutes), 2) AS avg_duration
  FROM usage_analytics ua
  JOIN facilities f ON ua.facility_id = f.facility_id
  GROUP BY f.facility_type
  ORDER BY total_bookings DESC
`;

const activeUsers = `
  SELECT u.user_id, u.full_name, u.email, u.reg_number,
         r.role_name,
         d.dept_name,
         COUNT(br.request_id) AS total_bookings
  FROM users u
  JOIN booking_requests br ON u.user_id = br.user_id
  JOIN roles r ON u.role_id = r.role_id
  LEFT JOIN departments d ON u.department_id = d.department_id
  GROUP BY u.user_id, u.full_name, u.email, u.reg_number,
           r.role_name, d.dept_name
  ORDER BY total_bookings DESC
  LIMIT 20
`;

const monthlyReport = `
  SELECT TO_CHAR(ua.date, 'YYYY-MM') AS month,
         COUNT(ua.analytics_id) AS total_bookings,
         SUM(ua.duration_minutes) AS total_duration,
         COUNT(DISTINCT ua.facility_id) AS facilities_used,
         COUNT(DISTINCT ua.department_id) AS departments_involved
  FROM usage_analytics ua
  GROUP BY TO_CHAR(ua.date, 'YYYY-MM')
  ORDER BY month DESC
`;

const byDepartment = `
  SELECT d.department_id, d.dept_name, d.dept_code,
         COUNT(ua.analytics_id) AS total_bookings,
         SUM(ua.duration_minutes) AS total_duration,
         COUNT(DISTINCT ua.facility_id) AS facilities_used
  FROM usage_analytics ua
  JOIN departments d ON ua.department_id = d.department_id
  GROUP BY d.department_id, d.dept_name, d.dept_code
  ORDER BY total_bookings DESC
`;

module.exports = {
  facilityUtilization,
  bookingsByDay,
  bookingsByType,
  activeUsers,
  monthlyReport,
  byDepartment,
};
