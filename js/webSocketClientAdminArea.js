(function(){

    var username = "";
    var password = ";"
    var sessID = "";
    try{
    username = document.cookie.split('; ').find(row => row.startsWith('username')).split('=')[1];;
    password = document.cookie.split('; ').find(row => row.startsWith('password')).split('=')[1];;
    sessID = document.cookie.split('; ').find(row => row.startsWith('sessID')).split('=')[1];;
    }catch{
    }

    const socket = new WebSocket("wss://marchat.zapto.org/main-server");

    socket.onopen = async function(e) {
        console.log("[open] Connection established");
        var hash = await SHA512(sessID  + password);
        sendToServer("validate:" + hash);
        };
        
        socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        processMessage(event.data);
        };
    
    window.onload = function(){
        onWindowLoad();
        console.log(document.cookie.toString());
    }

    function sendToServer(toSend){
        socket.send(toSend);
        console.log("Sending \"" + toSend + "\" to server");
    }

    async function processMessage(msg){
        var split = msg.split(":", 2);
        var pckgName = split[0];
        var pckgCont = msg.substring(msg.indexOf(':')+1);

        if(pckgName == "validate"){
            if(pckgCont == "false"){
                document.body.innerHTML = '<h1> Permission denied!<\h1>';
            }
        }else if(pckgName == "wsStatus"){
            var split2 = pckgCont.split(" ", 2);
            var first = split2[0];
            var second = pckgCont.substring(pckgCont.indexOf(' ')+1);

            console.log(second);
            if(second == "true"){
                document.getElementById(first + "WsStatus").textContent = first + ": online";
            }else{
                document.getElementById(first + "WsStatus").textContent = first + ": offline";   
            }
        }
    }


    async function SHA512(message) {  
        console.log("hashing: " + message);  
        var hash = sha512.create();
        hash.update(message);
        hash.hex();
        return hash;
      }

      function encryptAes(key, text){
        var encrypted = CryptoJS.AES.encrypt(text, key).toString();
        return encrypted;
    }
    
    function decryptAes(key, text){
        var decrypted = CryptoJS.AES.decrypt(text, key);
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
})();