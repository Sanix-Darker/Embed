var port = chrome.extension.connect({
    name: "Embed communication Communication"
});

port.onMessage.addListener(function(msg) {
    console.log("Message recieved: " + msg);
});