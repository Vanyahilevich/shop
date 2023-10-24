import {checkErrorValidateMiddleware} from "../middleware/checkErrorValidateMiddleware";
import {signUpValidationRules} from "../validate/signUpValidationRules"
import {signInValidationRules} from "../validate/signInValidationRules"

const express = require("express")
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware')
const authController = require('../controllers/authController')

router.post(
  "/signup",
  signUpValidationRules(),
  checkErrorValidateMiddleware,
  authController.signUp
);
router.post(
  "/signin",
  signInValidationRules(),
  checkErrorValidateMiddleware,
  authController.signIn);

router.get("/auth", authMiddleware, authController.auth);
router.get("/logout", authMiddleware, authController.logOut);

module.exports = router
