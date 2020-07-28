var ws;
var userUsername;
var userPassword;

window.onload = async () => {

    ws = new WebSocket(`wss://marchat.zapto.org/marchat`)
    ws.onmessage = (ev) => {
        handleMessage(ev.data.toString());
    }
    ws.onopen = async () => {
        console.log("WS_OPEN");
    }
    ws.onclose = () => console.log("WS_CLOSE")
    ws.onerror = (ev) => {
        console.log(`WS_ERROR: ${ev}`);
        document.getElementById("errorMessage").innerHTML = "Connection to Server failed! Please try later again.";
    }

    document.addEventListener("keydown", (ev) =>{
        if(ev.key == "Enter")tryLogin();
    });
}

async function tryLogin() {
    var username = document.getElementById("usernameTxtField").value;
    var password = document.getElementById("passwordTextField").value;
    userUsername = username;
    userPassword = password;
    var hashedPasswd = await sha256(password);
    var timestamp = Date.now();
    var data = {
        username: username,
        password: hashedPasswd,
        anti_replay: await sha256(hashedPasswd + " " + timestamp),
        timestamp: timestamp,
    }

    sendPacket("login", data);
}


async function tryRegister() {
    var username = document.getElementById("usernameTxtField").value;
    var password = document.getElementById("passwordTextField").value;
    var password2 = document.getElementById("passwordTextField2").value;
    if(password != password2){
        document.getElementById("errorMessage").innerHTML = "Your passwords must match!";
        return;
    }
    var hashedPasswd = await sha256(password);
    var data = {
        username: username,
        password: hashedPasswd,
    }

    sendPacket("register", data);
}


function sendPacket(name,data){
    var packet = name + ":" + btoa(JSON.stringify(data));
    ws.send(packet);
    console.log("sending " + packet + " to the server");
}

function handleMessage(msg){
    var pckgName = msg.split(":")[0]
    console.log("pckgName: " + pckgName);
    var pckgContent = JSON.parse(atob(msg.split(":")[1]));
    console.log("pckgContent: " + pckgContent.toString());

    if(pckgName == "error"){
        document.getElementById("errorMessage").innerHTML = pckgContent.message;
    }else if("ok"){
        if(pckgContent.packet == "login"){
            document.cookie = "username=" + userUsername;
            document.cookie = "password=" + userPassword;
            document.cookie = "sameSite=" + "secure";
            console.log(document.cookie.toString());
            window.location.href = "chat.html";
        }else if(pckgContent.packet == "register"){
            window.location.href = "login.html";
        }
    }
}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}