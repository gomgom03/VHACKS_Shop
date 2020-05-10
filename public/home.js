//(()=>{
const socket = io.connect();

/*
let admin;

let userCredits;
socket.emit('adminRequest')
socket.emit('storeRequest')
socket.emit('userCreditsRequest')
socket.on('adminResponse', (data) => {
    admin = data;
})

socket.on('userCreditsRequest', (data) => {
    userCredits = data;
})
*/
let store;
socket.on('storeResponse', (data) => {
    store = data;
    elements.webstore = store;
})


const container = document.querySelector('#container');
const goBackButton = document.querySelector('#goBack')
//For website
const elements = {
    startApp: {
        chooseQuery: {
            type: "div",
            text: "Choose User",
            style: {

            }
        },
        userButton: {
            type: "button",
            text: "User",
            style: {

            }
        },
        adminButton: {
            type: "button",
            text: "Admin",
            style: {

            }
        }
    },
    adminLogin: {
        info: {
            type: "div",
            text: "Admin Login",
            style: {

            },
            options: {
                class: "infoText"
            }
        },
        id: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "ID"
            }
        },
        password: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "Password",
                type: "password"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            style: {

            }
        }
    },
    adminAction: {
        chooseQuery: {
            type: "div",
            text: "Choose Action",
            style: {

            }
        },
        adminChangeButton: {
            type: "button",
            text: "Change Admin",
            style: {

            }
        },
        addItemButton: {
            type: "button",
            text: "Add Items",
            style: {

            }
        },
        addUserCreditsButton: {
            type: "button",
            text: "Add User Credit",
            style: {

            }
        },
        adminWebstore: {
            type: "button",
            text: "Webstore - Admin",
            style: {

            }
        }
    },
    adminAddItems: {
        info: {
            type: "div",
            text: "Add Store Items",
            style: {

            },
            options: {
                class: "infoText"
            }
        },
        item: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "Store Item"
            }
        },
        amount: {
            type: "input",
            style: {

            },
            options: {
                type: "number",
                placeholder: "Dollar Amount"
            }
        },
        quantity: {
            type: "input",
            style: {

            },
            options: {
                type: "number",
                placeholder: "Quantity"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            style: {

            }
        }

    },
    changeAdmin: {
        info: {
            type: "div",
            text: "Change Admin",
            style: {

            },
            options: {
                class: "infoText"
            }
        },
        id: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "ID"
            }
        },
        password: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "Password",
                type: "password"
            }
        },
        email: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "Email"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            style: {

            }
        }
    },
    adminAddCredits: {
        info: {
            type: "div",
            text: "Add Credits",
            style: {

            },
            options: {
                class: "infoText"
            }
        },
        id: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "User ID"
            }
        },
        password: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "User Password",
                type: "password"
            }
        },
        credits: {
            type: "input",
            style: {

            },
            options: {
                type: "number",
                placeholder: "User Credits"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            style: {

            }
        }
    },
    userLogin: {
        info: {
            type: "div",
            text: "User Login",
            style: {

            },
            options: {
                class: "infoText"
            }
        },
        id: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "ID"
            }
        },
        password: {
            type: "input",
            style: {

            },
            options: {
                placeholder: "Password",
                type: "password"
            }
        },
        submitButton: {
            type: "button",
            text: "Submit",
            style: {

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
        case "adminAddCredits": adminAction();break;
        case "webstore": startApp();
        case "adminWebstore": adminAction();break;
        case "userLogin": startApp();
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
    console.log(type, id, parent, text)
    let temp = document.createElement(type);
    temp.id = id
    temp.textContent = text;
    parent.appendChild(temp);
    return temp;
}
function createElements(page) {
    console.log(elements[page])
    for (let subElement in elements[page]) {
        let curObj = elements[page][subElement];
        curObj.elem = createElement(curObj.type, subElement, curObj.parent || container, curObj.text || "");
        for (let option in curObj["options"]) {
            curObj.elem[option] = curObj["options"][option];
        }
        for (let styleOption in curObj["style"]) {
            curObj.elem.style[styleOption] = curObj["style"][styleOption];
        }
    }
    return elements[page];

}

function startApp() {
    currentPage = "startApp";
    clearContainer();
    let tempObj = createElements("startApp");
    tempObj.userButton.elem.addEventListener("click", userLogin);
    tempObj.adminButton.elem.addEventListener("click", adminLogin);
}
startApp();

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
        socket.on('adminResponse', (data) => {
            console.log(data);
            data.response === true ? (adminLoggedIn = true, adminAction()) : (tempObj.id.elem.value = "", tempObj.password.elem.value = "", adminLoggedIn = false, alert('Incorrect'));
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
    } else {
        adminLogin();
    }

}

function adminAddItems() {
    currentPage = "adminAddItems";
    if (adminLoggedIn) {
        clearContainer();
        let tempObj = createElements("adminAddItems");
        tempObj.submitButton.elem.addEventListener("click", () => {
            socket.emit('storeChangeRequest', { credentials: adminSaved, change: { item: tempObj.item.elem.value, amount: tempObj.amount.elem.value, quantity: tempObj.quantity.elem.value } })
        })
        socket.on('storeChangeResponse', (data) => {
            data.response === true ? alert('Success') : alert('Failure');
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
        socket.on('adminChangeResponse', (data) => {
            data.response === true ? (adminLoggedIn = false, alert("Success"), adminLogin()) : alert('Failure');
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
        tempObj.submitButton.elem.addEventListener('click', () => {
            socket.emit('userCreditsChangeRequest', { credentials: adminSaved, change: { id: tempObj.id.elem.value, password: tempObj.password.elem.value, credits: tempObj.credits.elem.value, } })
        });
        socket.on('userCreditsChangeResponse', (data) => {
            data.response === true ? alert('Success') : alert('Failure');
        })
    } else {
        adminLogin();
    }
}

let userLoggedIn = false;
let userSaved = {
    id:null,
    password:null
}
let userCredits = 0;
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
        socket.on('userResponse', (data) => {
            console.log(data);
            data.response === true ? (userLoggedIn = true, userCredits = data.credits,webstore()) : (tempObj.id.elem.value = "", tempObj.password.elem.value = "", userLoggedIn = false, alert('Incorrect'));
        })
    }
}

function webstore() {
    currentPage = "webstore";
    clearContainer();
    let tempObj = createElements("webstore");
}

function adminWebstore(){
    currentPage = "adminWebstore";

}

//})();