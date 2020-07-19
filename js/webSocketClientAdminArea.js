(function(){

    var username = document.cookie.split('; ').find(row => row.startsWith('username')).split('=')[1];;
    var password = document.cookie.split('; ').find(row => row.startsWith('password')).split('=')[1];;
    var sessID = document.cookie.split('; ').find(row => row.startsWith('sessID')).split('=')[1];;

    const socket = new WebSocket("wss://marchat.zapto.org/main-server");

    socket.onopen = function(e) {
        console.log("[open] Connection established");
        sendToServer("validate:" + SHA512(sessID  + password));
        };
        
        socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        processMessage(event.data);
        };
    
    window.onload = function(){
        console.log(document.cookie.toString());
    }

    function sendToServer(toSend){
        socket.send(toSend);
        console.log("Sending \"" + toSend + "\" to server");
    }

    async function processMessage(msg){
        var split = msg.split(":", 2);
        var pckgName = split[0];
        var pckgCont = msg.substring(msg.indexOf(':')+1)
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