let QR_GENERATED = 0;


const encode2QR = () => {
  if (QR_GENERATED) {
    document.querySelector('img').remove();
  }; let qrcode = new QRCode("output", {
	     text: document.querySelector('.qrcontent').value,
	     width: 128,
	     height: 128,
	     colorDark : "#000000",
	     colorLight : "#ffffff",
	     correctLevel : QRCode.CorrectLevel.H
	 }); QR_GENERATED = 1; return qrcode
}


document.querySelector('textarea').onkeyup = encode2QR;
