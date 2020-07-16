(function(){

    var username;
    var password;
    //var socket = new WebSocket("ws://marchat.zapto.org:5554");
    var socket = new WebSocket("ws://localhost:5554");

    socket.onopen = function(e) {
        console.log("[open] Connection established");
        };
        
        socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        processMessage(event.data);
        };
    
    window.onload = function(){
        document.getElementById("loginButton").onclick = function(){
            username = document.getElementById("usernameTxtField").value;
            password = document.getElementById("passwrdTxtField").value;
            sendToServer("reqRandBytes:");
        };
    }

    function sendToServer(toSend){
        socket.send(toSend);
        console.log("Sending \"" + toSend + "\" to server");
    }

    async function processMessage(msg){
        var split = msg.split(":", 2);
        var pckgName = split[0];
        var pckgCont = split[1];

        if(pckgName == "RandBytes"){
            sendToServer("login:" + await sha256(pckgCont + username + password));
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
        console.log("hashing " + message + " to "  + hashHex);
        return hashHex;
      }
})();
    