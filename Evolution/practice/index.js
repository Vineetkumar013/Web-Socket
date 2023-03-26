const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { dirname } = require("path")
const app = express();
const cors = require("cors")
app.use(cors({ origin: "*" }));
const server = http.createServer(app);
let io = new Server(server, {
    path: "/currency",
    cors: {
        origin : "*",
    }
})

let currencies = [
    { id: 1, name: "bitcoin", price: 1000 },
    { id: 1, name: "dogecoin", price: 100 },
    {id:1,name:"bnb",price:75},
]

let myPortfolio = [];
let refreshTime = 1500

server.listen(8080, () => {
    console.log("server running on 8080");
})  