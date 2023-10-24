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
const productRepository = require("../repositories/productRepository");
const productsController = {
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = yield productRepository.getAll(req.db, req.query);
            res.json(products);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    getProductById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productId = req.params.id;
            const result = yield productRepository.getProductById(req.db, productId);
            res.json(result);
        }
        catch (error) {
            return new Error(error.message);
        }
    }),
    updateProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = req.body;
            const user = req.user;
            const arrPromise = products.map(product => {
                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                    const result = yield productRepository.checkCountProduct(req.db, product);
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject("error in sever");
                    }
                }));
            });
            const result = yield Promise.all(arrPromise);
            const InfoProduct = [];
            result.forEach((origProduct, index) => {
                const basketProduct = products[index];
                if (origProduct.size[basketProduct.size] >= basketProduct.count) {
                    console.log("success");
                }
                else {
                    console.log("error", origProduct);
                    InfoProduct.push({
                        _id: origProduct._id,
                        size: origProduct.size[basketProduct.size]
                    });
                }
            });
            console.log("INFOERROR", InfoProduct);
            if (InfoProduct.length === 0) {
                res.status(200).json({ message: "all okey" });
            }
            res.json(InfoProduct);
            // console.log(result, products)
        }
        catch (error) {
            return new Error(error.message);
        }
    })
};
module.exports = productsController;
