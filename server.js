const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRoutes')
const providerRouter = require('./routes/providerRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const serviceRouter = require('./routes/servicesRoutes')

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())

//PORT
app.use('/api/auth',userRouter)
app.use('/provider',providerRouter)
app.use('/booking',bookingRouter)
app.use('/customer',serviceRouter)

dotenv.config()
app.use(cors())

app.get('/',(req,res)=>{
    res.send('server is running')
})

mongoose.connect('mongodb://localhost:27017/localfinder')
.then(()=>{
    console.log('mongodb connected')
})
.catch((err)=>{
    console.log(err)
})


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})