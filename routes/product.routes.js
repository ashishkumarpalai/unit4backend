const express = require("express")
const { ProductModel } = require("../model/product.model")
const { authenticate } = require("../middlewares/authenticate.middlewares")

const productRouter = express.Router()
productRouter.get("/homepage", async (req, res) => {
    const products = await ProductModel.find().limit(20)
    res.send(products)
})
productRouter.get("/",authenticate, async (req, res) => {
    let query = req.query
    try{
        const products = await ProductModel.find(query)
        res.send(products)
    }catch (err){
        res.send({"msg":"something err","error":err})
    }
})
productRouter.get("/adata", async (req, res) => {
    let query = req.query
    try{
        const products = await ProductModel.find(query)
        res.send(products)
    }catch (err){
        res.send({"msg":"something err","error":err})
    }
})
productRouter.post("/createe", async (req, res) => {
    const payload = req.body
    //single product its show user id
    try {
        const note =  new ProductModel(payload)
        await note.save()
        res.send(note)
        // multiple data add but its doesnot show the id
        // const note = await ProductModel.insertMany(payload)
    } catch (error) {
        res.send({ "msg": "Note created" ,"err":error.message})
    }


})
productRouter.get("/:id",authenticate, async (req, res) => {
    let id = req.params.id
    try{
        const products = await ProductModel.find({"_id":id})
        res.send(products)
    }catch (err){
        res.send({"msg":"something err","error":err})
    }
})
productRouter.get("/p",authenticate,async (req,res)=>{
    try{
        let cartdata= await ProductModel.find()
        res.send(cartdata)
    }catch(error){
        res.send(error.message)
        console.log(error.message)
    } 
    
})
//================home page data start============

//=================home page data end=============
// =========search product=======
productRouter.get("/search/:key", async (req, res) => {
    console.log(req.params.key)
    let data = await ProductModel.find({
        "$or": [
            { "category": { $regex: req.params.key } },
            { "model": { $regex: req.params.key } },
            // { "km": { $regex: req.params.key } }
        ]
    })
    res.send(data)
})

//=========product cart================

//===============================sorting start=====
productRouter.get("/lth", authenticate, async (req, res) => {
    let query = req.query
    const products = await ProductModel.find(query).sort({ "price": 1 })
    res.send(products)
})
productRouter.get("/htl", authenticate, async (req, res) => {
    let query = req.query
    const products = await ProductModel.find(query).sort({ "price": -1 })
    res.send(products)
})
//===============================sorting end=========

productRouter.post("/create", authenticate, async (req, res) => {
    const payload = req.body
    //single product its show user id
    try {
        const note =  new ProductModel(payload)
        await note.save()
        res.send(note)
        // multiple data add but its doesnot show the id
        // const note = await ProductModel.insertMany(payload)
    } catch (error) {
        res.send({ "msg": "Note created" ,"err":error.message})
    }


})

productRouter.patch("/update/:id", authenticate, async (req, res) => {
    const id = req.params.id
    const payload = req.body
    const note = await ProductModel.findOne({ "_id": id })
    const userID_in_note = note.user
    const userID_making_req = req.body.user
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized" })
        } else {
            await ProductModel.findByIdAndUpdate({ _id: id }, payload)
            res.send({ "msg": `Note with id${id} has been updated` })
        }

    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong", "error": err.message })
    }
})

productRouter.delete("/:id", authenticate, async (req, res) => {
    const id = req.params.id
    const note = await ProductModel.findOne({ "_id": id })
    const userID_in_note = note.user
    const userID_making_req = req.body.user
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized" })
        } else {
            await NoteModel.findByIdAndDelete({ _id: id })
            res.send({ "msg": `Note with id${id} has been updated` })
        }

    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong", "error": err.message })
    }
})

module.exports = {
    productRouter
}