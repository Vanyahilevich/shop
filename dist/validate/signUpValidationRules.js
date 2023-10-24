"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidationRules = void 0;
const express_validator_1 = require("express-validator");
const signUpValidationRules = () => {
    return [
        (0, express_validator_1.body)("email").isEmail(),
        (0, express_validator_1.body)("password").isString().isLength({ min: 2, max: 50 }),
        (0, express_validator_1.body)("username").isString().isLength({ min: 2, max: 50 }),
        (0, express_validator_1.body)("surname").isString().isLength({ min: 2, max: 50 }),
    ];
};
exports.signUpValidationRules = signUpValidationRules;
