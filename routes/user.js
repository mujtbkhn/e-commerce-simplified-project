const express = require('express')
const zod = require('zod')
const User = require('../models/user')
const router = express.Router()

const signUpValidation = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string()
})

router.post('/signup', async (req, res) => {
    const { success } = signUpValidation.safeParse(req.body)
    if (!success) {
        return res.status(411).json({ message: "incorrect user details" })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    })
    if (existingUser) {
        return res.status(404).json({
            message: "email already taken"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName
    })

    res.json({
        message: "user created successfully",
        user
    })
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        return res.status(404).json({
            message: "unable to find any user"
        })
    }
})
router.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "Incorrect id" })

        }
        res.json({ user })
    } catch (error) {
        return res.status(404).json({
            message: "server error"
        })
    }
})

router.put('/update', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    if (!user) {
        return res.status(404).json({
            message: "user not found"
        })
    }

    // Update the user's username and password
    user.username = req.body.newUsername;
    user.password = req.body.newPassword;

    // Save the updated user object
    await user.save();

    res.json({
        message: "updated successfully"
    })

})

router.delete('/delete', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if(!user){
            return res.status(404).json({
                message: "user not found"
            })
        }
        await User.deleteOne({
            _id: user._id
        })
        res.json({
            message: "deleted user successfully"
        })
    } catch (error) {
        return res.status(404).json({
            message: "unable to find any user"
        })
    }
})
module.exports = router