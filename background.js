// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "webkitNotifications.requestPermission" beforehand).
*/
function updateDNS(ip) {

  //update it
  $.get('https://dynamicdns.park-your-domain.com/update?host='+localStorage.host+'&domain='+localStorage.domain+'&password='+localStorage.password+'&ip='+ip, function(data) {
    
    xmlDoc = $.parseXML(data);
    $xml = $( xmlDoc );
    ip = $xml.find("IP").text();
    errors = parseInt($xml.find("ErrCount").text());
    if(errors>0){
      //display error
      var notification = window.webkitNotifications.createNotification(
        'icon48.png',                  // The image.
        'Error Updating Dynamic DNS', // The title.
        $xml.find("Err1").text()     // The body.
      );
      notification.show();
    }
    else{
      //display notification
      if(JSON.parse(localStorage.showNotifications)){
        var notification = window.webkitNotifications.createNotification(
          'icon48.png',                      // The image.
          'Dynamic DNS Updated', // The title.
          'New IP Address: '+ ip     // The body.
        );
        notification.show();
      }
      //update lastIP
      localStorage.lastIP = ip;
    }
  });  
}

function checkIPAddress(force){
   $.get('http://icanhazip.com/', function(data) {

    if(force || localStorage.lastIP != jQuery.trim(data)){
      updateDNS(data);
    }
  });

}

function firstRun() {
    if (localStorage.getItem('installTime'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "options.html"});
}
firstRun();

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = false;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.host = "";
  localStorage.domain = "";
  localStorage.password = "";
  localStorage.showNotifications = true;
  localStorage.lastIP = "0.0.0.0";
  localStorage.isInitialized = true; // The option initialization.
}

// While activated, show notifications at the display frequency.
if (JSON.parse(localStorage.isActivated)) { checkIPAddress(true); }

var interval = 0; // The display interval, in minutes.

setInterval(function() {
  interval++;

  if (JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
  ) {
    checkIPAddress(false);
    interval = 0;
  }
}, 60000);
