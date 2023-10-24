"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const express = require('express');
const router = express.Router();
const productsController = require("../controllers/productsController");
router.get("/", productsController.getAll);
router.get("/:id", productsController.getProductById);
router.put("/updateProducts", authMiddleware_1.default, productsController.updateProducts);
module.exports = router;
