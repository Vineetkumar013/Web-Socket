const express = require('express'); 
const app = express();
const http = require('http').createServer(app);
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    res.json("Connected")
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})

const PORT = 9090;
http.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})