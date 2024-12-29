THEME = 1;

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
