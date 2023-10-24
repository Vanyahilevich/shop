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
const basketRepository = {
    getAllProductInBasket: (db, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const basket = yield db.collection("basket").findOne({ user_id: new mongodb_1.ObjectId(userId) });
        return basket.items;
    }),
    createBasket: (db, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db.collection("basket").insertOne({
            user_id: id,
            items: [],
            created_at: new Date(),
        });
    }),
    findProductInBasket: (db, id, size, user) => __awaiter(void 0, void 0, void 0, function* () {
        return db.collection("basket").findOne({
            user_id: user._id,
            'items': {
                $elemMatch: {
                    product_id: new mongodb_1.ObjectId(id),
                    size: size,
                }
            },
        });
    }),
    addNewProductToBasket: (db, newProduct, user) => __awaiter(void 0, void 0, void 0, function* () {
        yield db.collection("basket")
            .updateOne({ user_id: user._id }, { $push: { items: newProduct } });
    }),
    updateExistProductToBasket: (db, id, size, user, operation) => __awaiter(void 0, void 0, void 0, function* () {
        if (operation === 1) {
            return yield db.collection("basket").updateOne({
                user_id: user._id,
                'items': {
                    $elemMatch: {
                        product_id: new mongodb_1.ObjectId(id),
                        size: size,
                    }
                },
            }, { $inc: { 'items.$.quantity': 1 } });
        }
        else {
            return yield db.collection("basket").updateOne({
                user_id: user._id,
                'items': {
                    $elemMatch: {
                        product_id: new mongodb_1.ObjectId(id),
                        size: size,
                        quantity: { $gt: 1 }
                    }
                },
            }, { $inc: { 'items.$.quantity': -1 } });
        }
    }),
    deleteProductInBasket: (db, user, productId, size) => __awaiter(void 0, void 0, void 0, function* () {
        yield db.collection("basket").updateOne({ user_id: user._id }, { $pull: { "items": { "size": size, "product_id": new mongodb_1.ObjectId(productId) } } });
    })
};
module.exports = basketRepository;
