const productRepository = require("../repositories/productRepository")


const productsController = {

  getAll: async (req: Request, res: Response) => {
    try {
      const products = await productRepository.getAll(req.db, req.query);
      res.json(products)
    } catch (error) {
      throw new Error(error.message)
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await productRepository.getProductById(req.db, productId)
      res.json(result)

    } catch (error) {
      return new Error(error.message)
    }
  },
  updateProducts: async (req: Request, res: Response) => {
    try {
      const products = req.body
      const user = req.user
      const arrPromise = products.map(product => {
        return new Promise(async (resolve, reject) => {
          const result = await productRepository.checkCountProduct(req.db, product)
          if (result) {
            resolve(result);
          } else {
            reject("error in sever");
          }
        })
      })

      const result = await Promise.all(arrPromise)
      const InfoProduct = []
      result.forEach((origProduct, index) => {
        const basketProduct = products[index]
        if(origProduct.size[basketProduct.size] >= basketProduct.count){
          console.log("success")
        }else{
          console.log("error", origProduct)
          InfoProduct.push({
            _id: origProduct._id,
            size: origProduct.size[basketProduct.size]
          })
        }
      })
      console.log("INFOERROR", InfoProduct)
      if(InfoProduct.length === 0){
        res.status(200).json({message: "all okey"})
      }
      res.json(InfoProduct)
      // console.log(result, products)

    } catch (error) {
      return new Error(error.message)
    }
  }
}
module.exports = productsController
