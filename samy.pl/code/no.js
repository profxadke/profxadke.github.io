//function disableclick(event){if(event.button==2)return false;}
//document.onmousedown=disableclick;
function click(e)
{
  if (event.button == 2)
    return false;
  else if (document.layers && e.which == 3)
    return false;
}
if (document.layers)
  document.captureEvents(Event.MOUSEDOWN);
document.onmousedown = click;

document.addEventListener("keydown", function(e) {
  if (
    (e.keyCode >= 112 && e.keyCode <= 123) || // F1-F12 - FF
    (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && (
        //e.keyCode == 97  || e.keyCode == 65 || // A - Safari
        //e.keyCode == 116 || e.keyCode == 84 || // T - Safari
        e.keyCode == 99  || e.keyCode == 67 || // C - FF
        e.keyCode == 117 || e.keyCode == 85 || // U - Chrome/FF
        e.keyCode == 115 || e.keyCode == 83 || // S - Chrome/FF
        e.keyCode == 105 || e.keyCode == 73 || // I - Chrome/FF
        e.keyCode == 110 || e.keyCode == 78 || // N - FF
        e.keyCode == 107 || e.keyCode == 75 || // K - FF
        e.keyCode == 101 || e.keyCode == 69 || // E - FF
        e.keyCode == 109 || e.keyCode == 77 || // M - FF
        //        e.keyCode == 112 || e.keyCode == 80 || // P
        e.keyCode == 106 || e.keyCode == 74    // J
      )
    )
  )
  {
    e.preventDefault()
  }
}, false)
