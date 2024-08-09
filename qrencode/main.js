const encode2QR = () => {
  var qrcode = new QRCode("output", {
	     text: document.querySelector('.qrcontent').value,
	     width: 128,
	     height: 128,
	     colorDark : "#000000",
	     colorLight : "#ffffff",
	     correctLevel : QRCode.CorrectLevel.H
	 }); 
}