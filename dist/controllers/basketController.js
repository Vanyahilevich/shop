"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const productRepository = require("../repositories/productRepository");
const basketRepository = require("../repositories/basketRepository");
const basketController = {
    getAllProductInBasket: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const productsPointer = yield basketRepository.getAllProductInBasket(req.db, req.user._id);
        if (productsPointer.length === 0) {
            return res.json([]);
        }
        const promiseArr = productsPointer.map(item => {
            return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield productRepository.getProductById(req.db, item.product_id);
                result.size = item.size;
                result.count = item.quantity;
                if (result) {
                    resolve(result);
                }
                else {
                    reject('Ошибка выполнения операции');
                }
            }));
        });
        const result = yield Promise.all(promiseArr);
        res.json(result);
    }),
    addProductToBasket: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { product, size } = req.body;
            const user = req.user;
            console.log(user, product._id, size);
            const productInBasket = yield basketRepository.findProductInBasket(req.db, product._id, size, user);
            console.log("productInBasket", productInBasket);
            if (!productInBasket) {
                const newProduct = {
                    product_id: new mongodb_1.ObjectId(product._id),
                    quantity: 1,
                    size: size
                };
                yield basketRepository.addNewProductToBasket(req.db, newProduct, user);
                return res.status(201).json();
            }
            yield basketRepository.updateExistProductToBasket(req.db, product._id, size, req.user, 1);
            const allProductBasket = yield basketRepository.getAllProductInBasket(req.db, user._id);
            const quantityProductInBasket = allProductBasket.reduce((acc, item) => {
                return acc += item.quantity;
            }, 0);
            res.status(201).json({ quantityProductInBasket: quantityProductInBasket });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    updateQuantityProductInBasket: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, operation, size } = req.body;
        yield basketRepository.updateExistProductToBasket(req.db, id, size, req.user, operation);
        res.sendStatus(200);
    }),
    deleteProductInBasket: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId, size } = req.body;
        const user = req.user;
        yield basketRepository.deleteProductInBasket(req.db, user, productId, size);
        res.status(200).json({});
    })
};
module.exports = basketController;
