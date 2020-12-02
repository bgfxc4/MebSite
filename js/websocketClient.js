(function(){

    var username;
    var password;
    var sessID;
    const socket = new WebSocket("wss://bgfxc4.de/main-server");

    socket.onopen = function(e) {
        console.log("[open] Connection established");
        };
        
        socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        processMessage(event.data);
        };
    
    window.onload = function(){
            document.getElementById('loginButton').addEventListener('click', login);
            document.addEventListener('keypress', (event) => {if(event.key == 'Enter'){login()}});
        }; 

    function sendToServer(toSend){
        socket.send(toSend);
        console.log("Sending \"" + toSend + "\" to server");
    }

    async function processMessage(msg){
        var split = msg.split(":", 2);
        var pckgName = split[0];
        var pckgCont = msg.substring(msg.indexOf(':')+1);

        if(pckgName == "RandBytes"){
            sendToServer("login:" + await SHA512(pckgCont + username + password));
        }else if(pckgName =="loggedIn"){
            sessID = decryptAes(password, pckgCont);
            console.log(sessID);
            document.cookie = "username=" + username;
            document.cookie = "sessID=" + sessID;
            document.cookie = "password=" + password;
            window.location.href = "./adminArea.html";
        }else if (pckgName =="loginFailed"){
            window.alert("login Failed!");
        }
    }

    function login(){
        username = document.getElementById("usernameTxtField").value;
        password = document.getElementById("passwrdTxtField").value;
        sendToServer("reqRandBytes:");
        document.getElementById("passwrdTxtField").value = '';
    }

    async function SHA512(message) {    
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
    
