import {Request, Response} from "express";
import {ObjectId} from "mongodb";

const productRepository = require("../repositories/productRepository")
const basketRepository = require("../repositories/basketRepository")


const basketController = {
  getAllProductInBasket: async (req, res) => {
    const productsPointer = await basketRepository.getAllProductInBasket(req.db, req.user._id)
    if (productsPointer.length === 0) {
      return res.json([])
    }
    const promiseArr = productsPointer.map(item => {
      return new Promise(async (resolve, reject) => {
        const result = await productRepository.getProductById(req.db, item.product_id)
        result.size = item.size
        result.count = item.quantity
        if (result) {
          resolve(result);
        } else {
          reject('Ошибка выполнения операции');
        }
      });
    })
    const result = await Promise.all(promiseArr)
    res.json(result)
  },

  addProductToBasket: async (req: Request, res: Response) => {
    try {
      const {product, size} = req.body
      const user = req.user
      console.log(user, product._id, size)
      const productInBasket = await basketRepository.findProductInBasket(req.db, product._id, size, user)
      console.log("productInBasket", productInBasket)
      if (!productInBasket) {
        const newProduct = {
          product_id: new ObjectId(product._id),
          quantity: 1,
          size: size
        }
        await basketRepository.addNewProductToBasket(req.db, newProduct, user)
        return res.status(201).json()
      }
      await basketRepository.updateExistProductToBasket(req.db, product._id, size, req.user, 1)
      const allProductBasket = await basketRepository.getAllProductInBasket(req.db, user._id)
      const quantityProductInBasket = allProductBasket.reduce((acc, item) => {
        return acc += item.quantity
      }, 0)
      res.status(201).json({quantityProductInBasket: quantityProductInBasket})

    } catch (error) {
      throw new Error(error.message)
    }


  },
  updateQuantityProductInBasket: async (req: Request, res: Response) => {
    const {id, operation, size} = req.body

    await basketRepository.updateExistProductToBasket(req.db, id, size, req.user, operation)

    res.sendStatus(200)
  },
  deleteProductInBasket: async (req: Request, res: Response) => {
    const {productId, size} = req.body
    const user = req.user
    await basketRepository.deleteProductInBasket(req.db, user, productId, size)
    res.status(200).json({})
  }


}

module.exports = basketController
