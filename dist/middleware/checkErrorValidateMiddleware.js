"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkErrorValidateMiddleware = void 0;
const express_validator_1 = require("express-validator");
const checkErrorValidateMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log("error");
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        next();
    }
};
exports.checkErrorValidateMiddleware = checkErrorValidateMiddleware;
