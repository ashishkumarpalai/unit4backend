const express = require("express")
const { UserModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, mobile, city, pass } = req.body
    try {
        let alldata = await UserModel.find({ email })
        if (alldata.length > 0) {
            res.send({ "msg": "email is already presented in data base" })
        } else {
            bcrypt.hash(pass, 5, async function (err, hash) {
                // Store hash in your password DB.
                if (err) {
                    res.send({ "msg": "something went wrong", "erroe": err.message })
                } else {
                    const user = new UserModel({ name, email, pass: hash, mobile, gender, city })
                    await user.save()
                    res.send({ "msg": "new user has been register" })
                }
            });
        }


    } catch (err) {
        res.send({ "msg": "something went wrong", "erroe": err.message })
    }

})
//===============user login
userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, function (err, result) {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, "masai")
                    res.send({ "msg": "Login successful", "token": token,"user":user })
                } else {
                    res.send({ "msg": "Wrong Creadential" })
                }
            });

        } else {
            res.send({ "msg": "Wrong Creadential" })
        }
    } catch (err) {
        res.send({ "msg": "something went wrong", "erroe": err.message })
    }

})
//======================admin login
userRouter.post("/adminlogin", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.find({ "email":"admin@gmail.com" })
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, function (err, result) {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, "masai")
                    res.send({ "msg": "Login successful", "token": token })
                } else {
                    res.send({ "msg": "Wrong Creadential" })
                }
            });

        } else {
            res.send({ "msg": "Wrong Creadential" })
        }
    } catch (err) {
        res.send({ "msg": "something went wrong", "erroe": err.message })
    }
})
userRouter.get("/", async (req, res) => {
    let query = req.query
    try{
        const products = await UserModel.find(query)
        res.send(products)
    }catch (err){
        res.send({"msg":"something err","error":err})
    }
})
module.exports = {
    userRouter
}