document.addEventListener('DOMContentLoaded', () => {
  const ageList = document.getElementById("ageList");
  const ageBox = document.getElementById("ageBox");
  const infobox = document.getElementById("infobox"); // Reference to infobox element

  // Create age spans dynamically
  const ageValues = ['18', '19', '51', '20', '21', '30']; // Add more values as needed

  ageValues.forEach(ageValue => {
    const ageSpan = document.createElement("span");
    ageSpan.draggable = true;
    ageSpan.textContent = ageValue;
    ageSpan.addEventListener("dragstart", drag);
    
    ageList.appendChild(ageSpan);
  });

  // Add event listeners to ageBox dynamically
  ageBox.addEventListener("dragover", allowDrop);
  ageBox.addEventListener("drop", drop);

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    event.preventDefault();
    const age = event.dataTransfer.getData("text");

    // Construct the API URL with the dropped age
    const apiUrl = `https://fdnd.directus.app/items/person/?filter[custom][_icontains]="leeftijd":${age}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        infobox.innerHTML = ''; // Clear previous content

        if (data.data.length > 0) {
          data.data.forEach(person => {
            console.log(person);
            // Update the infobox content with person information
            infobox.innerHTML += 
            `  
            <p>Name: ${person.name}</p>
            <p>Surname: ${person.surname}</p>
            <p>Role: ${person.role.join(', ')}</p>
            <p>Nickname: ${person.nickname}</p>
            <p>Github Handle: ${person.github_handle}</p>
            <p>Website: <a href="${person.website}" target="_blank">${person.website}</a></p>
            <div>${person.bio}</div>
            <img src="${person.avatar}" alt="Avatar" style="max-width: 100px; max-height: 100px;">
            <p>Squad ID: ${person.squad_id}</p>
            `;
          });
        } else {
          infobox.innerHTML = '<p>No data found for the selected age</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching or displaying results:', error);
      });
  }

  function drag(event) {
    event.dataTransfer.setData("text", event.target.textContent);
  }
});
