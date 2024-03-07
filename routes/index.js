const express = require('express')
const authRoute = require('./auth')
const userRoute = require('./user')
const productRoute = require('./product')
const cartRoute = require('./cart')
const orderRoute = require('./order')


const router = express.Router()
router.use('/user', userRoute)
router.use('/auth', authRoute)
router.use('/product', productRoute)
router.use('/cart', cartRoute)
router.use('/order', orderRoute)

module.exports = router