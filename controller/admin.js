require("dotenv").config();
const db = require("../model/dbUpdated");
const User = db.user;
const task_details = db.task_details;

const deleteuserbyadmin = (req, res) => {
  res.render("deleteuser");
};
const postdeleteuserbyadmin = async (req, res) => {
  const { user } = req.body;

  const deleteuser = await User.destroy({
    where: { id: user },
  });
  let msg = "User is Deleted :) ";
  res.render("message", { msg: msg });
};

const deletealluserbyadmin = async (req, res) => {
  const deleteuser = await User.destroy({
    where: {},
  });
  let msg = "All the Users are Deleted :) ";
  res.render("message", { msg: msg });
};

const deletetaskbyadmin = (req, res) => {
  res.render("deletetaskbyadmin");
};
const postdeletetaskbyadmin = async (req, res) => {
  const { task_id } = req.body;
  const deletetask = await task_details.destroy({
    where: { id: task_id },
  });
  let msg = "Task is Deleted :) ";
  res.render("message", { msg: msg });
};

const deleteAllTaskOfOneUserByAdmin = (req, res) => {
  res.render("deleteAllTaskOfOneUserByAdmin");
};
const postdeleteAllTaskOfOneUserByAdmin = async (req, res) => {
  const { user_id } = req.body;
  const deletetask = await task_details.destroy({
    where: { UserId: user_id },
  });
  let msg = "All the Tasks are Deleted  ";
  res.render("message", { msg: msg });
};

const deleteAllTaskByAdmin = async (req, res) => {
  const deletetask = await task_details.destroy({
    where: {},
  });
  let msg = " All the Tasks are Deleted ";
  res.render("message", { msg: msg });
};

module.exports = {
  deletealluserbyadmin,
  deleteAllTaskByAdmin,
  deletetaskbyadmin,
  postdeletetaskbyadmin,
  deleteAllTaskOfOneUserByAdmin,
  postdeleteAllTaskOfOneUserByAdmin,
  postdeleteuserbyadmin,
  deleteuserbyadmin,
};
