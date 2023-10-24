import {body} from "express-validator";

export const signInValidationRules = () => {
  return [
    body("email").isEmail(),
    body("password").isString().isLength({min: 2, max: 50}),
  ]
}
