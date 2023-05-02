function onJsonfilm(json) {
    console.log('JSON ricevuto');

    const library = document.querySelector('#film-view');
    library.innerHTML = '';

    if (json.Response === "False") {
        const message = document.createElement('div');
        message.textContent = "Film non trovato";
        library.appendChild(message);
        return;
    }
    
    const film_data = json;

    const title = film_data.Title;
    const image = film_data.Poster;
    const vittorie = film_data.Awards;
      
    const film = document.createElement('div');
    film.classList.add('film');
      
    const img = document.createElement('img');
    img.src = image;
    const caption = document.createElement('span');
    caption.textContent = title;
    const vittoria = document.createElement('span');
    vittoria.textContent = vittorie; 
    
    film.appendChild(img);
    film.appendChild(caption);
    film.appendChild(vittoria);
    library.appendChild(film);
    
}

function onResponsefilm(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function searchfilm(event) {

    event.preventDefault();

    const film_input = document.querySelector('#film');
    const film_value = encodeURIComponent(film_input.value);
    console.log('Eseguo ricerca: ' + film_value);

    rest_url = 'http://www.omdbapi.com/?t=' + film_value +'&apikey=' + api_key;
    console.log('URL: ' + rest_url);

    fetch(rest_url).then(onResponsefilm).then(onJsonfilm);

    return false;
}

function onJsonSound(json) {
    console.log('JSON ricevuto');
    console.log(json);
    const library = document.querySelector('#playlist-view');
    library.innerHTML = '';

    const results = json.albums.items;
    let num_results = results.length;
    if(num_results > 2)
        num_results = 2;

    for(let i=0; i<num_results; i++) {
      const playlist_data = results[i]

      const title = playlist_data.name;
      const selected_image = playlist_data.images[0].url;
      const url_spotify = playlist_data.external_urls.spotify;

      const playlist = document.createElement('div');
      playlist.classList.add('playlist');

      const img = document.createElement('img');
      img.src = selected_image;

      const caption = document.createElement('span');
      caption.textContent = title;

      const url= document.createElement('a');
      url.textContent = 'Ascolta ora';
      url.href = url_spotify;

      playlist.appendChild(img);
      playlist.appendChild(caption);
      playlist.appendChild(url);

      library.appendChild(playlist);
    }
  }

function onResponseSound(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function searchSoundtrack(event) {
    event.preventDefault();
    const playlist_input = document.querySelector('#film');
    if (playlist_input.value.length=== 0)
        return;

    const playlist_value = encodeURIComponent(playlist_input.value);
    
    console.log('Eseguo ricerca: ' + playlist_value);

    fetch("https://api.spotify.com/v1/search?type=album&q=" + playlist_value +'soundtrack',
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponseSound).then(onJsonSound);
    
}

function onTokenJson(json)
{
  console.log(json)
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}


const api_key = '80a31b51';
const client_id= 'd65678ec95754312b9b53a49fce949d9';
const client_secret= '679b25230f3648a0bbd890676e736a6b';
let token;

fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);


const form = document.querySelector('form');
form.addEventListener('submit', searchfilm);
form.addEventListener('submit', searchSoundtrack);