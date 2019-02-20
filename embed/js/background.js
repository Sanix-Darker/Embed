/*
 * @author Sanix darker
 * https://github.com/sanix-darker
 */

/* Supported videos:
* - youtube
* - vimeo
* - dailymotion
*/


// Minimum resizable area
var minWidth = 60;
var minHeight = 40;

// Thresholds
var FULLSCREEN_MARGINS = -10;
var MARGINS = 4;

// End of what's configurable.
var clicked = null;
var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

var rightScreenEdge, bottomScreenEdge;

var preSnapped;

var b, x, y;

var redraw = false;

var Input = document.createElement("input");
Input.id="Embed_input";
Input.type="text";
Input.placeholder="https://www.youtube.com/watch?v=qehLslERiks";
Input.onkeypress=runScript

var Title = document.createElement("span");
Title.appendChild(document.createTextNode("🐼Embed"));
Title.id = "Title_embed";

var Br = document.createElement("br");

var Embed_close_button = document.createElement("span");
Embed_close_button.id="Embed_close_button";
Embed_close_button.onclick = closeEmbed;

var Embed_title = document.createElement("div");
Embed_title.id="Embed_title";
Embed_title.appendChild(Title);
Embed_title.appendChild(Embed_close_button);
Embed_title.appendChild(Input);

var Iframe = document.createElement("iframe");
Iframe.id="Embed_iframe"
Iframe.frameborder="0"
Iframe.allowfullscreen=""
Iframe.src="https://www.youtube.com/embed/qehLslERiks"


var Checkbox = document.createElement("input");
Checkbox.id="goFalla_check";
Checkbox.type="radio";
Checkbox.onchange=goFalla;

var goFalla = document.createElement("label");
goFalla.id = "goFalla";
goFalla.appendChild(Checkbox);
goFalla.appendChild(document.createTextNode("Go Falla"));


var goFalla_checked = false;
function goFalla(event) {

  goFalla_checked = (event.target.checked == true) ? true : false;
  //   if(event.target.checked == true){
  //     goFalla_checked = true;
  //     //console.log("goFalla_checked: ", goFalla_checked);
  //   }else{
  //     goFalla_checked = false;
  //     //console.log("goFalla_checked: ", goFalla_checked);
  //  }
}

var new_value_goFalla_checked = true;
var dja = 0;
setInterval(function(){

  if (goFalla_checked == true){

    if(new_value_goFalla_checked != goFalla_checked){
      [].forEach.call(document.querySelectorAll('a'), function(link) {
        dja++;
        link.addEventListener('mouseover', function(event) {
            var url = this.href;
            //window.location.replace(url);
            Iframe.src=url;
        });
      });
      //console.log("dedans");
      new_value_goFalla_checked = goFalla_checked
    }

  }else{

    if(new_value_goFalla_checked != goFalla_checked){
      // [].forEach.call(document.querySelectorAll('a'), function(link) {

      //   // link.addEventListener('mouseover', function(event) {
      //   //     //var url = this.href;
      //   //     //window.location.replace(url);
      //   //     //Iframe.src=url;
      //   // });
      //   link.removeEventListener("mousedown", function(event) { console.log("Desactivated")}, true);
      // });
      if(dja > 0){
        window.reload();
      }
      //console.log("dehors");
      new_value_goFalla_checked = goFalla_checked
    }

  }
}, 1000);

var Embed_content = document.createElement("div");
Embed_content.id="Embed_content";
Embed_content.appendChild(Iframe);
Embed_content.appendChild(goFalla);

var Embed_pane = document.createElement("div");
Embed_pane.id="Embed_pane";
Embed_pane.style.display="none";
Embed_pane.appendChild(Embed_title);
Embed_pane.appendChild(Embed_content);

var Embed_ghostpane = document.createElement("div");
Embed_ghostpane.id = "Embed_ghostpane";
Embed_ghostpane.style.display="none";

var span_onbutton = document.createElement("span");
span_onbutton.id = "span_onbutton";
span_onbutton.appendChild(document.createTextNode("Open Embed"));

// The embed start button
var Button_start = document.createElement("button");
Button_start.id="Embed_button_start";
Button_start.appendChild(document.createTextNode("🐼"));
Button_start.appendChild(span_onbutton);
Button_start.onclick=start_Embed;

document.body.appendChild(Embed_pane);
document.body.appendChild(Embed_ghostpane);
document.body.appendChild(Button_start);

function start_Embed(event){
    document.getElementById("Embed_pane").style.display = "block";
    document.getElementById("Embed_ghostpane").style.display = "block";
    document.getElementById("Embed_button_start").style.display = "none";
}


// Communication between The popup and the background
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
      port.postMessage("Hi World");
  });
});


function closeEmbed(e){
  // Embed_pane.parentNode.removeChild(Embed_pane);
  // Embed_ghostpane.parentNode.removeChild(Embed_ghostpane);
  document.getElementById("Embed_pane").style.display = "none";
  document.getElementById("Embed_ghostpane").style.display = "none";
  document.getElementById("Embed_button_start").style.display = "block";
}

function processAjaxData(response, urlPath){
  document.getElementById("content").innerHTML = response.html;
  document.title = response.pageTitle;
  window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
}

function runScript(e) {
  if (e.keyCode == 13) {
      //processAjaxData({"html":document.body.innerHTML,"pageTitle":"Title"}, e.target.value);
      if(e.target.value.includes('http')){
        var video_id = "";
        if(e.target.value.includes('youtube.')){

          var urlParams = new URLSearchParams(e.target.value.replace("?", "&"));
          video_id = urlParams.get('v');
          //console.log("video_id: ", video_id);
          var playlist = video_id;
          if(urlParams.has('list')){
            playlist = urlParams.get('list');
          }
          //console.log("playlist: ", playlist);

          Iframe.src = "https://www.youtube.com/embed/" + video_id + "?autoplay=0&controls=1&loop=0&playlist="+playlist+"&amp;showinfo=0";
        }
        else if(e.target.value.includes('youtu.be')){ 
          var first_part = e.target.value.split('?')[0];
          video_id = first_part.split('/')[3];

          var urlParams = new URLSearchParams(e.target.value.replace("?", "&"));
          var playlist = video_id;
          if(urlParams.has('list')){
            playlist = urlParams.get('list');
          }

          Iframe.src = "https://www.youtube.com/embed/" + video_id + "?autoplay=0&controls=1&loop=0&playlist=" + playlist + "&amp;showinfo=0";
        }

        else if(e.target.value.includes('vimeo.')){ 
        
          Iframe.src = "https://player.vimeo.com/video/" + e.target.value.split('/')[3];
        
        }

        else if(e.target.value.includes('dailymotion.')){

          Iframe.src = "https://www.dailymotion.com/embed/video/" + e.target.value.split('/')[4];
        
        }

        else{
  
          Iframe.src = e.target.value;
        }

      }else{
        Iframe.src = "https://www.bing.com/?q="+e.target.value;
      }

  }
}


var pane = Embed_pane;
var ghostpane = Embed_ghostpane;

function setBounds(element, x, y, w, h) {
  element.style.left = x + 'px';
  element.style.top = y + 'px';
  element.style.width = w + 'px';
  element.style.height = h + 'px';
}

function hintHide() {
  setBounds(ghostpane, b.left, b.top, b.width, b.height);
  ghostpane.style.opacity = 0;

  // var b = ghostpane.getBoundingClientRect();
  // ghostpane.style.top = b.top + b.height / 2;
  // ghostpane.style.left = b.left + b.width / 2;
  // ghostpane.style.width = 0;
  // ghostpane.style.height = 0;
}

// Mouse events
pane.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMove);
document.addEventListener('mouseup', onUp);

// Touch events	
pane.addEventListener('touchstart', onTouchDown);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchend', onTouchEnd);


function onTouchDown(e) {
  onDown(e.touches[0]);
  e.preventDefault();
}

function onTouchMove(e) {
  onMove(e.touches[0]);		
}

function onTouchEnd(e) {
  if (e.touches.length ==0) onUp(e.changedTouches[0]);
}

function onMouseDown(e) {
  onDown(e);
  if (e.toElement.localName != "input"){
    e.preventDefault();
  }
}

function onDown(e) {
  calc(e);

  var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

  clicked = {
    x: x,
    y: y,
    cx: e.clientX,
    cy: e.clientY,
    w: b.width,
    h: b.height,
    isResizing: isResizing,
    isMoving: !isResizing && canMove(),
    onTopEdge: onTopEdge,
    onLeftEdge: onLeftEdge,
    onRightEdge: onRightEdge,
    onBottomEdge: onBottomEdge
  };
}

function canMove() {
  return x > 0 && x < b.width && y > 0 && y < b.height
  && y < 30;
}

function calc(e) {
  b = pane.getBoundingClientRect();
  x = e.clientX - b.left;
  y = e.clientY - b.top;

  onTopEdge = y < MARGINS;
  onLeftEdge = x < MARGINS;
  onRightEdge = x >= b.width - MARGINS;
  onBottomEdge = y >= b.height - MARGINS;

  rightScreenEdge = window.innerWidth - MARGINS;
  bottomScreenEdge = window.innerHeight - MARGINS;
}

var e;

function onMove(ee) {
  calc(ee);

  e = ee;

  redraw = true;

}

function animate() {

  requestAnimationFrame(animate);

  if (!redraw) return;

  redraw = false;

  if (clicked && clicked.isResizing) {

    if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
    if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

    if (clicked.onLeftEdge) {
      var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
      if (currentWidth > minWidth) {
        pane.style.width = currentWidth + 'px';
        pane.style.left = e.clientX + 'px';	
      }
    }

    if (clicked.onTopEdge) {
      var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
      if (currentHeight > minHeight) {
        pane.style.height = currentHeight + 'px';
        pane.style.top = e.clientY + 'px';	
      }
    }

    hintHide();

    return;
  }

  if (clicked && clicked.isMoving) {

    if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS) {
      // hintFull();
      setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight / 2);
      ghostpane.style.opacity = 0.2;
    } else if (b.top < MARGINS) {
      // hintTop();
      setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight / 2);
      ghostpane.style.opacity = 0.2;
    } else if (b.left < MARGINS) {
      // hintLeft();
      setBounds(ghostpane, 0, 0, window.innerWidth / 2, window.innerHeight);
      ghostpane.style.opacity = 0.2;
    } else if (b.right > rightScreenEdge) {
      // hintRight();
      setBounds(ghostpane, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
      ghostpane.style.opacity = 0.2;
    } else if (b.bottom > bottomScreenEdge) {
      // hintBottom();
      setBounds(ghostpane, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
      ghostpane.style.opacity = 0.2;
    } else {
      hintHide();
    }

    if (preSnapped) {
      setBounds(pane,
        e.clientX - preSnapped.width / 2,
        e.clientY - Math.min(clicked.y, preSnapped.height),
        preSnapped.width,
        preSnapped.height
      );
      return;
    }

    // moving
    pane.style.top = (e.clientY - clicked.y) + 'px';
    pane.style.left = (e.clientX - clicked.x) + 'px';

    return;
  }

  // This code executes when mouse moves without clicking

  // style cursor
  if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
    pane.style.cursor = 'nwse-resize';
  } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
    pane.style.cursor = 'nesw-resize';
  } else if (onRightEdge || onLeftEdge) {
    pane.style.cursor = 'ew-resize';
  } else if (onBottomEdge || onTopEdge) {
    pane.style.cursor = 'ns-resize';
  } else if (canMove()) {
    pane.style.cursor = 'move';
  } else {
    pane.style.cursor = 'default';
  }
}

animate();

function onUp(e) {
  calc(e);

  if (clicked && clicked.isMoving) {
    // Snap
    var snapped = {
      width: b.width,
      height: b.height
    };

    if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS) {
      // hintFull();
      setBounds(pane, 0, 0, window.innerWidth, window.innerHeight / 2);
      preSnapped = snapped;
    } else if (b.top < MARGINS) {
      // hintTop();
      setBounds(pane, 0, 0, window.innerWidth, window.innerHeight / 2);
      preSnapped = snapped;
    } else if (b.left < MARGINS) {
      // hintLeft();
      setBounds(pane, 0, 0, window.innerWidth / 2, window.innerHeight);
      preSnapped = snapped;
    } else if (b.right > rightScreenEdge) {
      // hintRight();
      setBounds(pane, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
      preSnapped = snapped;
    } else if (b.bottom > bottomScreenEdge) {
      // hintBottom();
      setBounds(pane, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
      preSnapped = snapped;
    } else {
      preSnapped = null;
    }

    hintHide();

  }

  clicked = null;

}