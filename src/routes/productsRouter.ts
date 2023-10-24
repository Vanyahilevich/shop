import authMiddleware from "../middleware/authMiddleware";

const express = require('express');
const router = express.Router();

const productsController = require("../controllers/productsController")


router.get("/", productsController.getAll)
router.get("/:id", productsController.getProductById)
router.put("/updateProducts",authMiddleware, productsController.updateProducts)


module.exports = router
