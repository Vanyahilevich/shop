import {Express} from "express";

require("dotenv").config()
const express:Express = require('express');
const cookieParser = require("cookie-parser")

const app:Express = express();
const port = process.env.PORT || 5000;

const connectDB = require('./db')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require("./routes/index")


app.use(connectDB);
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));


app.use("/api", router)
app.use(errorHandler)

app.listen(port, () => console.log(`Listening on port ${port}`));
