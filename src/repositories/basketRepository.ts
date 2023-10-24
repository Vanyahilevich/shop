import {ObjectId} from "mongodb";

const basketRepository = {

  getAllProductInBasket: async (db, userId) => {
    const basket = await db.collection("basket").findOne({user_id: new ObjectId(userId)})
    return basket.items
  },
  createBasket: async (db, id) => {
    return await db.collection("basket").insertOne({
      user_id: id,
      items: [],
      created_at: new Date(),
    })
  },
  findProductInBasket: async (db, id, size ,user) => {
    return db.collection("basket").findOne({
      user_id: user._id,
      'items': {
        $elemMatch: {
          product_id: new ObjectId(id),
          size: size,
        }
      },
    })
  },
  addNewProductToBasket: async (db, newProduct, user) => {
    await db.collection("basket")
      .updateOne(
        {user_id: user._id},
        {$push: {items: newProduct}}
      )
  },
  updateExistProductToBasket: async (db, id, size, user, operation) => {
    if (operation === 1) {
      return await db.collection("basket").updateOne(
        {
          user_id: user._id,
          'items': {
            $elemMatch: {
              product_id: new ObjectId(id),
              size: size,
            }
          },
        },
        {$inc: {'items.$.quantity': 1}}
      );
    } else {
      return await db.collection("basket").updateOne(
        {
          user_id: user._id,
          'items': {
            $elemMatch: {
              product_id: new ObjectId(id),
              size: size,
              quantity: {$gt: 1}
            }
          },
        },
        {$inc: {'items.$.quantity': -1}}
      );
    }
  },

  deleteProductInBasket: async (db, user, productId, size) => {
    await db.collection("basket").updateOne(
      {user_id: user._id},
      {$pull: {"items": {"size": size, "product_id": new ObjectId(productId)}}}
    );
  }
}
module.exports = basketRepository
