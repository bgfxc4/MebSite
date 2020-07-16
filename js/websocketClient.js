(function(){

    var gitsToDisplay = ['bgfxc4/MebSite','bgfxc4/twitter-bot', 'MetaMuffin/marchat', 'MetaMuffin/g-code-transpiler'];

    //var socket = new WebSocket("ws://marchat.zapto.org:5554");
    var socket = new WebSocket("ws://localhost:5554");

    socket.onopen = function(e) {
        console.log("[open] Connection established");
        };
        
        socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        };

})();
    