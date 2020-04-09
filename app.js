const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
const port=  3000;

const server = app.listen(server, ()=>{
    console.log(`listening to port ${port}`);
})

app.get('/',(req,res)=>{
    res.render('home.ejs')
})


const io = require('socket.io')(server);

io.on('connection', (socket)=>{
    console.log(`Established connection with socket ${socket.id}`);
})
