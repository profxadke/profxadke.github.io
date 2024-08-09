let QR_GENERATED = 0;

const encode2QR = () => {
  if (QR_GENERATED) {
    document.querySelector('img').remove();
  }; var qrcode = new QRCode("output", {
	     text: document.querySelector('.qrcontent').value,
	     width: 128,
	     height: 128,
	     colorDark : "#000000",
	     colorLight : "#ffffff",
	     correctLevel : QRCode.CorrectLevel.H
	 }); QR_GENERATED = 1;
}