const { Router } = require("express");
const controllers = require("../controller/controller");
const authenticate = require("../controller/authentication");
const admin = require("../controller/admin");
const profile = require("../controller/profile");
const router = Router();

router.get("/", controllers.gettodos); // Home

router.get("/login", authenticate.login);
router.get("/signup", authenticate.signup); // Authentiate.js
router.post("/signup", authenticate.postsignup);
router.post("/login", authenticate.postlogin);

router.get("/addtask/:id", controllers.addtask);
router.post("/addtask/:id", controllers.postaddtask);
router.get("/deletetask/:id", controllers.deletetask);
router.post("/deletetask/:id", controllers.postdeletetask); // Controllers.js
router.get("/updatetask/:id", controllers.updatetask);
router.post("/updatetask/:id", controllers.postupdatetask);
router.get("/deletealltasks/:id", controllers.deletealltasks);

router.get("/profile/:id", profile.profile);
router.post("/profile/:id", profile.postprofile);
router.get("/changepass/:id", profile.changepass); // Profile.js
router.get("/resetpassword/:id/:token", profile.linkpass);
router.post("/resetpassword/:id/:token", profile.resetpass);
router.get("/deleteuser/:id", profile.deleteuser);
router.get("/logout", profile.logout);

router.get("/deleteuserbyadmin", admin.deleteuserbyadmin);
router.post("/deleteuserbyadmin", admin.postdeleteuserbyadmin);
router.get("/deletealluserbyadmin", admin.deletealluserbyadmin); // Admin.js
router.get("/deletetaskbyadmin", admin.deletetaskbyadmin);
router.post("/deletetaskbyadmin", admin.postdeletetaskbyadmin);
router.get(
  "/deleteAllTaskOfOneUserByAdmin",
  admin.deleteAllTaskOfOneUserByAdmin
);
router.post(
  "/deleteAllTaskOfOneUserByAdmin",
  admin.postdeleteAllTaskOfOneUserByAdmin
);
router.get("/deleteAllTaskByAdmin", admin.deleteAllTaskByAdmin);

module.exports = router;
