const signup = `INSERT INTO users (name,email,password) VALUES ($1,$2,$3)`;
const login = `SELECT * FROM users WHERE email=$1`;
const task_details = "SELECT * FROM task_details WHERE user_id=$1";
const addtask = "INSERT INTO task_details (user_id,task) VALUES ($1,$2)";
const userbyid = "SELECT * FROM users WHERE id=$1";
const taskcount = "SELECT COUNT(task) FROM task_details WHERE user_id=$1";
const deletetask = "DELETE FROM task_details WHERE task=$1";
const taskid = "UPDATE task_details SET task=$1 WHERE task=$2";
const deleteuser = "DELETE FROM users WHERE id=$1";
const deletealltasks = "DELETE FROM task_details WHERE user_id=$1";
const profile = "UPDATE users SET name=$1, email=$2 WHERE id=$3";
const resetpass = "UPDATE users SET password=$1 WHERE id=$2";
const last_login = "UPDATE users SET last_login=NOW() WHERE id=$1";
const updated_at = "UPDATE users SET updated_at=NOW() WHERE id=$1";
const updated_task_time =
  "UPDATE task_details SET updated_at=NOW() WHERE user_id=$1";
const task_count_admin = "SELECT COUNT(*)  FROM task_details";
const task_admin = "SELECT (task) FROM task_details";
const user_admin = "SELECT (user_id) FROM task_details";
const users_name_admin = "SELECT (name) FROM users";
const user_count_admin = "SELECT COUNT(*)  FROM users";

module.exports = {
  signup,
  login,
  task_details,
  addtask,
  userbyid,
  taskcount,
  deletetask,
  taskid,
  deleteuser,
  deletealltasks,
  profile,
  resetpass,
  last_login,
  updated_at,
  updated_task_time,
  task_count_admin,
  task_admin,
  user_admin,
  users_name_admin,
  user_count_admin,
};
