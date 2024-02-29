document.addEventListener('DOMContentLoaded', () => {
  const ageList = document.getElementById("ageList");
  const ageBox = document.getElementById("ageBox");
  const infobox = document.getElementById("infobox");
  const likes = JSON.parse(localStorage.getItem('likes')) || {};
  const dislikes = JSON.parse(localStorage.getItem('dislikes')) || {};

  // Loop om leeftijden aan de lijst toe te voegen
  ['18', '19', '20', '21', '22', '23', '24', '25','26','27','28','29','30', '51'].forEach(ageValue => {
    const ageSpan = document.createElement("span");
    ageSpan.draggable = true;
    ageSpan.textContent = ageValue;
    ageSpan.addEventListener("dragstart", drag);
    ageList.appendChild(ageSpan);
  });

  // Functie voor het slepen van leeftijden
  function drag(event) {
    event.dataTransfer.setData("text", event.target.textContent);
  }

  // Event listeners voor het toestaan van slepen en laten vallen
  ageBox.addEventListener("dragover", allowDrop);
  ageBox.addEventListener("drop", drop);

  // Functie om slepen toe te staan
  function allowDrop(event) {
    event.preventDefault();
  }

  // Functie voor het verwerken van het laten vallen van een leeftijd
  function drop(event) {
    event.preventDefault();
    const age = event.dataTransfer.getData("text");

    // API-aanroep om gegevens op te halen op basis van de leeftijd
    const apiUrl = `https://fdnd.directus.app/items/person/?filter[custom][_icontains]="leeftijd":${age}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        infobox.innerHTML = '';

        if (data.data.length > 0) {
          data.data.forEach(person => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("business-card");

            // Voeg HTML toe aan de kaart met persoonsinformatie
            cardDiv.innerHTML = `
            <p>Naam: ${person.name}</p>
            <p>Achternaam: ${person.surname}</p>
            <p>Rol: ${person.role.join(', ')}</p>
            <p>Bijnaam: ${person.nickname}</p>
            <p>Github Handle: ${person.github_handle}</p>
            <p>Website: <a href="${person.website}" target="_blank">${person.website}</a></p>
            <div>Bio: ${person.bio}</div>
            <img src="${person.avatar}" alt="Avatar" style="max-width: 100px; max-height: 100px;">
            <p>Squad ID: ${person.squad_id}</p>
              <button class="like-btn" data-id="${person.id}" onclick="like(${person.id})">Like</button>
              <button class="dislike-btn" data-id="${person.id}" onclick="dislike(${person.id})">Dislike</button>
              <p>Likes: ${likes[person.id] || 0}</p>
              <p>Dislikes: ${dislikes[person.id] || 0}</p>
            `;

            infobox.appendChild(cardDiv);
          });
        } else {
          infobox.innerHTML = '<p>Geen data gevonden voor de geselecteerde leeftijd</p>';
        }
      })
      .catch(error => {
        console.error('Fout bij het ophalen of weergeven van resultaten:', error);
      });
  }

  // Functie om likes te verwerken
  window.like = function(id) {
    likes[id] = (likes[id] || 0) + 1;
    localStorage.setItem('likes', JSON.stringify(likes));
    updateLikesAndDislikes();
  };

  // Functie om dislikes te verwerken
  window.dislike = function(id) {
    dislikes[id] = (dislikes[id] || 0) + 1;
    localStorage.setItem('dislikes', JSON.stringify(dislikes));
    updateLikesAndDislikes();
  };

  // Functie om likes en dislikes op de pagina bij te werken
  function updateLikesAndDislikes() {
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');

    likeButtons.forEach(button => {
      const id = parseInt(button.getAttribute('data-id'));
      button.nextElementSibling.innerHTML = `Likes: ${likes[id] || 0}`;
    });

    dislikeButtons.forEach(button => {
      const id = parseInt(button.getAttribute('data-id'));
      button.nextElementSibling.nextElementSibling.innerHTML = `Dislikes: ${dislikes[id] || 0}`;
    });
  }
});
