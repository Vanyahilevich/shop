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
const mongodb_1 = require("mongodb");
const crypto_1 = __importDefault(require("crypto"));
const nanoid_1 = require("nanoid");
const authRepository = {
    getUserByUserEmail: (db, email) => __awaiter(void 0, void 0, void 0, function* () {
        return db.collection("users").findOne({ email });
    }),
    getUserBySessionId: (db, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield db.collection("sessions").findOne({ sessionId: sessionId });
        if (!session) {
            return;
        }
        return db.collection("users").findOne({ _id: new mongodb_1.ObjectId(session.userId) });
    }),
    createUser: (db, { username, surname, email, password, imageURL }) => __awaiter(void 0, void 0, void 0, function* () {
        const { insertedId } = yield db.collection("users").insertOne({
            username,
            surname,
            email,
            password: crypto_1.default.createHash('sha256').update(password).digest('hex'),
            imageURL: imageURL ? imageURL : undefined,
        });
        return insertedId;
    }),
    createSession: (db, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = (0, nanoid_1.nanoid)();
        yield db.collection("sessions").insertOne({
            userId,
            sessionId,
        });
        return sessionId;
    }),
    deleteSession: (db, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
        yield db.collection("sessions").deleteOne({ sessionId });
    })
};
module.exports = authRepository;
