const getAllUsers = `
  SELECT u.user_id, u.full_name, u.email, u.reg_number, u.is_active,
         u.department_id, u.created_at, u.created_by,
         r.role_name, r.role_id,
         d.dept_name, d.dept_code
  FROM users u
  JOIN roles r ON u.role_id = r.role_id
  LEFT JOIN departments d ON u.department_id = d.department_id
  ORDER BY u.created_at DESC
`;

const createUser = `
  INSERT INTO users (full_name, email, password_hash, role_id, department_id, reg_number, is_active, created_by)
  VALUES ($1, $2, $3, $4, $5, $6, true, $7)
  RETURNING user_id, full_name, email, reg_number, role_id, department_id, is_active, created_at
`;

const updateUser = `
  UPDATE users
  SET full_name = $1, email = $2, role_id = $3, department_id = $4, reg_number = $5
  WHERE user_id = $6
  RETURNING user_id, full_name, email, reg_number, role_id, department_id, is_active
`;

const deactivateUser = `
  UPDATE users
  SET is_active = false
  WHERE user_id = $1
  RETURNING user_id, full_name, email, is_active
`;

const activateUser = `
  UPDATE users
  SET is_active = true
  WHERE user_id = $1
  RETURNING user_id, full_name, email, is_active
`;

const checkEmailExists = `
  SELECT user_id FROM users WHERE email = $1
`;

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
  checkEmailExists,
};
