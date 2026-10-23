const express = require('express')
const { getAllServices, getServiceById } = require('../controllers/services')
const authMiddleware = require('../middleware/auth')
const serviceRouter = express.Router()

serviceRouter.get('/',authMiddleware,getAllServices)
serviceRouter.get('/:id',authMiddleware,getServiceById)

module.exports = serviceRouter