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
const express = require("express");
const Router = require("express");
const { ObjectId } = require("mongodb");
const { nanoid } = require("nanoid");
const router = new Router();
const crypto = require('crypto');
console.log("auth");
const findUserByUserEmail = (db, email) => __awaiter(void 0, void 0, void 0, function* () {
    return db.collection("users").findOne({ email });
});
const findUserBySessionId = (db, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield db.collection("sessions").findOne({ sessionId }, {
        projection: { userId: 1 }
    });
    if (!session) {
        return;
    }
    return db.collection("users").findOne({ _id: new ObjectId(session.userId) });
});
const createUser = (db, { username, surname, email, password, imageURL }) => __awaiter(void 0, void 0, void 0, function* () {
    const { insertedId } = yield db.collection('users').insertOne({
        username,
        surname,
        email,
        password: crypto.createHash('sha256').update(password).digest('hex'),
        imageURL: imageURL ? imageURL : undefined,
    });
    return insertedId;
});
const createSession = (db, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = nanoid();
    yield db.collection("sessions").insertOne({
        userId,
        sessionId,
    });
    return sessionId;
});
const deleteSession = (db, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.collection("sessions").deleteOne({ sessionId });
});
const auth = () => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies['sessionId']) {
        return next();
    }
    const user = yield findUserBySessionId(req.db, req.cookies['sessionId']);
    req.user = user;
    req.sessionId = req.cookies['sessionId'];
    next();
});
router.use(auth);
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const result = yield findUserByUserEmail(req.db, user.email);
        if (!!result) {
            const error = new Error('User with this email already exists.');
            error.status = 400;
            res.status(error.status).json({ error: error.message });
        }
        const createdIdUser = yield createUser(req.db, user);
        res.status(201).json(createdIdUser);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/signin", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield findUserByUserEmail(req.db, email);
        if (!user || user.password !== crypto.createHash('sha256').update(password).digest('hex')) {
            const error = new Error('Wrote email or password');
            error.status = 400;
            res.status(error.status).json({ error: error.message });
        }
        const sessionId = yield createSession(req.db, user._id);
        res
            .cookie("sessionId", sessionId, { httpOnly: true, expires: 0 })
            .status(200)
            .json(user);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/auth", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield findUserBySessionId(req.db, req.cookies['sessionId']);
    req.user = user;
    req.sessionId = req.cookies['sessionId'];
    if (!req.user) {
        return res.sendStatus(401);
    }
    res.status(200).json(user);
}));
router.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.redirect('/');
    }
    yield deleteSession(req.db, req.sessionId);
    res.clearCookie("sessionId").json({ message: "delete cookie" });
}));
module.exports = router;
