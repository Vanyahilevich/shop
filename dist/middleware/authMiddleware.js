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
const authRepository = require("../repositories/authRepository");
module.exports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies['sessionId']) {
            next();
        }
        const user = yield authRepository.getUserBySessionId(req.db, req.cookies['sessionId']);
        if (!user) {
            return res.status(401).json({ message: 'Недопустимая сессия' });
        }
        req.user = user;
        req.sessionId = req.cookies['sessionId'];
        next();
    }
    catch (error) {
        // Обработка ошибки при работе с базой данных
        console.error('Ошибка при поиске пользователя по сессии:', error);
        next(error); // Передача ошибки в обработчик ошибок Express
    }
});
