const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    logging: false,
    dialect: process.env.DB_USER,
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./users")(sequelize, DataTypes);
db.task_details = require("./tasks")(sequelize, DataTypes);

db.user.hasMany(db.task_details, {
  onDelete: "CASCADE",
});
db.task_details.belongsTo(db.user);

db.sequelize.sync({ force: false });

module.exports = db;
