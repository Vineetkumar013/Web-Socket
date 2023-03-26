const express = require("express")
const {Server} = require("socket.io")
const http = require("http")
const app = express()

const cors = require("cors")
const {dirname} =  require("path")
const server = http.createServer(app)

app.use(
    cors({
        origin : "*"
    })
)

let io = new Server(server,{
    path:"/currency",
    cors:{
        origin : "*"
    }
})

let currencies =[
    {id:1,name:"bitcoin",price:1000},
    {id:2,name:"dogecoin",price:100},
    {id:3,name:"bnb",price:75}
];

let myPortfolio =[]
let refreshTime = 1500
io.on("connection",(socket)=>{
  socket.emit("currency",currencies)
  socket.emit("refreshTime",refreshTime)
  socket.emit("myPortfolio",myPortfolio)

  let intervalId;

  function updatePrice(time){
    intervalId = setInterval(()=>{
        currencies.forEach((el)=>{
            el.price = Math.floor(Math.random()*(el.price+10-(el.price-5))+(el.price-5))
        })
        socket.emit("currency",currencies)
    },time)
  }


  updatePrice(refreshTime)

socket.on("refreshChange",(time)=>{
    console.log(time)
    refreshTime = +time
    clearInterval(intervalId)
    updatePrice(refreshTime)
})

socket.on("buyCurrency",(item)=>{
    myPortfolio.push(item)
    socket.emit("myPortfolio",myPortfolio)
})


  
})
server.listen(8000,()=>{
    console.log("server is running on 8000")
})