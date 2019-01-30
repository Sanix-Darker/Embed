var port = chrome.extension.connect({
    name: "Sample Communication"
});

document.getElementById("Embed_Open").onclick = openWindow

function openWindow(event){
    port.postMessage("Open");
}

port.onMessage.addListener(function(msg) {
    console.log("message recieved: " + msg);
});