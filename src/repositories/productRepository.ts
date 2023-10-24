import {ObjectId} from "mongodb";

const productsRepository = {

  getAll: async (db,param) => {
    const query = {}
    if (param.size) {
      query[`size.${param.size}`] = {$gt: 0}
    }
    if (param.maxPrice) {
      query.price = {$gte: +param.minPrice, $lte: +param.maxPrice}
    }
    let cursor = db.collection("t-shirt1").find(query)
    if (param.sort) {
      cursor = cursor.sort({price: param.sort})
    }
    return await cursor.toArray()
  },
  getProductById: async (db, id) => {
    return await db.collection("t-shirt1").findOne({_id: new ObjectId(id)})
  },
  checkCountProduct: async (db, product) => {
    return await db.collection("t-shirt1").findOne({
      _id: new ObjectId(product._id)
    })
  }
}
module.exports = productsRepository
