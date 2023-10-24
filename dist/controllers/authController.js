"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const authRepository = require('../repositories/authRepository');
const basketRepository = require('../repositories/basketRepository');
const authController = {
    signUp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.body;
        try {
            const result = yield authRepository.getUserBySessionId(req.db, user.email);
            if (!!result) {
                const error = new Error('User with this email already exists.');
                error.status = 400;
                res.status(error.status).json({ error: error.message });
                return;
            }
            const createdIdUser = yield authRepository.createUser(req.db, user);
            yield basketRepository.createBasket(req.db, createdIdUser);
            res.status(201).json(createdIdUser);
        }
        catch (error) {
            next(error);
        }
    }),
    signIn: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield authRepository.getUserByUserEmail(req.db, email);
            if (!user || user.password !== crypto_1.default.createHash('sha256').update(password).digest('hex')) {
                const error = new Error('Wrote email or password');
                error.status = 400;
                res.status(error.status).json({ error: error.message });
            }
            const sessionId = yield authRepository.createSession(req.db, user._id);
            res
                .cookie("sessionId", sessionId, { httpOnly: true, expires: 0 })
                .status(200)
                .json(user);
        }
        catch (error) {
            next(error);
        }
    }),
    auth: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield authRepository.getUserBySessionId(req.db, req.cookies['sessionId']);
        req.user = user;
        req.sessionId = req.cookies['sessionId'];
        if (!req.user) {
            return res.sendStatus(401);
        }
        res.status(200).json(user);
    }),
    logOut: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return res.redirect('/');
        }
        yield authRepository.deleteSession(req.db, req.sessionId);
        res.clearCookie("sessionId").json({ message: "delete cookie" });
    })
};
module.exports = authController;
