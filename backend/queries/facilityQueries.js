const getAllFacilities = `
  SELECT f.facility_id, f.facility_name, f.facility_type, f.capacity,
         f.location, f.department_id, f.is_available, f.created_at,
         d.dept_name, d.dept_code,
         COALESCE(eq.equipment_count, 0) AS equipment_count
  FROM facilities f
  LEFT JOIN departments d ON f.department_id = d.department_id
  LEFT JOIN (
    SELECT facility_id, COUNT(*) AS equipment_count
    FROM equipment
    GROUP BY facility_id
  ) eq ON f.facility_id = eq.facility_id
  ORDER BY f.facility_name
`;

const getFacilityById = `
  SELECT f.facility_id, f.facility_name, f.facility_type, f.capacity,
         f.location, f.department_id, f.is_available, f.created_at,
         d.dept_name, d.dept_code
  FROM facilities f
  LEFT JOIN departments d ON f.department_id = d.department_id
  WHERE f.facility_id = $1
`;

const getEquipmentByFacility = `
  SELECT equipment_id, equipment_name, equipment_type, quantity, condition
  FROM equipment
  WHERE facility_id = $1
  ORDER BY equipment_name
`;

const getAvailableFacilities = `
  SELECT f.facility_id, f.facility_name, f.facility_type, f.capacity,
         f.location, f.department_id, f.is_available,
         d.dept_name
  FROM facilities f
  LEFT JOIN departments d ON f.department_id = d.department_id
  WHERE f.is_available = true
    AND f.facility_id NOT IN (
      SELECT ab.facility_id
      FROM approved_bookings ab
      WHERE ab.start_time < $2 AND ab.end_time > $1
    )
  ORDER BY f.facility_name
`;

const createFacility = `
  INSERT INTO facilities (facility_name, facility_type, capacity, location, department_id, is_available)
  VALUES ($1, $2, $3, $4, $5, true)
  RETURNING facility_id, facility_name, facility_type, capacity, location, department_id, is_available, created_at
`;

const updateFacility = `
  UPDATE facilities
  SET facility_name = $1, facility_type = $2, capacity = $3, location = $4,
      department_id = $5, is_available = $6
  WHERE facility_id = $7
  RETURNING facility_id, facility_name, facility_type, capacity, location, department_id, is_available
`;

const checkFacilityHasBookings = `
  SELECT COUNT(*) AS count
  FROM approved_bookings
  WHERE facility_id = $1 AND end_time > NOW()
`;

const deleteFacility = `
  DELETE FROM facilities
  WHERE facility_id = $1
  RETURNING facility_id, facility_name
`;

module.exports = {
  getAllFacilities,
  getFacilityById,
  getEquipmentByFacility,
  getAvailableFacilities,
  createFacility,
  updateFacility,
  checkFacilityHasBookings,
  deleteFacility,
};
