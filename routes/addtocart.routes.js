const express = require("express")
const { AddtocartModel } = require("../model/addtocart.model")
const { authenticate } = require("../middlewares/authenticate.middlewares")
const addtocartRouter = express.Router()
// ====================get thedata
addtocartRouter.get("/", authenticate, async (req, res) => {
    try {
        let cartdata = await AddtocartModel.find({ "user": req.body.user })
        res.send(cartdata)
    } catch (error) {
        res.send(error.message)
        console.log(error.message)
    }

})
// ================================create the cart
addtocartRouter.post("/create", authenticate, async (req, res) => {
    payload = req.body
    try {
        let cartdata = await AddtocartModel.find({ "image": req.body.image })
        if (cartdata.length > 0) {
            res.send({ "msg": "Product is already in cart" })
        } else {
            const cart = new AddtocartModel(payload)
            await cart.save()
            res.send({ "msg": "New Cartdata created" })
            // res.send(cart)
        }
    } catch (err) {
        res.send({ "msg": "Note created", "err": err.message })
    }
})
// ===============delete the data

    addtocartRouter.delete("/delete", authenticate, async (req, res) => {
        const dataFromFrontend = req.body.image
        const cartdata = await AddtocartModel.findOne({ "image": dataFromFrontend })
        const userIdcart = cartdata.user
        const userIdreq = req.body.user
        try {
            if (userIdcart != userIdreq) {
                res.send({ "msg": "You are not authorized" })
            } else {
                await AddtocartModel.deleteOne({ "image": dataFromFrontend, "user": userIdreq })
                const cartdata = await AddtocartModel.find({ "user": req.body.user })
                res.send(cartdata)
                // res.send({"msg":"note delsted"})
            }
        } catch (error) {
            res.send({ "msg": "something went wrong", "error": error.message })
        }
    })
    module.exports = {
        addtocartRouter
    }