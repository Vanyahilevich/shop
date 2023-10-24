"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignUp = void 0;
const express_validator_1 = require("express-validator");
const validateSignUp = () => {
    (0, express_validator_1.body)("email").isEmail();
};
exports.validateSignUp = validateSignUp;
