const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userRegister = async (req, res) => {
    try {
        const { name, email, password, phone, city } = req.body
        if (!name || !email || !password || !phone || !city) {
            res.status(401).json({
                message: "fill all the required fields"
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(401).json({
                message: "email already registered"
            })
        }
        const passwordHash = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: passwordHash,
            phone,
            city
        })

        res.status(200).json({
            message: "user registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                role : user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json({
                message: 'fill all the required fields'
            })
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "email isn't register"
            })
        }
        if (user.role !== "customer") {
            return res.status(401).json({
                message: "only user can login"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "incorrect password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )


        res.status(200).json({
            message: "login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })


        
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}

module.exports = { userRegister, userLogin }