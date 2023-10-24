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
const productsRepository = {
    getAll: (db, param) => __awaiter(void 0, void 0, void 0, function* () {
        const query = {};
        if (param.size) {
            query[`size.${param.size}`] = { $gt: 0 };
        }
        if (param.maxPrice) {
            query.price = { $gte: +param.minPrice, $lte: +param.maxPrice };
        }
        let cursor = db.collection("t-shirt1").find(query);
        if (param.sort) {
            cursor = cursor.sort({ price: param.sort });
        }
        return yield cursor.toArray();
    }),
    getProductById: (db, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db.collection("t-shirt1").findOne({ _id: new mongodb_1.ObjectId(id) });
    }),
    checkCountProduct: (db, product) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db.collection("t-shirt1").findOne({
            _id: new mongodb_1.ObjectId(product._id)
        });
    })
};
module.exports = productsRepository;
