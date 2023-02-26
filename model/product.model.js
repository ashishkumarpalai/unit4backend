const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    image:String,
    price:Number,
    km:String,
    model:String,
    adress:String,
    verified:String,
    category:String,
    user:String
})

const ProductModel=mongoose.model("product",productSchema)

module.exports={
    ProductModel
}