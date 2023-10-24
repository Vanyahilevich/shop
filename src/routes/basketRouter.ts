import authMiddleware from "../middleware/authMiddleware";

const express = require('express');
const router = express.Router();
const basketController = require("../controllers/basketController")


router.get("/",  authMiddleware, basketController.getAllProductInBasket)
router.post("/", authMiddleware, basketController.addProductToBasket)
router.put("/", authMiddleware, basketController.updateQuantityProductInBasket)
router.delete("/", authMiddleware, basketController.deleteProductInBasket)


module.exports = router
