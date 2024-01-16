const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const db = require("../model/dbUpdated");
const User = db.user;
const task_details = db.task_details;
const sequelize = db.sequelize;

const profile = async (req, res) => {
  const user_id = parseInt(req.params.id);
  const user = await User.findOne({
    where: {
      id: user_id,
    },
  });

  res.render("profile", {
    user_id: user_id,
    name: user.name,
    email: user.email,
    position: user.position,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    last_login: user.lastLogin,
  });
};
const postprofile = async (req, res) => {
  const { name, email } = req.body;
  const user_id = parseInt(req.params.id);

  const user = await User.update(
    { name: name, email: email },
    {
      where: {
        id: user_id,
      },
    }
  );
  res.render("login");
};
const changepass = async (req, res) => {
  const user_id = parseInt(req.params.id);
  const user = await User.findOne({
    where: {
      id: user_id,
    },
  });

  const JWT_SECRET = process.env.JWT_SECRET;
  const secret = JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    user_id: user_id,
  };
  const token = JWT.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:3000/todo/resetpassword/${user_id}/${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: `${user.email}`,
    subject: "Password Reset Link",
    text: `Link is Provided Below and NOTE:- Link will be Vaild only for 15 Min
    
    ${link}`,
    html: `Link is Provided Below and NOTE:- Link will be Vaild only for 15 Min
    
    ${link}`,
  });
  let msg = "Password Reset Link is sent to Your Email";
  res.render("message", { msg: msg });
};

const linkpass = async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  const JWT_SECRET = process.env.JWT_SECRET;
  const secret = JWT_SECRET + user.password;
  const payload = JWT.verify(token, secret);
  res.render("changepass", {
    user_id: id,
    name: user.name,
    token: token,
  });
};
const resetpass = async (req, res) => {
  const user_id = parseInt(req.params.id);
  const { password } = req.body;
  let hash = await bcrypt.hash(password, 10);
  const tasks = await User.update(
    { password: hash },
    {
      where: {
        id: user_id,
      },
    }
  );
  let msg = "Password Changed Successfully :)";
  res.render("message", { msg: msg });
};
const logout = (req, res) => {
  res.clearCookie("userData");

  res.render("login");
};

const deleteuser = async (req, res) => {
  const user_id = parseInt(req.params.id);
  const deleteuser = await User.destroy({
    where: { id: user_id },
  });
  res.clearCookie("userData");
  let msg = "User Deleted Successfully :) ";
  res.render("message", { msg: msg });
};

module.exports = {
  deleteuser,
  logout,
  resetpass,
  linkpass,
  changepass,
  profile,
  postprofile,
};
