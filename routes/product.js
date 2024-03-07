const express = require('express')
const zod = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Product = require('../models/product')
const User = require('../models/user')
const { JWT_SECRET } = require('../config')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()

const userValidation = zod.object({
    username: zod.string().email(),
    password: zod.string()
})
router.post('/login', async (req, res) => {
    try {

        const { username, password } = req.body

        const { success } = userValidation.safeParse(req.body)
        if (!success) {
            return res.status(400).json({ message: "Invalid user details" });
        }

        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({ message: "Invalid user details" });
        }
        // const passwordMatch = await bcrypt.compare(password, user.password)
        // if (!passwordMatch) {
        //     return res.status(401).json({ message: "Incorrect password" });
        // }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' })
        res.json({
            message: "Login Successful",
            token
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

})

router.post('/addProduct', authMiddleware, async (req, res) => {
    try {

        const userId = req.userId;
        const product = await Product.create({
            ...req.body,
            createdBy: userId
        })
        res.json({
            message: "product created successfully",
            product
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get('/products', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId

        const products = await Product.find({
            createdBy: userId
        })
        res.json({
            products
        })
    } catch (error) {
        return res.status(404).json({
            message: "unable to find any product"
        })
    }
})

router.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id
        const productById = await Product.findById(productId)
        if (!productById) {
            return res.status(404).json({ message: "Incorrect id" })

        }
        res.json({ productById })
    } catch (error) {
        return res.status(404).json({
            message: "server error"
        })
    }
})

router.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id
        const productById = await Product.findByIdAndDelete(productId)
        if (!productById) {
            return res.status(404).json({ message: "Incorrect id" })
        }
        res.json({ message: "deleted successfully" })
    } catch (error) {
        return res.status(404).json({
            message: "server error"
        })
    }
})

router.put('/products/:id',authMiddleware, async (req, res) => {
    try {
        const productId = req.params.id
        const { name, imageUrl, description, price } = req.body

        const existingProduct = await Product.findById(productId)
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },
            { $set: { name, imageUrl, description, price } },
            { new: true }
        )
        res.json({
            message: "Product updated",
            product: updatedProduct
        })
    } catch (error) {
        return res.status(404).json({
            message: "server error"
        })
    }
})

module.exports = router