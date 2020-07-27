var ws;
var userUsername;
var userPassword;

window.addEventListener("load", () => {
    ws = new WebSocket(`wss://marchat.zapto.org/marchat`)
    ws.onmessage = (ev) => {
        handleMessage(ev.data.toString());
    }
    ws.onopen = async () => {
        console.log("WS_OPEN");
        Login();
    }
    ws.onclose = () => console.log("WS_CLOSE")
    ws.onerror = (ev) => {
        console.log(`WS_ERROR: ${ev}`);
    }
})



async function Login() {
    console.log(document.cookie.toString());
    var username = document.cookie.split('; ').find(row => row.startsWith('username')).split('=')[1];;
    var password = document.cookie.split('; ').find(row => row.startsWith('password')).split('=')[1];;
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

function handleMessage(msg){
    var pckgName = msg.split(":")[0]
    console.log("pckgName: " + pckgName);
    var pckgContent = JSON.parse(atob(msg.split(":")[1]));
    console.log("pckgContent: " + pckgContent.toString());

    if(pckgName == "error"){
        console.log(pckgContent.message);
    }else if("ok"){
        if(pckgContent.packet == "login"){
            console.log("logged in!");
        }
    }
}

function sendPacket(name,data){
    var packet = name + ":" + btoa(JSON.stringify(data));
    ws.send(packet);
    console.log("sending " + packet + " to the server");
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