const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const db = require("../model/dbUpdated");
const User = db.user;
const task_details = db.task_details;
const sequelize = db.sequelize;
const gettodos = (req, res) => {};

const addtask = (req, res) => {
  const id = parseInt(req.params.id);
  res.render("addtask", { user_id: id });
};
const postaddtask = async (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;

  const tasks = await task_details.create({
    UserId: id,
    task: task,
  });
  const user = await User.findOne({
    where: {
      id: id,
    },
  });
  const { count, rows } = await task_details.findAndCountAll({
    where: {
      UserId: id,
    },
  });

  let all_task = [];
  for (let i = 0; i < count; i++) {
    all_task.push(rows[i].task);
  }

  res.render("task", {
    name: user.name,
    tasks: all_task,
    task_count: count,
    user_id: id,
  });
};
const deletetask = async (req, res) => {
  const user_id = parseInt(req.params.id);

  const { count, rows } = await task_details.findAndCountAll({
    where: {
      UserId: user_id,
    },
  });

  let all_task = [];
  for (let i = 0; i < count; i++) {
    all_task.push(rows[i].task);
  }
  res.render("deletetask", {
    task_count: count,
    tasks: all_task,
    user_id: user_id,
  });
};
const postdeletetask = async (req, res) => {
  const { checkbox } = req.body;

  for (let i = 0; i < checkbox.length; i++) {
    const deletetask = await task_details.destroy({
      where: { task: checkbox[i] },
    });
  }
  let name = req.cookies.userData.name;
  let user_id = req.cookies.userData.user_id;
  const { count, rows } = await task_details.findAndCountAll({
    where: {
      UserId: user_id,
    },
  });

  let all_task = [];
  for (let i = 0; i < count; i++) {
    all_task.push(rows[i].task);
  }
  res.render("task", {
    name: name,
    user_id: user_id,
    task_count: count,
    tasks: all_task,
  });
};
const updatetask = async (req, res) => {
  const user_id = parseInt(req.params.id);

  const { count, rows } = await task_details.findAndCountAll({
    where: {
      UserId: user_id,
    },
  });

  let all_task = [];
  for (let i = 0; i < count; i++) {
    all_task.push(rows[i].task);
  }
  res.render("updatetask", {
    task_count: count,
    tasks: all_task,
    user_id: user_id,
  });
};
const postupdatetask = async (req, res) => {
  const { radio, task } = req.body;
  const user_id = parseInt(req.params.id);
  const tasks = await task_details.update(
    { task: task },
    {
      where: {
        task: radio,
      },
    }
  );
  const user = await User.findOne({
    where: {
      id: user_id,
    },
  });
  const { count, rows } = await task_details.findAndCountAll({
    where: {
      UserId: user_id,
    },
  });

  let all_task = [];
  for (let i = 0; i < count; i++) {
    all_task.push(rows[i].task);
  }
  res.render("task", {
    name: user.name,
    user_id: user_id,
    task_count: count,
    tasks: all_task,
  });
};

const deletealltasks = async (req, res) => {
  const user_id = parseInt(req.params.id);

  const deletetask = await task_details.destroy({
    where: { UserId: user_id },
  });
  const user = await User.findOne({
    where: {
      id: user_id,
    },
  });

  res.render("task", {
    name: user.name,
    email: user.email,
    tasks: "",
    task_count: 0,
    user_id: user.id,
  });
};

module.exports = {
  gettodos,
  addtask,
  postaddtask,
  deletetask,
  postdeletetask,
  updatetask,
  postupdatetask,
  deletealltasks,
};
