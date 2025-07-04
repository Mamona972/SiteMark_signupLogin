const express= require("express");
const router= express.Router();
const {userVerification} =require("../Middlewares/AuthMiddleware");
const authController= require("../controllers/authController");


router.post("/signup",authController.postSignup);
router.post("/login", authController.postLogin);
router.post("/verify-token", userVerification);
router.post("/logout",authController.Logout  );
router.post("/forget-password",authController.forgetPassword  );
router.post("/reset-password",authController.resetPassword );




module.exports=router;