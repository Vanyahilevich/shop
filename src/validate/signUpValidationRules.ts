import {body} from "express-validator";

export const signUpValidationRules = () => {
  return [
    body("email").isEmail(),
    body("password").isString().isLength({min: 2, max: 50}),
    body("username").isString().isLength({min: 2, max: 50}),
    body("surname").isString().isLength({min: 2, max: 50}),
  ]
}
