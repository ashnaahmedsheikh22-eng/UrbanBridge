const express = require('express')
const { providerRegister, providerLogin } = require('../controllers/providerController')
const { providerProfile, createService, updateServices } = require('../controllers/providerProfile')
const authMiddleware = require('../middleware/auth')
const providerRouter = express.Router()

//signup/login
providerRouter.post('/provider/register',providerRegister)
providerRouter.post('/provider/login',providerLogin)

//profile 
providerRouter.post('/create-profile',authMiddleware,providerProfile)
providerRouter.post('/service/create',authMiddleware,createService)


//update
providerRouter.put('/:id',authMiddleware,updateServices)


module.exports = providerRouter