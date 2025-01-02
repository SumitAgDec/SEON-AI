import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import app from './app.js'
import connectDB from './db/db.js'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import projectModal from './models/project.model.js'
import { generateResult } from './services/ai.service.js'

const port = process.env.PORT || 5000
connectDB(process.env.MONGO_URI)


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.use(async (socket, next) => {
    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error("Invalid project ID"));
        }

        socket.project = await projectModal.findById(projectId)

        if (!token) {
            return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error("Authentication error"));
        }

        socket.user = decoded;

        next();
    } catch (error) {
        next(error)
    }
});

io.on('connection', socket => {

    socket.roomId = socket.project._id.toString()

    console.log('a user connected');

    socket.join(socket.roomId);

    socket.on('project-message', async data => {

        const message = data.message

        const aiIsPresentInMessage = message.includes('@ai')

        if (aiIsPresentInMessage) {

            const prompt = message.replace('@ai', '');

            const result = await generateResult(prompt)

            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    user: {
                        _id: 'ai',
                        email: 'AI'
                    }
                }
            })

            return
        }

        socket.broadcast.to(socket.roomId).emit('project-message', data)
    })

    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => {
        console.log("User Disconnected")
        socket.leave(socket.roomId)
    });
});



server.listen(port, () => console.log(`http://localhost:${port}`))