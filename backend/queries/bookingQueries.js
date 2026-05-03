const getMyBookings = `
  SELECT br.request_id, br.facility_id, br.start_time, br.end_time,
         br.purpose, br.status, br.attendees_count, br.created_at,
         f.facility_name, f.facility_type, f.location
  FROM booking_requests br
  JOIN facilities f ON br.facility_id = f.facility_id
  WHERE br.user_id = $1
  ORDER BY br.created_at DESC
`;

const getPendingRequests = `
  SELECT br.request_id, br.user_id, br.facility_id, br.start_time, br.end_time,
         br.purpose, br.status, br.attendees_count, br.created_at,
         u.full_name, u.email, u.reg_number,
         f.facility_name, f.facility_type, f.location,
         d.dept_name
  FROM booking_requests br
  JOIN users u ON br.user_id = u.user_id
  JOIN facilities f ON br.facility_id = f.facility_id
  LEFT JOIN departments d ON u.department_id = d.department_id
  WHERE br.status = 'Pending'
  ORDER BY br.created_at ASC
`;

const getActiveBookings = `
  SELECT ab.booking_id, ab.request_id, ab.facility_id, ab.user_id,
         ab.start_time, ab.end_time, ab.approved_at,
         u.full_name, u.email,
         f.facility_name, f.facility_type, f.location
  FROM approved_bookings ab
  JOIN users u ON ab.user_id = u.user_id
  JOIN facilities f ON ab.facility_id = f.facility_id
  WHERE ab.end_time > NOW()
  ORDER BY ab.start_time ASC
`;

const createBookingRequest = `
  INSERT INTO booking_requests (user_id, facility_id, start_time, end_time, purpose, status, attendees_count)
  VALUES ($1, $2, $3, $4, $5, 'Pending', $6)
  RETURNING request_id, user_id, facility_id, start_time, end_time, purpose, status, attendees_count, created_at
`;

const checkConflict = `
  SELECT ab.booking_id, ab.start_time, ab.end_time
  FROM approved_bookings ab
  WHERE ab.facility_id = $1
    AND ab.start_time < $3
    AND ab.end_time > $2
`;

const getBookingRequestById = `
  SELECT br.request_id, br.user_id, br.facility_id, br.start_time, br.end_time,
         br.purpose, br.status, br.attendees_count, br.created_at
  FROM booking_requests br
  WHERE br.request_id = $1
`;

const updateBookingStatus = `
  UPDATE booking_requests
  SET status = $1
  WHERE request_id = $2
  RETURNING request_id, user_id, facility_id, start_time, end_time, purpose, status
`;

const insertApprovedBooking = `
  INSERT INTO approved_bookings (request_id, facility_id, user_id, start_time, end_time)
  SELECT request_id, facility_id, user_id, start_time, end_time
  FROM booking_requests
  WHERE request_id = $1
  RETURNING booking_id, request_id, facility_id, user_id, start_time, end_time, approved_at
`;

const insertApprovalRecord = `
  INSERT INTO approval_records (request_id, admin_id, action, remarks)
  VALUES ($1, $2, $3, $4)
  RETURNING approval_id, request_id, admin_id, action, remarks, action_taken_at
`;

const cancelBookingRequest = `
  UPDATE booking_requests
  SET status = 'Cancelled'
  WHERE request_id = $1 AND user_id = $2 AND status = 'Pending'
  RETURNING request_id, status
`;

const getBookingHistory = `
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
`;

module.exports = {
  getMyBookings,
  getPendingRequests,
  getActiveBookings,
  createBookingRequest,
  checkConflict,
  getBookingRequestById,
  updateBookingStatus,
  insertApprovedBooking,
  insertApprovalRecord,
  cancelBookingRequest,
  getBookingHistory,
};
