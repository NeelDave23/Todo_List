const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const db = require("../model/dbUpdated");
const User = db.user;
const task_details = db.task_details;
const sequelize = db.sequelize;

const login = (req, res) => {
  res.render("login");
};
const signup = (req, res) => {
  res.render("signup");
};
const postsignup = async (req, res) => {
  let { name, email, password, password1 } = req.body;
  if (password != password1) {
    let msg = "Password and Conform Password Must Be Same ";
    res.render("message", { msg: msg });
  } else {
    const valid = await User.findOne({
      where: {
        email: email,
      },
    });

    if (valid) {
      let msg = "Email is already Register, Please Sign Up";
      res.render("message", { msg: msg });
    } else {
      let hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name: name,
        email: email,
        password: hash,
      });
      let userData = {
        user_id: user.id,
        name: user.name,
      };
      res.cookie("userData", userData);
      const tasks = await User.update(
        { lastLogin: sequelize.literal("CURRENT_TIMESTAMP") },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.render("task", {
        name: user.name,
        email: user.email,
        tasks: "",
        task_count: 0,
        user_id: user.id,
      });
    }
  }
};
const postlogin = async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASS
  ) {
    const task = await task_details.findAll({
      attributes: ["task", "UserId"],
    });

    let all_task = [];
    let all_user_id = [];
    for (let i = 0; i < task.length; i++) {
      all_task.push(task[i].task);
      all_user_id.push(task[i].UserId);
    }

    const user = await User.findAll({
      attributes: ["id", "name"],
    });

    let all_user_name = [];
    let all_usersbyid = [];
    for (let i = 0; i < user.length; i++) {
      all_user_name.push(user[i].name);
      all_usersbyid.push(user[i].id);
    }

    res.render("admin", {
      name: "Admin",
      task_count: task.length,
      tasks: all_task,
      user: all_user_id,
      user_count: user.length,
      user_name: all_user_name,
      all_usersbyid: all_usersbyid,
    });
  } else {
    const valid = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!valid) {
      let msg = "Email is not Register, Please Sign Up";
      res.render("message", { msg: msg });
    } else {
      bcrypt.compare(password, valid.password, async (err, isMatch) => {
        if (err) {
          throw err;
        } else {
          if (!isMatch) {
            let msg = "Wrong Email or Password";
            res.render("message", { msg: msg });
          } else {
            const task = await task_details.findAll({
              where: { UserId: valid.id },
            });
            let all_task = [];
            for (let i = 0; i < task.length; i++) {
              all_task.push(task[i].task);
            }
            let userData = {
              user_id: valid.id,
              name: valid.name,
            };
            res.cookie("userData", userData);
            const tasks = await User.update(
              { lastLogin: sequelize.literal("CURRENT_TIMESTAMP") },
              {
                where: {
                  id: valid.id,
                },
                silent: true,
              }
            );
            res.render("task", {
              name: valid.name,
              email: email,
              tasks: all_task,
              task_count: task.length,
              user_id: valid.id,
            });
          }
        }
      });
    }
  }
};

module.exports = {
  login,
  postlogin,
  signup,
  postsignup,
};
