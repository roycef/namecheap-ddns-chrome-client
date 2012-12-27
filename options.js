
function ghost(isDeactivated) {
  options.frequency.disabled = isDeactivated; // The control manipulability.
}

window.addEventListener('load', function() {
  // Initialize the option controls.
	options.isActivated.checked = JSON.parse(localStorage.isActivated);
	                                     // The display activation.
	options.frequency.value = localStorage.frequency;
	                                     // The display frequency, in minutes.
	if (!options.isActivated.checked) { ghost(true); }
	options.host.value = localStorage.host;
	options.domain.value = localStorage.domain
	options.password.value = localStorage.password
	options.showNotifications.checked = JSON.parse(localStorage.showNotifications);


	// Set the display activation and frequency.

	options.host.onchange = function() {
	    localStorage.host = options.host.value;
  	};
  	options.domain.onchange = function() {
	    localStorage.domain = options.domain.value;
  	};
  	options.password.onchange = function() {
	    localStorage.password = options.password.value;
  	};

	options.isActivated.onchange = function() {
		localStorage.isActivated = options.isActivated.checked;
		ghost(!options.isActivated.checked);
	};

	options.frequency.onchange = function() {
		localStorage.frequency = options.frequency.value;
	};
	options.showNotifications.onchange = function() {
		localStorage.showNotifications = options.showNotifications.checked;
	};
});

