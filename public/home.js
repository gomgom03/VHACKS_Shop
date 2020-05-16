//(() => {
window.onbeforeunload = () => true;
const socket = io.connect();
let store;
socket.emit('storeRequest')
socket.on('storeResponse', (data) => {
    store = data;
    elements.webstore = store;
    currentPage === "webstore" ? webstore() : null;
})
const container = document.querySelector('#container');
const goBackButton = document.querySelector('#goBack')
const errorMessage = document.querySelector('#errorMessage');
const successMessage = document.querySelector('#successMessage');

function showMessage(type, message) {
    if (type) {
        successMessage.textContent = message;
        successMessage.style.zIndex = "1";
        successMessage.style.opacity = "0.8";
        setTimeout(() => { successMessage.style.opacity = "0"; }, 2000)
        setTimeout(() => { successMessage.style.zIndex = "-1" }, 3000)
    } else {
        errorMessage.textContent = message;
        errorMessage.style.zIndex = "1";
        errorMessage.style.opacity = "0.8";
        setTimeout(() => { errorMessage.style.opacity = "0" }, 2000)
        setTimeout(() => { errorMessage.style.zIndex = "-1" }, 3000)
    }
}

const queryColor = "#2161c4";
let sizeReference = window.innerWidth * window.innerHeight;
function resize() {
    sizeReference = window.innerWidth * window.innerHeight;
    goBackButton.style.width = `${window.innerWidth}px`;
    goBackButton.style.height = `${window.innerHeight * 0.14}px`;
    for (let i = 0; i < document.getElementsByTagName('head')[0].children.length; i++) {
        document.getElementsByTagName('head')[0].children[i].tagName === "STYLE" ? document.getElementsByTagName('head')[0].removeChild(document.getElementsByTagName('head')[0].children[i]) : null;
    }
    addCSS();
}
resize();
window.addEventListener('resize', resize);
function addCSS() {

    let css =
        `
    body{
        margin:0
    }
    .message{
        height: ${window.innerHeight * 0.1}px;
        font-size: ${sizeReference * 0.00002}px;
        line-height: ${window.innerHeight * 0.1}px;
    }
    .allButtons{
        color: ${queryColor};
        border-style:solid;
        background-color:white;
        border-color:transparent;
        margin:0;
    }
    .allButtons:hover{
        border-color:${queryColor};
    }
    .submitButton{
        margin:1%;
        border-radius:5px;
        width: 10%;
        height: ${window.innerHeight * 0.1}px;
        font-size: ${sizeReference * 0.00002}px;
        border-color:transparent;
    }
    .firstChooseButton{
        margin:2%;
        border-radius:10px;
        width: 40%;
        height: ${window.innerHeight * 0.3}px;
        font-size: ${sizeReference * 0.0001}px;
    }
    .query{
        background-color: ${queryColor};
        font-size: 200%;
    }
    .inputFields{
        box-sizing: border-box;
        border: 3px solid #ccc;
        -webkit-transition: 0.5s;
        transition: 0.5s;
        outline: none;
        margin:1%;
        width: 20%;
        height: ${window.innerHeight * 0.1}px;
        font-size: ${sizeReference * 0.00002}px;
    }
    .inputFields:focus{
        border:3px solid #a1ffba;
    }
    .adminChooseButton{
        margin:1%;
        border-radius:4px;
        width: 13%;
        height: ${window.innerHeight * 0.1}px;
        font-size: ${sizeReference * 0.000015}px;
        border-color:transparent;
    }
    .storeInput{
        width: 40%;
        box-sizing: border-box;
        border: 3px solid #ccc;
        -webkit-transition: 0.5s;
        transition: 0.5s;
        outline: none;
        height: 24%;
        font-size: ${sizeReference * 0.00002}px;
    }
    .storeInput:focus{
        border:3px solid #a1ffba;
    }
    .storeSubmit{
        margin:1%;
        border-radius:3px;
        width: 40%;
        height: 24%;
        font-size: ${sizeReference * 0.00002}px;
        border-color:transparent;
    }
    .itemElem{
        margin: 1%;
        width: 30%;
        height: ${window.innerHeight * 0.26}px;
        border-radius:6px;
        background-color:#99c1ff;
    }
    .itemDesc{
        border-bottom: ${window.innerHeight * 0.007}px solid #cccccc;
        font-size: ${sizeReference * 0.00002}px;
        text-align:center;
        background-color: ${queryColor};
        margin:0;
        height: ${window.innerHeight * 0.07}px;
        line-height: ${window.innerHeight * 0.07}px;
    }
    .itemInfo{
        margin:0;
        border-bottom: ${window.innerHeight * 0.007}px solid #cccccc;
        font-size: ${sizeReference * 0.000014}px;
        text-align:center;
        background-color: #619fff;
        height: ${window.innerHeight * 0.04}px;
        line-height: ${window.innerHeight * 0.04}px;
    }
    .unordListItem{
        margin-top:${window.innerHeight * 0.01}px;
        background-color: #7db0ff;
        font-size: ${sizeReference * 0.00002}px;
        height: ${window.innerHeight*0.08}px;
        line-height: ${window.innerHeight*0.08}px;
    }
    .deleteItemButton{
        color:red;
        font-size: ${sizeReference * 0.00002}px;
        margin-left: ${window.innerWidth * 0.01}px;
        width: ${window.innerWidth * 0.05}px;
        height: ${window.innerHeight*0.05}px;
        border-color:white;
        background-color:white;
    }
    .deleteItemButton:hover{
        background-color:red;
        color:white;
        border-color:red;
    }
    `;
    let style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}
//For website
const elements = {
    startApp: {
        chooseQuery: {
            type: "div",
            text: "Choose User",
            options: {
                class: 'query'
            }
        },
        userButton: {
            type: "button",
            text: "User",
            options: {
                class: 'firstChooseButton allButtons'
            }
        },
        adminButton: {
            type: "button",
            text: "Admin",
            options: {
                class: 'firstChooseButton allButtons'
            }
        }
    },
    adminLogin: {
        info: {
            type: "div",
            text: "Admin Login",
            options: {
                class: "query"
            }
        },
        id: {
            type: "input",
            options: {
                placeholder: "ID",
                class: "inputFields"
            }
        },
        password: {
            type: "input",
            options: {
                placeholder: "Password",
                type: "password",
                class: "inputFields"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            options: {
                class: "submitButton allButtons"
            }
        }
    },
    adminAction: {
        chooseQuery: {
            type: "div",
            text: "Choose Action",
            options: {
                class: 'query'
            }
        },
        adminChangeButton: {
            type: "button",
            text: "Change Admin",
            options: {
                class: 'adminChooseButton allButtons'
            }
        },
        addItemButton: {
            type: "button",
            text: "Add Items",
            options: {
                class: 'adminChooseButton allButtons'
            }
        },
        addUserCreditsButton: {
            type: "button",
            text: "Add User Credit",
            options: {
                class: 'adminChooseButton allButtons'
            }
        },
        adminWebstore: {
            type: "button",
            text: "Webstore - Admin",
            options: {
                class: 'adminChooseButton allButtons'
            }
        },
        sendPageData: {
            type: "button",
            text: "Send page data",
            options: {
                class: 'adminChooseButton allButtons'
            }
        },
        purchaseHistory: {
            type: "button",
            text: "Purchase History",
            options: {
                class: 'adminChooseButton allButtons'
            }
        },
    },
    adminAddItems: {
        info: {
            type: "div",
            text: "Add Store Items",
            options: {
                class: 'query'

            }
        },
        item: {
            type: "input",
            options: {
                placeholder: "Store Item",
                class: "inputFields"
            }
        },
        amount: {
            type: "input",
            options: {
                type: "number",
                placeholder: "Dollar Amount",
                class: "inputFields"
            }
        },
        quantity: {
            type: "input",
            options: {
                type: "number",
                placeholder: "Quantity",
                class: "inputFields"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            options: {
                class: "submitButton allButtons"
            }
        }

    },
    changeAdmin: {
        info: {
            type: "div",
            text: "Change Admin",
            options: {
                class: "query"
            }
        },
        id: {
            type: "input",
            options: {
                placeholder: "ID",
                class: "inputFields"
            }
        },
        password: {
            type: "input",
            options: {
                placeholder: "Password",
                type: "password",
                class: "inputFields"
            }
        },
        email: {
            type: "input",
            options: {
                placeholder: "Email",
                class: "inputFields"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            options: {
                class: "submitButton allButtons"
            }
        }
    },
    adminAddCredits: {
        info: {
            type: "div",
            text: "Add Credits",
            options: {
                class: "query"
            }
        },
        id: {
            type: "input",
            options: {
                placeholder: "User ID",
                class: "inputFields"
            }
        },
        password: {
            type: "input",
            options: {
                placeholder: "User Password",
                type: "password",
                class: "inputFields"
            }
        },
        credits: {
            type: "input",
            options: {
                type: "number",
                placeholder: "User Credits",
                class: "inputFields"
            }
        },
        email: {
            type: "input",
            options: {
                type: "text",
                placeholder: "User Email",
                class: "inputFields"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            options: {
                class: "submitButton allButtons"
            }
        },
        userList: {
            type: "ul",
            options: {
                class: "unordList"
            }
        }
    },
    purchaseHistory: {
        info: {
            type: "div",
            text: "Add Credits",
            options: {
                class: "query"
            }
        },
        list: {
            type: "ul",
            options: {
                class: "unordList"
            }
        },
    },
    userLogin: {
        info: {
            type: "div",
            text: "User Login",
            options: {
                class: "query"
            }
        },
        id: {
            type: "input",
            options: {
                placeholder: "ID",
                class: "inputFields"
            }
        },
        password: {
            type: "input",
            options: {
                placeholder: "Password",
                type: "password",
                class: "inputFields"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            options: {
                class: "submitButton allButtons"
            }
        }
    }
}

let currentPage = null;
goBackButton.addEventListener('click', () => {
    switch (currentPage) {
        case "adminLogin": startApp(); break;
        case "adminAction": startApp(); break;
        case "adminAddItems": adminAction(); break;
        case "changeAdmin": adminAction(); break;
        case "adminAddCredits": adminAction(); break;
        case "webstore": startApp(); break;
        case "adminWebstore": adminAction(); break;
        case "userLogin": startApp(); break;
        case "purchaseHistory": adminAction(); break;
        default: startApp();
    }
})


let adminLoggedIn = false;
let adminSaved = {
    id: null,
    password: null
}

function clearContainer() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function createElement(type, id, parent, text) {
    let temp = document.createElement(type);
    temp.id = id
    temp.textContent = text;
    parent.appendChild(temp);
    return temp;
}

function createElements(page) {
    for (let subElement in elements[page]) {
        let curObj = elements[page][subElement];
        curObj.elem = createElement(curObj.type, subElement, curObj.parent || container, curObj.text || "");
        for (let option in curObj["options"]) {
            switch (option) {
                case "class": curObj.elem.className = curObj["options"][option]; break;
                default: curObj.elem[option] = curObj["options"][option];
            }
        }
    }
    return elements[page];
}

function startApp() {
    currentPage = "startApp";
    clearContainer();
    let tempObj = createElements("startApp");
    tempObj.userButton.elem.addEventListener("click", userLogin);
    tempObj.adminButton.elem.addEventListener("click", () => { adminLogin() });
}

function adminLogin() {
    currentPage = "adminLogin";
    if (adminLoggedIn) {
        adminAction();
    } else {
        clearContainer();
        let tempObj = createElements("adminLogin");
        tempObj.submitButton.elem.addEventListener("click", () => {
            socket.emit('adminRequest', { id: tempObj.id.elem.value, password: tempObj.password.elem.value });
            adminSaved.id = tempObj.id.elem.value;
            adminSaved.password = tempObj.password.elem.value;
        })
        socket.off('adminResponse');
        socket.on('adminResponse', (data) => {
            data.response === true ? (userLoggedIn = false, adminLoggedIn = true, showMessage(true, "Success!"), adminAction()) : (tempObj.id.elem.value = "", tempObj.password.elem.value = "", adminLoggedIn = false, showMessage(false, 'Incorrect'));
        })
    }
}

function adminAction() {
    currentPage = "adminAction";
    if (adminLoggedIn) {
        clearContainer();
        let tempObj = createElements("adminAction");
        tempObj.adminChangeButton.elem.addEventListener("click", changeAdmin);
        tempObj.addItemButton.elem.addEventListener("click", adminAddItems);
        tempObj.addUserCreditsButton.elem.addEventListener("click", adminAddCredits);
        tempObj.adminWebstore.elem.addEventListener("click", adminWebstore);
        tempObj.sendPageData.elem.addEventListener("click", () => { socket.emit('pageDataRequest', { credentials: adminSaved }) });
        tempObj.purchaseHistory.elem.addEventListener("click", purchaseHistory);
    } else {
        adminLogin();
    }
}
socket.on('pageDataResponse', (data) => { showMessage(data.response, data.message) })

function adminAddItems() {
    currentPage = "adminAddItems";
    if (adminLoggedIn) {
        clearContainer();
        let tempObj = createElements("adminAddItems");
        tempObj.submitButton.elem.addEventListener("click", () => {
            socket.emit('storeChangeRequest', { credentials: adminSaved, change: { item: tempObj.item.elem.value, amount: tempObj.amount.elem.value, quantity: tempObj.quantity.elem.value } })
        })
        socket.off('storeChangeResponse');
        socket.on('storeChangeResponse', (data) => {
            data.response === true ? showMessage(true, 'Success') : showMessage(false, 'Failure');
        })
    } else {
        adminLogin();
    }
}

function changeAdmin() {
    currentPage = "changeAdmin";
    if (adminLoggedIn) {
        clearContainer();
        let tempObj = createElements("changeAdmin");
        tempObj.submitButton.elem.addEventListener('click', () => {
            socket.emit('adminChangeRequest', { credentials: adminSaved, change: { id: tempObj.id.elem.value, password: tempObj.password.elem.value, email: tempObj.email.elem.value, } })
        });
        socket.off('adminChangeResponse');
        socket.on('adminChangeResponse', (data) => {
            data.response === true ? (adminLoggedIn = false, showMessage(true, "Success"), adminLogin()) : showMessage(false, 'Failure');
        })
    } else {
        adminLogin();
    }
}

function adminAddCredits() {
    currentPage = "adminAddCredits";
    if (adminLoggedIn) {
        clearContainer();
        let tempObj = createElements("adminAddCredits");
        socket.emit('userAccountsRequest', { credentials: adminSaved });
        socket.off('userAccountsResponse');
        socket.on('userAccountsResponse', (data) => {
            data.response ? (() => {
                for (let key in data.users) {
                    let current = data.users[key];
                    let tempLi = document.createElement('li');
                    tempLi.textContent = `User: ${current.id}, Password: ${current.password}, Credits: ${current.credits}`;
                    tempLi.className = "unordListItem";
                    let deleteButton = document.createElement('button');
                    deleteButton.textContent = 'X';
                    deleteButton.className = "allButtons deleteItemButton";
                    tempLi.appendChild(deleteButton);
                    tempObj.userList.elem.appendChild(tempLi);
                    deleteButton.addEventListener('click',()=>{
                        confirm("Are you sure you want to delete this user?") ? (socket.emit('userDeleteRequest', { credentials: adminSaved, user: { id: current.id } })) : (showMessage(false, 'Request Canceled'));
                    })
                }
            })() : showMessage(false, 'Failed to get users.');
        })
        tempObj.submitButton.elem.addEventListener('click', () => {
            let creditValue = parseInt(tempObj.credits.elem.value);
            creditValue === Math.round(creditValue) && creditValue > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempObj.email.elem.value) ? socket.emit('userCreditsChangeRequest', { credentials: adminSaved, change: { id: tempObj.id.elem.value, password: tempObj.password.elem.value, credits: tempObj.credits.elem.value, email: tempObj.email.elem.value } }) : showMessage(false, 'Should have a integer greater than 0, and a valid email');
        });
        socket.off('userCreditsChangeResponse');
        socket.on('userCreditsChangeResponse', (data) => {
            data.response === true ? (showMessage(true, 'Success'),adminAddCredits()) : showMessage(false, 'Failure');
        })
    } else {
        adminLogin();
    }
}
socket.on('userDeleteResponse', (data) => {
    data.response === true ? (showMessage(true, 'Success'), adminAddCredits()) : showMessage(false, 'Failure');
})

function purchaseHistory() {
    currentPage = "purchaseHistory";
    if (adminLoggedIn) {
        clearContainer();
        let tempObj = createElements("purchaseHistory");
        socket.emit('purchaseHistoryRequest', { credentials: adminSaved });
        socket.off('purchaseHistoryResponse');
        socket.on('purchaseHistoryResponse', (data) => {
            data.response === true ? (
                (() => {
                    for (let curHis in data.history) {
                        let temp = data.history[curHis]
                        let tempLi = document.createElement('li');
                        tempLi.textContent = `user: ${temp.user}, item: ${temp.item}, quantity: ${temp.quantity}, time: ${curHis}`;
                        tempLi.className = "unordListItem";
                        tempObj.list.elem.appendChild(tempLi);
                    }
                })()
            ) : showMessage(false, 'Failure');
        })
    } else {
        adminLogin();
    }
}

let userLoggedIn = false;
let userSaved = {
    id: null,
    password: null
}
function userLogin() {
    currentPage = "userLogin";
    if (userLoggedIn) {
        webstore();
    } else {
        clearContainer();
        let tempObj = createElements("userLogin");
        tempObj.submitButton.elem.addEventListener("click", () => {
            socket.emit('userRequest', { id: tempObj.id.elem.value, password: tempObj.password.elem.value });
            userSaved.id = tempObj.id.elem.value;
            userSaved.password = tempObj.password.elem.value;
        })
        socket.off('userResponse');
        socket.on('userResponse', (data) => {
            data.response === true ? (adminLoggedIn = false, userLoggedIn = true, webstore(), showMessage(true, `You have ${data.credits} credits`)) : (tempObj.id.elem.value = "", tempObj.password.elem.value = "", userLoggedIn = false, showMessage(false, 'Incorrect'));
        })
    }
}

function webstore() {
    currentPage = "webstore";
    if (userLoggedIn) {
        clearContainer();
        createStore();
    } else {
        userLogin();
    }
}

function adminWebstore() {
    currentPage = "adminWebstore";
    if (adminLoggedIn) {
        clearContainer();
        createStore();
    } else {
        adminLogin();
    }

}

function createStore() {
    let keys = Object.keys(store);
    for (let i = 0; i < keys.length / 3; i++) {
        let tempContainer = document.createElement("div");
        tempContainer.classList.add("storeContainer");
        for (let j = 0; j < 3; j++) {
            if (store[keys[i * 3 + j]] != null) {
                let curKey = store[keys[i * 3 + j]];
                let tempDiv = document.createElement("div");
                tempDiv.classList.add("itemElem");
                let tempPI = document.createElement("p");
                tempPI.classList.add("itemDesc");
                tempPI.textContent = curKey.item;
                let tempPW = document.createElement("p");
                tempPW.classList.add("itemInfo");
                tempPW.textContent = `Worth: $${curKey.amount}`;
                let tempPQ = document.createElement("p");
                tempPQ.classList.add("itemInfo");
                tempPQ.textContent = `Quantity Remaining: ${curKey.quantity}`;
                let tempInput = document.createElement("input");
                tempInput.classList.add("itemInput");
                tempInput.type = "number"
                tempInput.className = "storeInput"
                let submitButton = document.createElement("button");
                userLoggedIn ? submitButton.textContent = "Submit" : submitButton.textContent = "Delete Item"
                submitButton.className = "allButtons storeSubmit"
                tempDiv.appendChild(tempPI);
                tempDiv.appendChild(tempPW);
                tempDiv.appendChild(tempPQ);
                tempDiv.appendChild(tempInput);
                tempDiv.appendChild(submitButton);
                tempContainer.appendChild(tempDiv);
                submitButton.addEventListener("click", () => {
                    if (userLoggedIn) {
                        let curValue = parseInt(tempInput.value);
                        curValue > 0 && curValue === Math.round(curValue) ? socket.emit('userBuyRequest', { credentials: userSaved, change: { item: keys[i * 3 + j], quantity: curValue } }) : showMessage(false, 'Input an integer greater than 0');
                    } else if (adminLoggedIn) {
                        confirm("Are you sure you want to delete this item?") ? (socket.emit('adminStoreDeleteRequest', { credentials: adminSaved, deletion: { item: `${curKey.item}${curKey.amount}` } })) : (showMessage(false, 'Request Canceled'));
                        socket.off('adminStoreDeleteResponse');
                        socket.on('adminStoreDeleteResponse', (data) => {
                            data.response ? (showMessage(true, 'Item deleted.'),adminWebstore()) : showMessage(false, 'Something went wrong.');
                        })
                    }
                })
                socket.off('userBuyResponse');
                socket.on('userBuyResponse', (data) => {
                    data.response ? (showMessage(true, `Success! You have ${data.creditsLeft} credits left.`)) : (tempInput.value = "", showMessage(false, data.err));
                })
            }
        }
        container.appendChild(tempContainer);
    }
}
startApp();
//})();