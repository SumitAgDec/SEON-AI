import socket from 'socket.io-client'

let soecketInstance = null

export const initilizeSocket = (projectId) => {
    soecketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: JSON.parse(localStorage.getItem('token'))?.token
        },
        query: {
            projectId
        }
    })

    return soecketInstance
}

export const receiveMessage = (eventName, cb) => {
    soecketInstance.on(eventName, cb)
}

export const sendMessage = (eventName, data) => {
    soecketInstance.emit(eventName, data)
}