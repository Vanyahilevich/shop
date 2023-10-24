import crypto from "crypto";
import {Request,Response,NextFunction} from 'express';
const authRepository = require('../repositories/authRepository')
const basketRepository = require('../repositories/basketRepository')

const authController = {
  signUp: async (req:Request, res:Response, next:NextFunction) => {
    const user = req.body;
    try {
      const result = await authRepository.getUserBySessionId(req.db, user.email)
      if (!!result) {
        const error = new Error('User with this email already exists.');
        error.status = 400;
        res.status(error.status).json({error: error.message});
        return
      }
      const createdIdUser = await authRepository.createUser(req.db, user)
      await basketRepository.createBasket(req.db, createdIdUser)
      res.status(201).json(createdIdUser);
    } catch (error) {
      next(error)
    }
  },
  signIn: async (req, res, next) => {
    const {email, password} = req.body

    try {
      const user = await authRepository.getUserByUserEmail(req.db, email)

      if (!user || user.password !== crypto.createHash('sha256').update(password).digest('hex')) {
        const error = new Error('Wrote email or password');
        error.status = 400;
        res.status(error.status).json({error: error.message});
      }
      const sessionId = await authRepository.createSession(req.db, user._id)
      res
        .cookie("sessionId", sessionId, {httpOnly: true, expires: 0})
        .status(200)
        .json(user)
    } catch (error) {
      next(error)
    }

  },
  auth: async (req, res, next) => {

    const user = await authRepository.getUserBySessionId(req.db, req.cookies['sessionId'])
    req.user = user;
    req.sessionId = req.cookies['sessionId'];
    if (!req.user) {
      return res.sendStatus(401)
    }
    res.status(200).json(user)
  },

  logOut: async (req, res) => {
    if (!req.user) {
      return res.redirect('/')
    }
    await authRepository.deleteSession(req.db, req.sessionId)
    res.clearCookie("sessionId").json({message: "delete cookie"})
  }
}
module.exports = authController
