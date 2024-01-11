const pool = require("../model/db");
const queries = require("../model/quaries");
const bcrypt = require("bcrypt");
require("dotenv").config();
const gettodos = (req, res) => {};
const login = (req, res) => {
  res.render("login");
};
const signup = (req, res) => {
  res.render("signup");
};
const postsignup = async (req, res) => {
  let { name, email, password, password1 } = req.body;
  if (password != password1) {
    res.send("Password and Conform Password Must Be Same ");
  } else {
    let hash = await bcrypt.hash(password, 10);
    pool.query(queries.signup, [name, email, hash], (err, result) => {
      if (err) {
        throw err;
      }
      pool.query(queries.login, [email], (err, result1) => {
        if (err) {
          throw err;
        }
        let userData = {
          user_id: result.rows[0].id,
          name: result.rows[0].name,
        };
        res.cookie("userData", userData);
        res.render("task", {
          name: name,
          email: email,
          tasks: "",
          task_count: 0,
          user_id: result1.rows[0].id,
        });
      });
    });
  }
};
const postlogin = (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASS
  ) {
    pool.query(queries.task_count_admin, (err, result) => {
      pool.query(queries.task_admin, (err, result1) => {
        pool.query(queries.user_admin, (err, result2) => {
          let task_all = [];
          let all_users = [];
          for (let i = 0; i < result.rows[0].count; i++) {
            task_all.push(result1.rows[i].task);
            all_users.push(result2.rows[i].user_id);
          }
          pool.query(queries.user_count_admin, (err, result3) => {
            pool.query(queries.users_name_admin, (err, result4) => {
              let users_name = [];
              for (let i = 0; i < result3.rows[0].count; i++) {
                users_name.push(result4.rows[i].name);
              }
              res.render("admin", {
                name: "Admin",
                task_count: result.rows[0].count,
                tasks: task_all,
                user: all_users,
                user_count: result3.rows[0].count,
                user_name: users_name,
              });
            });
          });
        });
      });
    });
  } else {
    pool.query(queries.login, [email], (err, result) => {
      if (err) {
        res.send("Wrong Email or Password");
      }
      bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
        if (err) {
          res.send("Wrong Email or Password");
        } else {
          if (isMatch) {
            pool.query(
              queries.task_details,
              [result.rows[0].id],
              (err, result1) => {
                pool.query(
                  queries.taskcount,
                  [result.rows[0].id],
                  (err, result2) => {
                    let arr = [];
                    for (let i = 0; i < result2.rows[0].count; i++) {
                      arr.push(result1.rows[i].task);
                    }
                    pool.query(
                      queries.last_login,
                      [result.rows[0].id],
                      (err, result3) => {
                        if (err) {
                          throw err;
                        }
                        let userData = {
                          user_id: result.rows[0].id,
                          name: result.rows[0].name,
                        };
                        res.cookie("userData", userData);
                        res.render("task", {
                          name: result.rows[0].name,
                          email: email,
                          positions: result.rows[0].positions,
                          user_id: result.rows[0].id,
                          tasks: arr,
                          task_count: result2.rows[0].count,
                        });
                      }
                    );
                  }
                );
              }
            );
          } else {
            res.send("Wrong Email Address or Password");
          }
        }
      });
    });
  }
};
const addtask = (req, res) => {
  const id = parseInt(req.params.id);
  res.render("addtask", { user_id: id });
};
const postaddtask = (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  pool.query(queries.addtask, [id, task], (err, result) => {
    if (err) {
      throw err;
    }
    pool.query(queries.userbyid, [id], (err, result1) => {
      if (err) {
        throw err;
      }
      pool.query(queries.taskcount, [id], (err, result2) => {
        if (err) {
          throw err;
        }
        pool.query(
          queries.task_details,
          [result1.rows[0].id],
          (err, result3) => {
            let arr = [];
            for (let i = 0; i < result2.rows[0].count; i++) {
              arr.push(result3.rows[i].task);
            }
            res.render("task", {
              name: result1.rows[0].name,
              email: result1.rows[0].email,
              positions: result1.rows[0].positions,
              user_id: result1.rows[0].id,
              task_count: result2.rows[0].count,
              tasks: arr,
            });
          }
        );
      });
    });
  });
};
const deletetask = (req, res) => {
  const user_id = parseInt(req.params.id);
  pool.query(queries.taskcount, [user_id], (err, result) => {
    if (err) {
      throw err;
    }
    pool.query(queries.task_details, [user_id], (err, result1) => {
      let arr = [];
      for (let i = 0; i < result.rows[0].count; i++) {
        arr.push(result1.rows[i].task);
      }
      res.render("deletetask", {
        task_count: result.rows[0].count,
        tasks: arr,
        user_id: user_id,
      });
    });
  });
};
const postdeletetask = (req, res) => {
  const { checkbox } = req.body;
  for (let i = 0; i < checkbox.length; i++) {
    pool.query(queries.deletetask, [checkbox[i]], (err, result) => {
      if (err) {
        throw err;
      }
    });
  }
  let name = req.cookies.userData.name;
  let user_id = req.cookies.userData.user_id;
  pool.query(queries.taskcount, [user_id], (err, result1) => {
    if (err) {
      throw err;
    }
    pool.query(queries.task_details, [user_id], (err, result2) => {
      if (err) {
        throw err;
      }
      let arr = [];
      for (let i = 0; i < result1.rows[0].count; i++) {
        arr.push(result2.rows[i].task);
      }
      res.render("task", {
        name: name,
        user_id: user_id,
        task_count: result1.rows[0].count,
        tasks: arr,
      });
    });
  });
};
const updatetask = (req, res) => {
  const user_id = parseInt(req.params.id);
  pool.query(queries.taskcount, [user_id], (err, result) => {
    if (err) {
      throw err;
    }
    pool.query(queries.task_details, [user_id], (err, result1) => {
      let arr = [];
      for (let i = 0; i < result.rows[0].count; i++) {
        arr.push(result1.rows[i].task);
      }
      res.render("updatetask", {
        task_count: result.rows[0].count,
        tasks: arr,
        user_id: user_id,
      });
    });
  });
};
const postupdatetask = (req, res) => {
  const { radio, task } = req.body;
  const user_id = parseInt(req.params.id);
  pool.query(queries.taskid, [task, radio], (err, result) => {
    if (err) {
      throw err;
    }
    pool.query(queries.updated_task_time, [user_id], (err, result1) => {
      if (err) {
        throw err;
      }
      let name = req.cookies.userData.name;
      let user_id = req.cookies.userData.user_id;
      pool.query(queries.taskcount, [user_id], (err, result1) => {
        if (err) {
          throw err;
        }
        pool.query(queries.task_details, [user_id], (err, result2) => {
          if (err) {
            throw err;
          }
          let arr = [];
          for (let i = 0; i < result1.rows[0].count; i++) {
            arr.push(result2.rows[i].task);
          }
          res.render("task", {
            name: name,
            user_id: user_id,
            task_count: result1.rows[0].count,
            tasks: arr,
          });
        });
      });
    });
  });
};
const deleteuser = (req, res) => {
  const user_id = parseInt(req.params.id);
  pool.query(queries.deleteuser, [user_id], (err, result) => {
    if (err) {
      throw err;
    }
    res.clearCookie("userData");
    res.render("login");
  });
};
const deletealltasks = (req, res) => {
  const user_id = parseInt(req.params.id);
  pool.query(queries.deletealltasks, [user_id], (err, result) => {
    if (err) {
      throw err;
    }
    res.send("All Tasks are deleted ");
  });
};
const profile = (req, res) => {
  const user_id = parseInt(req.params.id);
  pool.query(queries.userbyid, [user_id], (err, result) => {
    if (err) {
      throw err;
    }
    res.render("profile", {
      user_id: user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      position: result.rows[0].positions,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
      last_login: result.rows[0].last_login,
    });
  });
};
const postprofile = (req, res) => {
  const { name, email } = req.body;
  const user_id = parseInt(req.params.id);
  pool.query(queries.profile, [name, email, user_id], (err, result) => {
    if (err) {
      throw err;
    } else {
      pool.query(queries.updated_at, [user_id], (err, result) => {
        if (err) {
          throw err;
        }
        res.render("login");
      });
    }
  });
};
const changepass = (req, res) => {
  const user_id = parseInt(req.params.id);
  pool.query(queries.userbyid, [user_id], (err, result) => {
    if (err) {
      throw err;
    }
    res.render("changepass", { user_id: user_id, name: result.rows[0].name });
  });
};
const postchangepass = (req, res) => {
  const user_id = parseInt(req.params.id);
  const { password } = req.body;
  pool.query(queries.userbyid, [user_id], (err, result) => {
    if (err) {
      throw err;
    }
    bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
      if (err) {
        res.send("Wrong Password");
      }
      if (isMatch) {
        res.render("resetpass", {
          name: result.rows[0].name,
          user_id: user_id,
        });
      } else {
        res.send("Wrong Password");
      }
    });
  });
};
const resetpass = async (req, res) => {
  const user_id = parseInt(req.params.id);
  const { password } = req.body;
  let hash = await bcrypt.hash(password, 10);
  pool.query(queries.resetpass, [hash, user_id], (err, result) => {
    if (err) {
      throw err;
    }
    res.send("Password Changed Successfully :) ");
  });
};
const logout = (req, res) => {
  res.clearCookie("userData");
  res.render("login");
};
module.exports = {
  gettodos,
  login,
  signup,
  postsignup,
  postlogin,
  addtask,
  postaddtask,
  deletetask,
  postdeletetask,
  updatetask,
  postupdatetask,
  deleteuser,
  deletealltasks,
  profile,
  postprofile,
  changepass,
  postchangepass,
  resetpass,
  logout,
};
