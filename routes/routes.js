const { Router } = require("express");
const controllers = require("../controller/controller");
const router = Router();

router.get("/", controllers.gettodos);
router.get("/login", controllers.login);
router.get("/signup", controllers.signup);
router.post("/signup", controllers.postsignup);
router.post("/login", controllers.postlogin);
router.get("/addtask/:id", controllers.addtask);
router.post("/addtask/:id", controllers.postaddtask);
router.get("/deletetask/:id", controllers.deletetask);
router.post("/deletetask/:id", controllers.postdeletetask);
router.get("/updatetask/:id", controllers.updatetask);
router.post("/updatetask/:id", controllers.postupdatetask);
router.get("/deleteuser/:id", controllers.deleteuser);
router.get("/deletealltasks/:id", controllers.deletealltasks);
router.get("/profile/:id", controllers.profile);
router.post("/profile/:id", controllers.postprofile);
router.get("/changepass/:id", controllers.changepass);
router.post("/changepass/:id", controllers.postchangepass);
router.get("/resetpassword/:id/:token", controllers.linkpass);
router.post("/resetpassword/:id/:token", controllers.resetpass);
router.get("/logout", controllers.logout);
router.get("/deleteuserbyadmin", controllers.deleteuserbyadmin);
router.post("/deleteuserbyadmin", controllers.postdeleteuserbyadmin);
router.get("/deletealluserbyadmin", controllers.deletealluserbyadmin);
router.get("/deletetaskbyadmin", controllers.deletetaskbyadmin);
router.post("/deletetaskbyadmin", controllers.postdeletetaskbyadmin);
router.get(
  "/deleteAllTaskOfOneUserByAdmin",
  controllers.deleteAllTaskOfOneUserByAdmin
);
router.post(
  "/deleteAllTaskOfOneUserByAdmin",
  controllers.postdeleteAllTaskOfOneUserByAdmin
);

router.get("/deleteAllTaskByAdmin", controllers.deleteAllTaskByAdmin);
module.exports = router;
