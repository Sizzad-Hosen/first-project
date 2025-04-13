import express, { Application, Request, Response } from 'express'

import globalErrorHandler from './app/middlewares/globalErrorhandler'
import cors from "cors"; 
import router from './app/routes'
import notFound from './app/middlewares/notFound'
import { StudentRoutes } from './modules/student/student.route'
import cookieParser from 'cookie-parser';

const app: Application = express()

// Middleware to parse JSON request body
app.use(cookieParser())
app.use(cors({origin:'http://localhost:5000'}))
app.use(express.json())

// Application routes
// app.use('/api/v1/students', StudentRoute)

app.use('/api/v1', router)

app.use(globalErrorHandler)
app.use(notFound)

export default app
