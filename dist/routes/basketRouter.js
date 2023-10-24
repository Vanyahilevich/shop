"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const express = require('express');
const router = express.Router();
const basketController = require("../controllers/basketController");
router.get("/", authMiddleware_1.default, basketController.getAllProductInBasket);
router.post("/", authMiddleware_1.default, basketController.addProductToBasket);
router.put("/", authMiddleware_1.default, basketController.updateQuantityProductInBasket);
router.delete("/", authMiddleware_1.default, basketController.deleteProductInBasket);
module.exports = router;
