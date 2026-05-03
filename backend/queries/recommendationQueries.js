const leastUsedFacilities = `
  SELECT f.facility_id, f.facility_name, f.facility_type, f.capacity, f.location,
         COALESCE(ab_counts.total_bookings, 0) AS total_bookings,
         COALESCE(ua_totals.total_minutes_used, 0) AS total_minutes_used
  FROM facilities f
  LEFT JOIN (
    SELECT facility_id, COUNT(booking_id) AS total_bookings
    FROM approved_bookings
    GROUP BY facility_id
  ) ab_counts ON f.facility_id = ab_counts.facility_id
  LEFT JOIN (
    SELECT facility_id, SUM(duration_minutes) AS total_minutes_used
    FROM usage_analytics
    GROUP BY facility_id
  ) ua_totals ON f.facility_id = ua_totals.facility_id
  WHERE f.is_available = true
  ORDER BY total_bookings ASC, total_minutes_used ASC
`;

const bestSlots = `
  SELECT hours.hour_slot,
    CASE
      WHEN hours.hour_slot BETWEEN 8 AND 12 THEN 'Morning'
      WHEN hours.hour_slot BETWEEN 13 AND 17 THEN 'Afternoon'
      ELSE 'Evening'
    END AS time_of_day
  FROM (SELECT generate_series(8, 20) AS hour_slot) hours
  WHERE hours.hour_slot NOT IN (
    SELECT DISTINCT ua.hour_of_day
    FROM usage_analytics ua
    WHERE ua.facility_id = $1
  )
  ORDER BY hours.hour_slot
`;

const similarFacilities = `
  SELECT f.facility_id, f.facility_name, f.facility_type, f.capacity,
         f.location, COUNT(ab.booking_id) AS times_booked
  FROM facilities f
  LEFT JOIN approved_bookings ab ON f.facility_id = ab.facility_id
  WHERE f.facility_type = (
    SELECT facility_type FROM facilities WHERE facility_id = $1
  )
  AND f.facility_id != $1
  AND f.is_available = true
  GROUP BY f.facility_id, f.facility_name, f.facility_type, f.capacity, f.location
  ORDER BY times_booked ASC
`;

const byDepartment = `
  SELECT f.facility_name, f.facility_type, f.location,
         COUNT(ua.analytics_id) AS total_bookings,
         SUM(ua.duration_minutes) AS total_minutes,
         d.dept_name
  FROM usage_analytics ua
  JOIN facilities f ON ua.facility_id = f.facility_id
  JOIN departments d ON ua.department_id = d.department_id
  WHERE ua.department_id = $1
  GROUP BY f.facility_name, f.facility_type, f.location, d.dept_name
  ORDER BY total_bookings DESC
`;

const nextAvailableSlot = `
  SELECT
    slots.slot_start,
    slots.slot_start + INTERVAL '2 hours' AS slot_end
  FROM (
    SELECT generate_series(
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
      WHERE ab.facility_id = $1
        AND (
          (slots.slot_start >= ab.start_time AND slots.slot_start < ab.end_time)
          OR (slots.slot_start + INTERVAL '2 hours' > ab.start_time
              AND slots.slot_start + INTERVAL '2 hours' <= ab.end_time)
          OR (slots.slot_start <= ab.start_time
              AND slots.slot_start + INTERVAL '2 hours' >= ab.end_time)
        )
    )
  ORDER BY slots.slot_start
  LIMIT 5
`;

module.exports = {
  leastUsedFacilities,
  bestSlots,
  similarFacilities,
  byDepartment,
  nextAvailableSlot,
};
