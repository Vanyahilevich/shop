import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export const checkErrorValidateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log("error")
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(400).json({errors: errors.array()});
  } else {
    next()
  }
}
