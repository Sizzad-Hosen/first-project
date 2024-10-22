import express, { Application, Request, Response } from 'express'
import { StudentRoute } from './modules/student/student.route'

const app: Application = express()

// Middleware to parse JSON request body
app.use(express.json())

// Application routes
app.use('/api/v1/students', StudentRoute)

app.get('/', (req: Request, res: Response) => {
  const a = 10
  res.send(`${a}`) // Send 'a' as a string to avoid issues
})

export default app
