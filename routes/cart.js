const express = require('express')
const Cart = require('../models/cart')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId
        const productId = req.body.productId

        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            cart = new Cart({ user: userId, items: [] })
        }

        const existingItems = cart.items.find(item => item.product.toString() === productId)

        if (existingItems) {
            existingItems.quantity++
        } else {
            cart.items.push({ product: productId, quantity: 1 })
        }

        await cart.save()
        res.json({
            message: "product added successfully"
            , cart
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get('/cart', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId
        const cart = await Cart.find({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "no cart found for this user" })
        }
        res.json({
            cart
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
router.delete('/cart/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const productId = req.params.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "No cart found for this user" });
        }
        const existingItems = cart.items.find(item => item.product.toString() === productId)

        if (existingItems) {
            existingItems.quantity--
        } else {


            const updatedItems = cart.items.filter(item => item.product.toString() !== productId);
            cart.items = updatedItems;
        }

        await cart.save();

        res.json({
            message: "Product removed from cart successfully",
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router