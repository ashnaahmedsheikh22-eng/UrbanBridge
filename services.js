const Service = require('../models/service')


const getAllServices = async (req,res)=>{
    try {
        const services = await Service.find({
            isAvailable : true
        }).populate('provider','name phone city')
        return res.status(200).json({
            message : "services fetched successfully",
            count : services.length,
            services
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}

const getServiceById = async (req,res)=>{
    try {

        const { id } = req.params;
        const service = await Service.findById(id).populate('provider','name phone city')
        if(!service){
            return res.status(404).json({
                message : "service not found"
            })
        }
        return res.status(200).json({
            message : "service fetched successfully",
            service
        })
    } catch (error) {
        if(error.name === 'CastError'){
            return res.status(400).json({
                message : "invalid service id"
            })
        }

        return res.status(500).json({
            message : error.message
        })
    }
}

module.exports = {getAllServices,getServiceById}