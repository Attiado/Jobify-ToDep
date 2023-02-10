import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import cors from 'cors'
const app = express()
dotenv.config()

//Db and authenticateUser
import connectDB from './db/connect.js';
import 'express-async-errors'
//Routers
import authRouter from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'

//Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js'

//Cookie Parser
import cookieParser from 'cookie-parser'

if (process.env.NODE_ENV !== 'production') {
    app.use (morgan ('dev'))
}
app.use(express.json())

app.get('/api/v1', (req, res) => {
    // throw new Error('error !')
    res.json({msg:'API'});
})

app.use('/api/v1/auth' , authRouter)
app.use('/api/v1/jobs'  , jobRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.use(cookieParser());
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('Server is running .. ')
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        console.log('Mongo DB is connected .. ')

    } catch (error) {
        console.log("Error in connection ..")
    }
}

start()