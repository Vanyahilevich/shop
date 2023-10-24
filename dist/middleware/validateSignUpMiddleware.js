"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignUpMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validateSignUpMiddleware = (req, res, next) => {
    return [
        (0, express_validator_1.body)("email").isEmail().isLength({ min: 1, max: 3 }),
        (0, express_validator_1.body)("password").isString().isLength({ min: 1, max: 3 }),
    ];
};
exports.validateSignUpMiddleware = validateSignUpMiddleware;
