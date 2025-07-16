let QR_GENERATED = 0;

const resetQRprops = () => {
    document.querySelector('.qrImgURL').value = "https://osho.is-a.dev/qrencode/img/ogo.png";
    document.querySelector('.qrColor').value = "#90EE90";
    document.querySelector('.qrcontent').value = "";
    if ( Boolean ( document.querySelector('#canvas') ) ) {
        document.querySelector('#canvas').remove();
        document.querySelector('#output').innerHTML = `<div id="canvas"></div>`;
    };
}

/*
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
*/

const appendQR = payload => {
    if ( Boolean ( document.querySelector('#canvas') ) ) {
        document.querySelector('#canvas').remove();
	document.querySelector('#output').innerHTML = `<div id="canvas"></div>`;
    }; let qrcode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: payload,
        image: document.querySelector('.qrImgURL').value,
	dotsOptions: {
            color: document.querySelector('.qrColor').value,
            type: "rounded"
        },
        backgroundOptions: {
            color: "#000",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: -25
        }
    }); QR_GENERATED = 1; qrcode.append(document.getElementById("canvas"));
}

const genQr = () => {
	appendQR(document.querySelector('.qrcontent').value)
}

// document.querySelector('textarea').onkeyup = encode2QR;
document.querySelector('textarea').onkeyup = genQr;
resetQRprops();