document.addEventListener('DOMContentLoaded', () => {
  const ageList = document.getElementById("ageList");
  const ageBox = document.getElementById("ageBox");
  const infobox = document.getElementById("infobox"); // Referentie naar infobox element

  // aanmaken van leeftijd spans
  ['18', '19', '20', '21', '22', '51'].forEach(ageValue => {
    const ageSpan = document.createElement("span");
    ageSpan.draggable = true;
    ageSpan.textContent = ageValue;
    ageSpan.addEventListener("dragstart", drag);
    ageList.appendChild(ageSpan);
  });

  
  // Wanneer er een span wordt gesleept
  function drag(event) {
    // Zet de tekst van het span-element als 'text' in het datatransfer-object
    event.dataTransfer.setData("text", event.target.textContent);
  }

  // Event listeners toevoegen aan agebox
  ageBox.addEventListener("dragover", allowDrop);
  ageBox.addEventListener("drop", drop);

  function allowDrop(event) {
    event.preventDefault();
  }

  // Wanneer een leeftijd wordt losgelaten in de agebox
  function drop(event) {
    event.preventDefault();
    const age = event.dataTransfer.getData("text");

    const apiUrl = `https://fdnd.directus.app/items/person/?filter[custom][_icontains]="leeftijd":${age}`;

    // Doe een fetch om data op te halen
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Wis vorige inhoud in het infobox
        infobox.innerHTML = '';

        // Controleer of er data is gevonden
        if (data.data.length > 0) {
          // Loop door elke persoon en update de infobox met persoonlijke informatie
          data.data.forEach(person => {
            // Voeg persoonlijke informatie toe aan het infobox
            infobox.innerHTML += 
            `  
            <p>Naam: ${person.name}</p>
            <p>Achternaam: ${person.surname}</p>
            <p>Rol: ${person.role.join(', ')}</p>
            <p>Bijnaam: ${person.nickname}</p>
            <p>Github Handle: ${person.github_handle}</p>
            <p>Website: <a href="${person.website}" target="_blank">${person.website}</a></p>
            <div>Bio: ${person.bio}</div>
            <img src="${person.avatar}" alt="Avatar" style="max-width: 100px; max-height: 100px;">
            <p>Squad ID: ${person.squad_id}</p>
            `;
          });
        } else {
          // Toon bericht als er geen data is gevonden voor de geselecteerde leeftijd
          infobox.innerHTML = '<p>Geen data gevonden voor de geselecteerde leeftijd</p>';
        }
      })
      .catch(error => {
        // Toon foutmelding als er een fout optreedt bij het ophalen of weergeven van resultaten
        console.error('Fout bij het ophalen of weergeven van resultaten:', error);
      });
  }
});
