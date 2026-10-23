const ProviderProfile = require('../models/profile')
const Service = require('../models/service')
const User = require('../models/user')

const providerProfile = async (req, res) => {
    try {
        const { skills, experience, charges, description, isAvailable } = req.body
        if (!Array.isArray(skills) || skills.length == 0 || experience == null || charges == null) {
            return res.status(409).json({
                message: "fill all the reauired fields"
            })
        }
        const userId = req.user.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (user.role !== "provider") {
            return res.status(400).json({
                message: "only providers can create profile"
            })
        }

        const existingProfile = await ProviderProfile.findOne({
            user: userId
        })
        if (existingProfile) {
            return res.status(409).json({
                message: "provider profile already exists"
            })
        }

        const profile = await ProviderProfile.create({
            user: userId,
            skills,
            experience,
            charges,
            description
        })

        return res.status(201).json({
            message: "profile created successfully",
            profile
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const createService = async (req, res) => {
    try {
        const { title, category, description, charges, city, isAvailable } = req.body
        if (!title?.trim() || !category || !description?.trim() || charges == null || !city) {
            return res.status(409).json({
                message: "fill all the required fields"
            })
        }
        if (!Number.isFinite(Number(charges)) || Number(charges) < 0) {
            return res.status(400).json({
                message: "charges must be a valid non negative number"
            })
        }
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        if (user.role !== "provider") {
            return res.status(400).json({
                message: "only provider can create srevices"
            })
        }

        const providerProfile = await ProviderProfile.findOne({
            user: req.user.id
        })

        if (!providerProfile) {
            return res.status(400).json({
                message: "first create provider profile"
            })
        }

        const service = await Service.create({
            provider: user._id,
            title: title.trim(),
            category,
            description: description.trim(),
            charges: Number(charges),
            city: city.trim(),
            isAvailable: isAvailable ?? true
        })

        return res.status(200).json({
            message: "service created successfully",
            service
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const updateServices = async(req,res)=>{
    try {
        const {id} = req.params
        const{title,category,description,charges,city,isAvailable} = req.body
        const service = await Service.findById(id)
        if(!service){
            return res.status(404).json({
                message : "service not found"
            })
        }
        if(service.provider.toString() !== req.user.id){
            return res.status(400).json({
                message : "you are not allowed to update this service"
            })
        }

        if(title !== 'undefined'){
            if(typeof title !== 'string'||!title.trim()){
                return res.status(400).json({
                    message : "tile cannot be empty"
                })
            }
            service.title === title.trim()
        }

        if(category !== 'undefined'){
            if(typeof category !== 'string'||!category.trim()){
                return res.status(400).json({
                    message : "category cannot be empty"
                })
            }
            service.category = category.trim()
        }

        if(description !=='undefined'){
            if(typeof description !== 'string'||!description.trim()){
                return res.status(400).json({
                    message : "description cannot be empty"
                })
            }
            service.description = description.trim()
        }

        if(charges !== 'undefined'){
            if(charges === ''||Number.isFinite(Number(charges))||Number(charges)<0){
                return res.status(400).json({
                    message : "charges cannot be empty"
                })
            }
            service.charges = Number(charges)
        }
        if(city !== 'undefined'){
            if(typeof city !== 'string'||!city.trim()){
                return res.status(400).json({
                    message : 'city cannot be empty'
                })
            }
            service.city = city.trim()
        }

        if(isAvailable !== 'undefined'){
            if(typeof isAvailable !== 'boolean'){
                return res.status(400).json({
                    message : "is available must be true or false"
                })
            }
            service.isAvailable = isAvailable
        }
        await service.save()
        return res.status(200).json({
            message : "service updated successfully",
            service
        })

    } catch (error) {
        if(error.name === 'CastError'){
            return res.status(400).json({
                message : "invaid service id"
            })
        }
        return res.status(500).json({
            message : error.message
        })
    }
}

module.exports = { providerProfile, createService ,updateServices}