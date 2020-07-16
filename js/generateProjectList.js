(function(){

var gitsToDisplay = ['bgfxc4/MebSite','bgfxc4/twitter-bot', 'MetaMuffin/marchat', 'MetaMuffin/g-code-transpiler'];

window.onload = function load(){
    console.log("windwow is loaded");
    const list = document.getElementById("gitHubList");
    for(var i = 0; i < gitsToDisplay.length; i++){


        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "https://github.com/" + gitsToDisplay[i];
        a.className = "gitHubLink";
        a.target = "_blank";

        var s = gitsToDisplay[i].split('/', 2);
        a.textContent = s[1] + " by " + s[0];
        li.appendChild(a);
        list.appendChild(li);
    }
}

})();