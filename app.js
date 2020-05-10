const express = require('express');
const app = express();
const fs = require('fs');
//const nodemailer = require('nodemailer')
//const sgTransport = require('nodemailer-sendgrid-transport')

const adminPath = "admin.json";
const storePath = "store.json";
const userCreditsPath = "userCredits.json";
let admin;
let store;
let userCredits;

fs.readFile(adminPath, function (err, data) {
    if (err) throw err;
    admin = JSON.parse(data);
    console.log(admin);
});
fs.readFile(storePath, function (err, data) {
    if (err) throw err;
    store = JSON.parse(data);
    console.log(store);
});
fs.readFile(userCreditsPath, function (err, data) {
    if (err) throw err;
    userCredits = JSON.parse(data);
    console.log(store);
});

function writeData(path, data) {
    fs.writeFile(path, JSON.stringify(data), () => {
        console.log('Success!')
    })
}



app.use(express.static('public'));
app.set('view engine', 'ejs');
const port = 3000;

const server = app.listen(port, () => {
    console.log(`listening to port ${port}`);
})

app.get('/', (req, res) => {
    res.render('home.ejs')
})


const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(`Established connection with socket ${socket.id}`);
    socket.on('adminRequest', (data) => {
        socket.emit('adminResponse', { response: data.id === admin.id && data.password === admin.password });
    })
    socket.on('userRequest', (data) => {
        socket.emit('userResponse', { response: userCredits[data.id]!=null && data.password === userCredits[data.id].password , credits: userCredits[data.id].credits});
    })
    socket.on('storeRequest', () => {
        socket.emit('storeResponse', store);
    })
    socket.on('userCreditsRequest', () => {
        socket.emit('userCreditsResponse', userCredits);
    })
    socket.on('adminChangeRequest', (data) => {
        if (data.credentials.id === admin.id && data.credentials.password === admin.password) {
            admin = data.change;
            writeData(adminPath, admin);
            socket.emit('adminChangeResponse', { response: true })
        } else {
            socket.emit('storeChangeResponse', { response: false })
        }
    })
    socket.on('storeChangeRequest', (data) => {
        if (data.credentials.id === admin.id && data.credentials.password === admin.password && store[`${data.change.item}${data.change.item.amount}`] == null) {
            store[`${data.change.item}${data.change.item.amount}`] = data.change;
            writeData(storePath, store);
            socket.emit('storeChangeResponse', { response: true })
            socket.emit('storeResponse', store);
        } else {
            socket.emit('storeChangeResponse', { response: false })
        }
    })
    socket.on('userCreditsChangeRequest', (data) => {
        if (data.credentials.id === admin.id && data.credentials.password === admin.password && userCredits[data.change.id] == null) {
            userCredits[data.change.id] = data.change;
            writeData(userCreditsPath, userCredits);
            socket.emit('userCreditsChangeResponse', { response: true })
        } else {
            socket.emit('userCreditsChangeResponse', { response: false })
        }
    })
})

