THEME = 1;

var i = 0;
var txt = '';
const SPEED = 50;

const renderMD = markdown => {
  return DOMPurify.sanitize( marked.parse( markdown ) );
}

const hnfetch = async query => {
  if ( /^\d+$/.test(query) ) {
    query = `item/${query}`;
  }; resp = await fetch(`https://hacker-news.firebaseio.com/v0/${query}.json?print=pretty`);
  json = await resp.json();
  return json
}

const toggleTheme = () => {
  if (THEME) {
    document.querySelector('html').classList.remove('theme-dark');
    document.querySelector('html').classList.add('theme-light');
    document.querySelector('.toggle').classList.remove('is-light');
    document.querySelector('.toggle').classList.add('is-dark');
    document.querySelector('.toggle').innerText = "Dark";
    THEME = 0;
  } else {
    document.querySelector('html').classList.remove('theme-light');
    document.querySelector('html').classList.add('theme-dark');
    document.querySelector('.toggle').classList.remove('is-dark');
    document.querySelector('.toggle').classList.add('is-light');
    document.querySelector('.toggle').innerText = "Light";
    THEME = 1;
  } 
}

var hasTouchScreen = false;

if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
} else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
    } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen = (
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}

const another_denial = () => {
  document.querySelector('#chat-response').innerHTML = '';
  $_('GET', 'https://no.vision-xtech.com').then( resp => {
    txt = resp['reason'];
    i = 0;
    typeWriter();
  });
}

const typeWriter = () => {
  if (i < txt.length) {
    document.querySelector('#chat-response').innerText += txt.charAt(i);
    i++;
    setTimeout(typeWriter, SPEED);
  } else {
    document.querySelector('#chat-response').innerHTML += `<br /><br /><button style="background: #000;color: #0F0;border-radius: 8px;" onclick="another_denial()"> 4N0+H3R 0N3! </button>`;
  }
}

const humanVerification = () => {
    Swal.fire({
    title: "Humanity Verification!?",
    text: "Are you a human and, are willing to poke around?",
    icon: "question",
    draggable: true,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: `
      <i class="fa fa-thumbs-up"></i> Absolutely!
    `,
    confirmButtonAriaLabel: "Thumbs up, absolutely!",
    cancelButtonText: `
      <i class="fa fa-thumbs-down"></i>
    `,
  cancelButtonAriaLabel: "Thumbs down"
  }).then( result => {
      if (result.isDismissed) {
          if ( ['backdrop', 'close'].includes(result.dismiss) ) {
              humanVerification();
          } else if ( result.dismiss === 'cancel' ) {
              document.body.innerHTML = `<h1 style="font-size: xxx-large;">NO-BOTS.</h1><br /><br /><i><u>Now, what? Refresh!!</u></i>`;
          }
      } else if (result.isConfirmed) {
          if (result.value === true) {
			  console.clear();
			  console.log("SweetAlert Result:");
              console.log(result);
          } else {
			  console.clear();
              console.log(`I-SAID-NO-BOTS,PLEASE!`);
          }
      } else {
          document.body.innerHTML = `<h1 style="font-size: xxx-large;">NO-BOTS.</h1><br /><br /><i><u>Now, what? Refresh!!</u></i>`;
          humanVerification();
      }
  })
}

$$( () => {
  if (hasTouchScreen) {
      $('.is-1').remove();
      $('#ego').innerText = `OSHO`;
  }; humanVerification();
  another_denial();
})
