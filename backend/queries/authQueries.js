const getUserByEmail = `
  SELECT u.user_id, u.full_name, u.email, u.password_hash, u.is_active,
         u.department_id, u.reg_number,
         r.role_name, r.role_id
  FROM users u
  JOIN roles r ON u.role_id = r.role_id
  WHERE u.email = $1
`;

const getUserById = `
  SELECT u.user_id, u.full_name, u.email, u.reg_number, u.is_active,
         u.department_id, u.created_at,
         r.role_name, r.role_id,
         d.dept_name, d.dept_code
  FROM users u
  JOIN roles r ON u.role_id = r.role_id
  LEFT JOIN departments d ON u.department_id = d.department_id
  WHERE u.user_id = $1
`;

module.exports = {
  getUserByEmail,
  getUserById,
};
