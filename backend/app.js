import express from 'express'
import morgan from 'morgan'
import userRoute from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/api/users', userRoute)

export default app;