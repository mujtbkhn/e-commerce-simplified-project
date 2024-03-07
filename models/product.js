const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/codepth_assignment')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 100
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        maxLength: 500
    },
    price: {
        type: Number,
        required: true,
        minLength: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:  true
    }
})

const Product = mongoose.model('Product', ProductSchema)
module.exports = Product