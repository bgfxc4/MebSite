var ws;
var userUsername;
var userPassword;
var channelButtons = [];
var lastPressedChannelButton;
var activeChannelButton;
var channelTryingToJoin = "";
var lastCreatedChannelName = "";
window.addEventListener("load", () => {
document.getElementById("message-field-div").hidden = true;

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

    document.addEventListener("keydown", (ev) =>{
        var textField = document.getElementById("message-field");
        if(document.activeElement != textField) return;
        if(ev.key == "Enter")sendMessage();
    });

    document.getElementById("send-button").addEventListener("click", () => {
        sendMessage();
    });

    document.getElementById("new-channel-button").addEventListener("click", () => {
        createChannel();
    });
})



async function Login() {
    console.log(document.cookie.toString());
    var username = document.cookie.split('; ').find(row => row.startsWith('username')).split('=')[1];
    var password = document.cookie.split('; ').find(row => row.startsWith('password')).split('=')[1];
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
    console.log("pckgContent: " + msg);

    if(pckgName == "error"){
        console.log(pckgContent.message);
    }else if(pckgName == "ok"){
        if(pckgContent.packet == "login"){
            console.log("logged in!");
        }else if(pckgContent.packet == "channel"){
            document.getElementById("join-channel-message").hidden = true; 
            document.getElementById("message-field-div").hidden = false;
            document.getElementById("current-channel-text").innerHTML = "Current channel:#" + channelTryingToJoin;
            if(activeChannelButton) activeChannelButton.classList.remove("active-button");
            if(lastPressedChannelButton) {
                activeChannelButton = lastPressedChannelButton;
                activeChannelButton.classList.add("active-button");
            }
        }else if(pckgContent.packet == "channel_create"){
            tryJoinChannel(lastCreatedChannelName);
        }

    }else if(pckgName == "channel-list"){
        channelButtons = [];
        console.log("test channellist lenth: " + pckgContent.channels.length);
        var channelList = document.getElementById("channel-list");
        channelList.innerHTML = "";

        pckgContent.channels.forEach(function(i){
            var button = document.createElement("input");
            button.classList.add("channel-button");
            button.value = "#" + i;
            button.type = "button";
            channelButtons.push(button);
            button.addEventListener("click" ,() =>{
                lastPressedChannelButton = channelButtons[pckgContent.channels.findIndex((txt) => {return txt == i})];
                tryJoinChannel(i);
            })
            channelList.appendChild(button);
        });
    }else if(pckgName == "message"){
        showMessage(pckgContent.username, pckgContent.text);
    }
}

function tryJoinChannel(channelName){
    channelTryingToJoin = channelName;
    console.log("trying to join: " + channelName);
    var data = {
        name: channelName,
        count: 20,
        offset: -1,
    }
    sendPacket("channel", data);
} 

function sendMessage(){
    var textField = document.getElementById("message-field");

    var value = textField.value;

    if(value == "") return;

    var data = {
        text: value,
    }
    sendPacket("message", data)
    textField.value = "";
}

function createChannel(){
    var name = prompt("Please enter the name of the channel!");
    var data = {
        name: name,
    }
    sendPacket("channel_create", data);
    lastCreatedChannelName = name;
}


function sendPacket(name,data){
    var packet = name + ":" + btoa(JSON.stringify(data));
    ws.send(packet);
    console.log("sending " + packet + " to the server");
}

function showMessage(username, message){
    console.log("message is da " + username + message);
    var messageField = document.getElementById("messages-field");
    var msg = document.createElement("div");
    msg.classList.add("message");
    if(username == userUsername){
        msg.id = "own-message";
        msg.innerHTML = "<b>You:</b> <br/>" + message;
    }else {
        msg.innerHTML = "<b>" + username + "</b>: <br/>" + message;
    }
    messageField.appendChild(msg);
    window.scrollTo(0,document.body.scrollHeight);
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