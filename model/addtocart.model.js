const mongoose=require("mongoose")

const addtocartSchema=mongoose.Schema({
    image:String,
    price:Number,
    km:String,
    model:String,
    adress:String,
    verified:String,
    category:String,
    user:String
})

const AddtocartModel=mongoose.model("addtocart",addtocartSchema)

module.exports={
    AddtocartModel
}