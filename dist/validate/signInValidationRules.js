"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidationRules = void 0;
const express_validator_1 = require("express-validator");
const signInValidationRules = () => {
    return [
        (0, express_validator_1.body)("email").isEmail(),
        (0, express_validator_1.body)("password").isString().isLength({ min: 2, max: 50 }),
    ];
};
exports.signInValidationRules = signInValidationRules;
