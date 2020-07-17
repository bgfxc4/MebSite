(function(){

    var username;
    var password;
    //var socket = new WebSocket("ws://marchat.zapto.org:5554");
    var socket = new WebSocket("ws://marchat.zapto.org:5554");

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
            sendToServer("login:" + await SHA512(pckgCont + username + password));
        }else if(pckgName =="loggedIn"){
            window.alert("logged in")
        }else if (pckgName =="loginFailed"){
            window.alert("login Failed!");
        }
    }


    async function SHA512(message) {    
        var hash = sha512.create();
        hash.update(message);
        hash.hex();
        return hash;
      }
})();
    