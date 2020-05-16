const express = require('express');
const app = express();
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMail(email, subject, text) {
    let msg = {
        to: email,
        from: 'gomgom03@gmail.com',
        subject: subject,
        text: text,
        //html: '',
    };

    sgMail
        .send(msg)
        .then(() => { }, error => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        });
}

const adminPath = "admin.json";
const storePath = "store.json";
const userCreditsPath = "userCredits.json";
const requestsPath = "requests.json";
const purchaseHistoryPath = "purchaseHistory.json";
let admin;
let store = {};
let userCredits = {};
let requests = {};
let purchaseHistory = {};

fs.readFile(adminPath, function (err, data) {
    if (err) throw err;
    admin = JSON.parse(data);
    console.log(admin);
});
writeData(storePath, store)
writeData(userCreditsPath, userCredits);
writeData(requestsPath, requests);
writeData(purchaseHistoryPath, purchaseHistory);

function writeData(path, data) {
    fs.writeFile(path, JSON.stringify(data), () => {
        console.log('Success!')
    })
}



app.use(express.static('public'));
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;

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
        logData('adminRequest', data, socket.id);
        socket.emit('adminResponse', { response: data.id === admin.id && data.password === admin.password });
    })


    socket.on('userRequest', (data) => {
        logData('userRequest', data, socket.id);
        socket.emit('userResponse', { response: userCredits[data.id] != null && data.password === userCredits[data.id].password, credits: userCredits[data.id]!=null? userCredits[data.id].credits:null });
    })
    socket.on('storeRequest', () => {
        socket.emit('storeResponse', store);
    })
    
    socket.on('purchaseHistoryRequest', (data)=>{
        logData('purchaseHistoryRequest', data, socket.id);
        if (data.credentials.id === admin.id && data.credentials.password === admin.password) {
            socket.emit('purchaseHistoryResponse', { response: true, history: purchaseHistory })
        } else {
            socket.emit('purchaseHistoryResponse', { response: false })
        }
    })

    socket.on('adminChangeRequest', (data) => {
        logData('adminChangeRequest', data, socket.id);
        if (data.credentials.id === admin.id && data.credentials.password === admin.password) {
            sendMail(admin.email, "Your admin information has been changed.", `The admin has changed to id: ${data.change.id} and email: ${data.change.email}`);
            admin = data.change;
            writeData(adminPath, admin);
            socket.emit('adminChangeResponse', { response: true })
        } else {
            socket.emit('storeChangeResponse', { response: false })
        }
    })
    socket.on('storeChangeRequest', (data) => {
        logData('storeChangeRequest', data, socket.id);
        if (data.credentials.id === admin.id && data.credentials.password === admin.password && store[`${data.change.item}${data.change.item.amount}`] == null) {
            store[`${data.change.item}${data.change.amount}`] = data.change;
            writeData(storePath, store);
            socket.emit('storeChangeResponse', { response: true })
            socket.emit('storeResponse', store);
        } else {
            socket.emit('storeChangeResponse', { response: false })
        }
    })
    socket.on('userCreditsChangeRequest', (data) => {
        logData('userCreditsChangeRequest', data, socket.id);
        if (data.credentials.id === admin.id && data.credentials.password === admin.password && userCredits[data.change.id] == null&&data.change.id!==""&&data.change.password!=="") {
            userCredits[data.change.id] = data.change;
            writeData(userCreditsPath, userCredits);
            socket.emit('userCreditsChangeResponse', { response: true })
        } else {
            socket.emit('userCreditsChangeResponse', { response: false })
        }
    })
    socket.on('userBuyRequest', (data) => {
        logData('userBuyRequest', data, socket.id);
        let tempCredits = userCredits[data.credentials.id];
        let tempStoreItem = store[data.change.item];
        if (tempCredits != null && data.credentials.password === tempCredits.password) {
            if (tempCredits.credits >= tempStoreItem.amount * data.change.quantity && tempStoreItem.quantity >= data.change.quantity) {
                purchaseHistory[(new Date()).toString()] = {user: data.credentials.id, item: `$${tempStoreItem.amount} ${tempStoreItem.item}`, quantity: data.change.quantity};
                writeData(purchaseHistoryPath,purchaseHistory);
                sendMail(admin.email, `User ${data.credentials.id} Purchase`, `The user [${data.credentials.id}] has purchased ${data.change.quantity} $${tempStoreItem.amount} ${tempStoreItem.item}(s). \n\nThe requesting user's email address is: ${tempCredits.email}`);
                sendMail(tempCredits.email, 'VHACKS Store New Purchase!',`You have requested to purchase ${data.change.quantity} $${tempStoreItem.amount} ${tempStoreItem.item}(s)!\nThe administrator will review your purchase and contact you. \nIf you have any further questions, contact: ${admin.email}`)
                tempStoreItem.quantity -= data.change.quantity;
                tempStoreItem.quantity === 0 ? delete store[data.change.item] : null;
                tempCredits.credits -= tempStoreItem.amount * data.change.quantity;
                writeData(userCreditsPath, userCredits)
                writeData(storePath, store)
                socket.emit('userBuyResponse', { response: true, creditsLeft: tempCredits.credits });
                socket.emit('storeResponse', store);
            } else {
                socket.emit('userBuyResponse', { response: false, err: "Not enough credits or not enough items" });
            }
        } else {
            socket.emit('userBuyResponse', { response: false, err: "User Credentials invalid" });
        }
    })
    socket.on('pageDataRequest', (data) => {
        if (data.credentials.id === admin.id && data.credentials.password === admin.password) {
            sendLoggedData();
            socket.emit('pageDataResponse', { response: true, message: "Sent!" })
        } else {
            socket.emit('pageDataResponse', { response: false, message: "Error." })
        }
    })
    socket.on('adminStoreDeleteRequest', (data)=>{
        if(data.credentials.id === admin.id && data.credentials.password === admin.password && store[data.deletion.item]!=null){
            delete store[data.deletion.item];
            writeData(storePath, store);
            socket.emit('storeResponse', store);
            socket.emit('adminStoreDeleteResponse', {response: true})
        }else{
            socket.emit('adminStoreDeleteResponse', {response: false})
        }
    })
    socket.on('userAccountsRequest', (data)=>{
        if(data.credentials.id === admin.id && data.credentials.password === admin.password){
            socket.emit('userAccountsResponse', {response: true, users: userCredits});
        }else{
            socket.emit('userAccountsResponse', {response: false})
        }
    })
    socket.on('userDeleteRequest', (data)=>{
        if(data.credentials.id === admin.id && data.credentials.password === admin.password && userCredits[data.user.id]!=null){
            delete userCredits[data.user.id];
            writeData(userCreditsPath,userCredits);
            socket.emit('userDeleteResponse', {response: true});
        }else{
            socket.emit('userDeleteResponse', {response: false})
        }
    })
})

function logData(requestType, data, socketID) {
    requests[(new Date()).toString().split(' ').join('')] = { rt: requestType, data: JSON.stringify(data).split('\"').join(""), socket: socketID };
    Object.keys(requests).length > 500 ? (sendLoggedData(),requests = {}) : null;
    writeData(requestsPath, requests);
}

function sendLoggedData() {
    sendMail(admin.email, 'Logged Data Summary', `User Purchase History Blurb: ${JSON.stringify(purchaseHistory)}\n\nFull History Blurb: ${JSON.stringify(requests)}`)
}