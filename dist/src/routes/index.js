"use strict";
const express = require('express');
const router = express.Router();
const productsRouter = require("./productsRouter");
const authRouter = require("./authRouter");
router.use("/auth", authRouter);
router.use("/products", productsRouter);
module.exports = router;
