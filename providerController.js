const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const providerRegister = async (req, res) => {
    try {
        const { name, email, password, phone, city, address } = req.body
        if (!name || !email || !password || !phone || !city || !address) {
            return res.status(409).json({
                message: "fill all the required fields"
            })
        }
        const existingProvider = await User.findOne({ email })
        if (existingProvider) {
            return res.status(400).json({
                message: "email already registered"
            })
        }
        const passwordHash = await bcrypt.hash(password, 10)

        const provider = await User.create({
            name,
            email,
            password: passwordHash,
            phone,
            city,
            address,
            role: "provider"
        })

        res.status(200).json({
            message: "provider registered successfully",
            user: {
                id: provider._id,
                name: provider.name,
                email: provider.email,
                phone: provider.phone,
                city: provider.city,
                address: provider.address,
                role: provider.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const providerLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json({
                message: 'fill all the required fields'
            })
        }
        const provider = await User.findOne({ email })

        if (!provider) {
            return res.status(401).json({
                message: "email isn't register"
            })
        }
        if (provider.role !== "provider") {
            return res.status(401).json({
                message: "only provider can login"
            })
        }

        const isMatch = await bcrypt.compare(password, provider.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "incorrect password"
            })
        }

        const token = jwt.sign(
            {
                id: provider._id,
                email: provider.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )


        res.status(200).json({
            message: "login successful",
            token,
            provider: {
                id: provider._id,
                name: provider.name,
                email: provider.email,
                role: provider.role
            }
        })



    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}



module.exports = { providerRegister, providerLogin }