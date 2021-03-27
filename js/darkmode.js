var toggleSwitch;
var disgusting = false;
var lastTenSwitches = [];

function switchTheme(e) {
	if (disgusting) {
		document.documentElement.setAttribute('data-theme', 'disgusting');
		console.log("asd")
	} else if (e.target.checked) {
	    document.documentElement.setAttribute('data-theme', 'dark');
	} else {
	    document.documentElement.setAttribute('data-theme', 'light');
	}
	
	if (lastTenSwitches.length < 10) {
		lastTenSwitches.push(Date.now())
	} else {
		for (var i = 0; i < lastTenSwitches.length - 1; i++) {
			lastTenSwitches[i] = lastTenSwitches[i + 1];
		}
		lastTenSwitches[lastTenSwitches.length - 1] = Date.now()
		
		if (lastTenSwitches[lastTenSwitches.length - 1] - lastTenSwitches[0] < 1450) {
			disgusting = true;
		}
	}

}

window.onload = function() {
	var theme_switches = document.getElementsByClassName("theme-switch-wrapper");
	for (var i = 0; i < theme_switches.length; i++) {
		theme_switches[i].style.display = "flex";
	}
	toggleSwitch = document.getElementById("darkmode_checkbox")
	toggleSwitch.addEventListener('change', switchTheme, false);
}

