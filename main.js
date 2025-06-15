THEME = 1;

const SPEED = 50;
var i = 0;
var txt = 'My plate is full, and I already ate the portion of doing favors.';

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

const another_denial = () => {
  $_('GET', 'https://no.vision-xtech.com').then( resp => {
    var txt = resp['reason'];
    var i = 0;
    typeWriter();
  });
}

const typeWriter = () => {
  if (i < txt.length) {
    document.querySelector('#chat-response').innerText += txt.charAt(i);
    i++;
    setTimeout(typeWriter, SPEED);
  }
  document.querySelector('#chat-response').innerHTML += `<br /><br /><button style="background: #000;color: #0F0;border-radius: 8px;" onclick="another_denial()"> 4N0+H3R 0N3! </button>`;
}


$$( () => {
  another_denial();
})
