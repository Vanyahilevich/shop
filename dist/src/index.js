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
require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const router = require("./routes/index");
const { MongoClient, ObjectId } = require("mongodb");
const clientPromise = MongoClient.connect(process.env.DB_URI, {});
const jsonParser = express.json();
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield clientPromise;
        req.db = client.db("users");
        next();
    }
    catch (error) {
        next(error);
    }
}));
app.use(cookieParser());
app.use(jsonParser);
app.use(express.urlencoded());
app.use(express.static('public'));
app.use("/api", router);
app.use((err, req, res, next) => {
    if (err) {
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Непредвиденная ошибка!" });
});
app.listen(port, () => console.log(`Listening on port ${port}`));
