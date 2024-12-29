import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import app from './app.js'
import connectDB from './db/db.js'

const server = http.createServer(app)
const port = process.env.PORT || 5000

connectDB(process.env.MONGO_URI)

server.listen(port, () => console.log(`http://localhost:${port}`))