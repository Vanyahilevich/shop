const express = require('express');
const router = express.Router();

const productsRouter = require("./productsRouter")
const authRouter = require("./authRouter")
const basketRouter = require("./basketRouter")


router.use("/auth", authRouter);
router.use("/products", productsRouter)
router.use("/basket", basketRouter)


module.exports = router
