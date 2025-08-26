const xhr2 = new XMLHttpRequest();
  xhr2.open('GET', 'https://datamb.football/database/TEAM/teamradars.csv', false); // false for synchronous request
  xhr2.send(null);
  

      const inputLines = xhr2.responseText;
  const outputLines = [];

// Split input into lines
const lines = inputLines.trim().split('\n');

// Process each line
for (const line of lines) {
// Split the line by comma
const parts = line.split(',');

// Extract the desired fields
const name = parts[1];
const age = parts[3];
const club = parts[2];

// Create the formatted string
const outputLine = `${name},${age},${club}`;

// Add the formatted string to the output array
outputLines.push(outputLine);
}

  const names = outputLines;
      const searchInput = document.getElementById('searchInput1');
      searchInput.setAttribute("autocomplete", "off");
 const matchingNamesContainer = document.getElementById("matchingNames");
const searchButton = document.getElementById("searchButton");


function isMobileDevice() {
  const userAgent = navigator.userAgent;
  return /Android|iPhone/i.test(userAgent);
}

function updateMatchingNames() {
  const searchQuery = removeSpecialChars(searchInput.value.toLowerCase());
  const matchingNames = names.filter(function(name) {
    const [fullName] = name.split(",");
    const normalizedName = removeSpecialChars(fullName.toLowerCase());
    return normalizedName.includes(searchQuery);
  });

  matchingNamesContainer.innerHTML = "";

  matchingNames.forEach(function(name) {
    const [fullName, team, age] = name.split(",");

    const nameElement = document.createElement("div");
    nameElement.classList.add("name");

    const fullNameElement = document.createElement("span");
    fullNameElement.textContent = fullName;
    fullNameElement.classList.add("fullName");
    nameElement.appendChild(fullNameElement);

    const ageElement = document.createElement("span");
    ageElement.textContent = " (" + team + ",";
    ageElement.classList.add("age");
    nameElement.appendChild(ageElement);

    const teamElement = document.createElement("span");
    teamElement.textContent = " " + age + ")";
    teamElement.classList.add("team");
    nameElement.appendChild(teamElement);

    nameElement.addEventListener("mousedown", (e) => {
  e.preventDefault();
  e.stopPropagation();
      const clickedElement = event.target.closest(".name");
      if (clickedElement) {
        const fullName = clickedElement.querySelector(".fullName").textContent;
        const age = clickedElement.querySelector(".age").textContent.trim();
        const team = clickedElement.querySelector(".team").textContent.trim().replace(/[^a-zA-Z\s]/g, ''); // Remove non-alphanumeric characters
        const searchQuery = fullName + "," + age.substring(1, age.length - 1) + "," + team;
    
        searchInput.value = searchQuery; // Set the full query as the search input value
        searchButton1.click();
      }
    });
    nameElement.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.stopPropagation();
      const clickedElement = event.target.closest(".name");
      if (clickedElement) {
        const fullName = clickedElement.querySelector(".fullName").textContent;
        const age = clickedElement.querySelector(".age").textContent.trim();
        const team = clickedElement.querySelector(".team").textContent.trim().replace(/[^a-zA-Z\s]/g, ''); // Remove non-alphanumeric characters
        const searchQuery = fullName + "," + age.substring(1, age.length - 1) + "," + team;
    
        searchInput.value = searchQuery; // Set the full query as the search input value
        searchButton1.click();
  }}, {passive: false});

    matchingNamesContainer.appendChild(nameElement);
              });
            
              if (searchQuery === "" && matchingNames.length === 0) {
                matchingNamesContainer.style.display = "none";
              } else {
                const searchInputWidth = searchInput.offsetWidth;
                matchingNamesContainer.style.display = "block";
                matchingNamesContainer.style.padding = "8px";
                matchingNamesContainer.style.position = "relative";
                matchingNamesContainer.style.zIndex = "9999"; // Set a high z-index value
                matchingNamesContainer.style.width = searchInputWidth + "px";
                matchingNamesContainer.style.maxHeight = "267px"; // Limit height for long lists
                matchingNamesContainer.style.overflowY = "auto"; // Enable scrolling if content exceeds height
          
                matchingNamesContainer.style.border = "1px solid #e0e0e0"; // Light gray border
              }
             
              if (searchQuery === "") {
                matchingNamesContainer.style.display = "none";
              }
            }

searchInput.addEventListener("input", updateMatchingNames);
searchInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    searchButton1.click(); // Trigger the search button click event
  } else if (event.key === "Backspace") {
    updateMatchingNames();
  }
});  

 const xhr = new XMLHttpRequest();
 xhr.open('GET', 'https://datamb.football/database/TEAM/teamradars.csv', false); // false for synchronous request
 xhr.send(null);
 

     const csvData = xhr.responseText;
     let dataArray = csvData.trim().split('\n').map(line => line.split(','));
     

     function calculateEuclideanDifference(data1, data2) {
      let difference = 0;
      for (let i = 4; i <= 10; i++) {
        const metric1 = parseFloat(data1[i]);
        const metric2 = parseFloat(data2[i]);
        difference += Math.pow(metric1 - metric2, 2);
      }
      return Math.sqrt(difference);
    }
    const colorClasses = ['result-color-1', 'result-color-2', 'result-color-3', 'result-color-4', 'result-color-5', 'result-color-6', 'result-color-7', 'result-color-8', 'result-color-9', 'result-color-10', 'result-color-11', 'result-color-12', 'result-color-13', 'result-color-14', 'result-color-15', 'result-color-16', 'result-color-17', 'result-color-18', 'result-color-19', 'result-color-20', 'result-color-21', 'result-color-22', 'result-color-23', 'result-color-24', 'result-color-25', 'result-color-26', 'result-color-27', 'result-color-28', 'result-color-29', 'result-color-30', 'result-color-31', 'result-color-32', 'result-color-33', 'result-color-34', 'result-color-35', 'result-color-36', 'result-color-37'];
 
 function removeSpecialChars(str) {
   return str.normalize('NFD').replace(/[\u0300-\u036f\s]/g, '');
 }
 function search(query) {
  const queryParts = query.split(',').map(part => part.trim()); // Split the query by commas and trim whitespace
  const name = queryParts[0]; // Extract the name part
  let age, team;

  // Extract age and team if they exist
  if (queryParts.length > 1) {
    age = queryParts[1].trim(); // Trim any leading or trailing spaces
    if (queryParts.length > 2) {
      team = queryParts[2].trim(); // Trim any leading or trailing spaces
    }
  }

  // First, look for an exact match with all provided criteria
  if (name && age && team) {
    const exactMatch = dataArray.find(data => 
      data[1].toLowerCase() === name.toLowerCase() && 
      data[3].toLowerCase() === age.toLowerCase() &&
      data[2].toLowerCase() === team.toLowerCase()
    );
    
    if (exactMatch) {
      return [exactMatch];
    }
  }
  
  // If no exact match with all criteria, try name and age
  if (name && age) {
    const nameAgeMatch = dataArray.find(data => 
      data[1].toLowerCase() === name.toLowerCase() && 
      data[3].toLowerCase() === age.toLowerCase()
    );
    
    if (nameAgeMatch) {
      return [nameAgeMatch];
    }
  }

  // Fall back to the previous filtering logic
  const results = dataArray.filter(data => {
    const normalizedName = removeSpecialChars(data[1].toLowerCase());
    const normalizedAge = data[3].trim().toLowerCase(); // Trim any leading or trailing spaces

    // Prioritize exact match first, fall back to includes for partial match
    const nameMatches = 
      removeSpecialChars(name.toLowerCase()) === normalizedName;  // Exact match only

    const ageMatches = !age || normalizedAge === removeSpecialChars(age.toLowerCase());

    return nameMatches && ageMatches;
  });

  // If no exact match was found, you can optionally search for partial matches as fallback
  if (results.length === 0) {
    const fallbackResults = dataArray.filter(data => {
      const normalizedName = removeSpecialChars(data[1].toLowerCase());
      const normalizedAge = data[3].trim().toLowerCase();
  
      const nameMatches = normalizedName.includes(removeSpecialChars(name.toLowerCase()));
      const ageMatches = !age || normalizedAge === removeSpecialChars(age.toLowerCase());

      return nameMatches && ageMatches;
    });
    return fallbackResults;
  }

  return results;
}

   
 
 function createTable(teamName, teamIndex, color) {
   const resultsTable = document.getElementById('resultsTable');
 
   const headerNames = [
     '',
     '<span data-i18n="table.percentile">Percentiles</span>',
     '<span data-i18n="table.goals">Goals</span>',
     '<span data-i18n="table.attacking">Attacking</span>',
     '<span data-i18n="table.possession">Possession</span>',
     '<span data-i18n="table.counters">Counters</span>',
     '<span data-i18n="table.defending">Defending</span>',
     '<span data-i18n="table.physicality">Physicality</span>',
     '<span data-i18n="table.pressing">Pressing</span>'
   ];
 
   
      
        // Check if table headers exist
        const headersExist = resultsTable.querySelector('th') !== null;
      
        const table = headersExist ? resultsTable.querySelector('table') : document.createElement('table');
        table.classList.add('metrics-table');
      
        if (!headersExist) {
          // Create the table header
          const headerRow = document.createElement('tr');
         
          for (let i = 1; i < headerNames.length; i++) {
            const th = document.createElement('th');
            th.innerHTML = headerNames[i];
            headerRow.appendChild(th);
          }
      // Add a separate table header for the "x" column
      const xHeader = document.createElement('th');
      xHeader.textContent = '';
      xHeader.style.width = '4%'; // X column gets minimal space
      headerRow.appendChild(xHeader);
          table.appendChild(headerRow);
        }
      
      
      
      const teamData = dataArray[teamIndex];
      const dataRow = document.createElement('tr');
      // Store the player index directly in the row as a data attribute
      dataRow.setAttribute('data-player-index', teamIndex);
      
      // First cell: team name, league, season
      const tdTeam = document.createElement('td');
      tdTeam.classList.add(color);
      tdTeam.style.textAlign = 'left';
      tdTeam.style.whiteSpace = 'normal';
      tdTeam.style.overflow = 'visible';
      tdTeam.style.textOverflow = 'clip';
      tdTeam.style.minHeight = '36px';
      tdTeam.style.lineHeight = '1.1';
      
      // Format team name: make trailing numeric part (e.g. '25/26') smaller
      const teamNameFromData = teamData[1];
      const nameMatch = teamNameFromData.match(/^(.*?)(\s+)(\d{2}\/\d{2})$/);
      let teamNameHTML;
      if (nameMatch) {
        teamNameHTML = `${nameMatch[1]}<span style=\"font-size:10px; display:inline-block; vertical-align:baseline;\">&nbsp;${nameMatch[3]}</span>`;
      } else {
        teamNameHTML = teamNameFromData;
      }
      
      tdTeam.innerHTML = `
        <div style=\"font-size:13px; white-space:nowrap;\">${teamNameHTML}</div>
        <div style=\"font-size:10px; color:#777; margin-top:0px; font-weight:normal;\">${teamData[2]}, ${teamData[3]}</div>
      `;
      dataRow.appendChild(tdTeam);
      
      // Metrics columns (percentiles)
      for (let i = 4; i <= 10; i++) {
        const td = document.createElement('td');
        const value = parseFloat(teamData[i]) * 100;
        td.textContent = value.toFixed(1);
        td.style.fontWeight = '500';
        td.classList.add(color);
        dataRow.appendChild(td);
      }
      
      // Add a separate table cell for the "x" column
      const xCell = document.createElement('td');
      
      // Create a wrapper div for the button to contain the larger touch area
      const buttonWrapper = document.createElement('div');
      buttonWrapper.style.position = 'relative';
      buttonWrapper.style.width = '100%';
      buttonWrapper.style.height = '100%';
      buttonWrapper.style.display = 'flex';
      buttonWrapper.style.alignItems = 'center';
      
      const xButton = document.createElement('button');
      xButton.textContent = 'x';
      xButton.style.backgroundColor = 'transparent';
      xButton.style.border = 'none';
      xButton.style.color = '#999';
      xButton.style.fontSize = '14px';
      xButton.style.cursor = 'pointer';
      xButton.style.width = '4px';
      xButton.style.height = '24px';
      xButton.style.borderRadius = '50%';
      xButton.style.display = 'flex';
      xButton.style.alignItems = 'center';
      xButton.style.justifyContent = 'center';
      xButton.style.transition = 'all 0.2s';
      xButton.style.position = 'relative';
      xButton.style.zIndex = '1'; // Ensure the visible button is above the invisible touch area
      
      // Create an invisible touch target that's much larger but doesn't affect layout
      const touchTarget = document.createElement('div');
      touchTarget.style.position = 'absolute';
      touchTarget.style.top = '-15px';
      touchTarget.style.left = '-15px';
      touchTarget.style.width = '44px';
      touchTarget.style.height = '44px';
      touchTarget.style.cursor = 'pointer';
      touchTarget.style.zIndex = '0'; // Place it behind the visible button

      // Event listener for both the visible button and invisible touch target
      const handleClick = function() {
        dataRow.remove(); // Remove the corresponding row from the table
        const radarPolygons = document.querySelectorAll(`.radarPolygon.${color}`);
        const radarLines = document.querySelectorAll(`.radarLines.${color}`);
        const radarCircles = document.querySelectorAll(`.radarCircle.${color}`);
      
        radarPolygons.forEach((polygon) => polygon.remove()); // Remove radar polygons with the specified color
        radarLines.forEach((line) => line.remove()); // Remove radar lines with the specified color
        radarCircles.forEach((circle) => circle.remove()); // Remove radar circles with the specified color
        const remainingRows = document.querySelectorAll('.metrics-table tr:not(:first-child)');

    
        if (remainingRows.length > 0) {
            const lastRow = remainingRows[remainingRows.length - 1];
            const lastPlayerIndex = lastRow.getAttribute('data-player-index');
            if (lastPlayerIndex !== null) {
                const lastPlayerData = dataArray[parseInt(lastPlayerIndex)];
                if (lastPlayerData) {
                    updateSimilarPlayers(lastPlayerData);
                }
            }
        } else {
            // Hide the entire table when all teams are removed
            const resultsTable = document.getElementById('resultsTable');
            if (resultsTable) {
                resultsTable.style.display = 'none';
            }
            const similarPlayersContainer = document.getElementById('similarPlayersContainer');
            if (similarPlayersContainer) {
                similarPlayersContainer.innerHTML = '';
            }
        }
      };
      
      xButton.addEventListener('click', handleClick);
      touchTarget.addEventListener('click', handleClick);
      
      // Assemble the components
      buttonWrapper.appendChild(touchTarget);
      buttonWrapper.appendChild(xButton);
      xCell.appendChild(buttonWrapper);
      dataRow.appendChild(xCell);
      
      table.appendChild(dataRow);
      
      if (!headersExist) {
        resultsTable.appendChild(table);
      }

   const combResults = dataArray[teamIndex].join(', ');
 
 
 
   const outerRadius = 190;
   const center = [0, 0];
   const angles = [
     0,
     (2 * Math.PI) / 7,
     (4 * Math.PI) / 7,
     (6 * Math.PI) / 7,
     (8 * Math.PI) / 7,
     (10 * Math.PI) / 7,
     (12 * Math.PI) / 7
   ];
 
   function axisValueToCartesian(axis, value) {
     let angle = angles[axis - 1];
     angle += (2 * Math.PI / 7) * 0.2;
     const x = 190 * value * Math.cos(angle);
     const y = 190 * value * Math.sin(angle);
     return { x, y };
   }
 
   const svg = document.querySelector('.radar');
   const radarWrapper = svg.appendChild(
     document.createElementNS('http://www.w3.org/2000/svg', 'g')
   );
   radarWrapper.setAttribute('transform', 'translate(379.77,225.77)');
   radarWrapper.innerHTML = '';
 
   const data = [];
   const rowCols = combResults.split(',');
   for (let i = 4; i < rowCols.length; i++) {
     data.push({ axis: i - 3, value: parseFloat(rowCols[i]) });
   }
 
   const points = data
     .map(({ axis, value }) => {
       const { x, y } = axisValueToCartesian(axis, value);
       return `${x},${y}`;
     })
     .join(' ');
 
   const polyline = document.createElementNS(
     'http://www.w3.org/2000/svg',
     'polyline'
   );
   polyline.setAttribute('class', `radarLines ${color}`);
   polyline.setAttribute('points', `${points} ${points.split(' ')[0]}`);
   polyline.setAttribute('stroke-width', '3');
   polyline.setAttribute('fill', 'none');
   radarWrapper.appendChild(polyline);
 
   const polygon = document.createElementNS(
     'http://www.w3.org/2000/svg',
     'polygon'
   );
   polygon.setAttribute('class', `radarPolygon ${color}`);
   polygon.setAttribute('points', points);
   polygon.style.fillOpacity = '0.2';
   radarWrapper.appendChild(polygon);
 
   data.forEach(({ axis, value }) => {
     const { x, y } = axisValueToCartesian(axis, value);
     const circle = document.createElementNS(
       'http://www.w3.org/2000/svg',
       'circle'
     );
     circle.setAttribute('class', `radarCircle ${color}`);
     circle.style.fillOpacity = '0.86';
     circle.setAttribute('r', '7');
     circle.setAttribute('cx', x);
     circle.setAttribute('cy', y);
     radarWrapper.appendChild(circle);
   });
 }
 
 
 
   const teamNames = new Set();
 
   function createTableForTeam1() {
      const searchInput = document.getElementById('searchInput1');
      const searchButton = document.getElementById('searchButton1');
      const resultsTable = document.getElementById('resultsTable');
      const teamNamesList = document.createElement('ul');
      teamNamesList.style.fontFamily = 'Arial, sans-serif';
      teamNamesList.style.listStyleType = 'none';
      teamNamesList.style.paddingLeft = '9px';
      resultsTable.appendChild(teamNamesList);
      let searchCounter = 0;
    
      searchButton.addEventListener('click', function () {
        const searchQuery = searchInput.value;
        const results = search(searchQuery);
    
        // Reset the toggle state before performing a new search
        const radarPolygons = document.querySelectorAll('.radarPolygon');
        radarPolygons.forEach(polygon => {
          polygon.style.fill = '';
        });
    
        
        if (results) {
          const teamId = parseInt(results[0]);
          const teamName =
            results[1] + ' (' + results[2] + ', ' + results[3] + ') - ' + results[11] + ' min';
          const color = colorClasses[searchCounter % colorClasses.length];
    
          createTable(teamName, teamId - 1, color);
    
          searchCounter++;
        }
    
      updateMatchingNames();
      });
    }
    
    createTableForTeam1();


 const similarPlayersContainer = document.createElement("div");
 similarPlayersContainer.id = "similarPlayersContainer";
 const insertHere = document.getElementById("insertHere");
 insertHere.appendChild(similarPlayersContainer);
 
 let colorIndex = 0; // Initialize color index
 
 searchButton1.addEventListener("click", function() {
const searchQuery = searchInput.value;
const searchedPlayer = search(searchQuery);

if (searchedPlayer.length > 0) {
    const searchedPlayerData = searchedPlayer[0];
    updateSimilarPlayers(searchedPlayerData);
    colorIndex++;
}

searchInput.value = '';
updateMatchingNames();
});

function updateSimilarPlayers(playerData) {
const searchedPlayerIndex = parseInt(playerData[0]) - 1;
const similarPlayers = [];

// Find the color class of the LAST player from their row in the table
const playerRows = document.querySelectorAll('.metrics-table tr:not(:first-child)');
let playerColor = '';
if (playerRows.length > 0) {
    const lastPlayerRow = playerRows[playerRows.length - 1];
    const lastPlayerCell = lastPlayerRow.querySelector('td:first-child');
    // Get all color classes from the element
    const classes = Array.from(lastPlayerCell.classList);
    // Find the color class (starts with 'result-color-')
    playerColor = classes.find(cls => cls.startsWith('result-color-'));
}

for (let i = 0; i < dataArray.length; i++) {
    if (i !== searchedPlayerIndex) {
        const difference = calculateEuclideanDifference(playerData, dataArray[i]);
        similarPlayers.push({ index: i, difference: difference });
    }
}

similarPlayers.sort((a, b) => a.difference - b.difference);
const mostSimilarPlayers = similarPlayers.slice(0, 5);

const similarPlayersContainer = document.getElementById('similarPlayersContainer');
similarPlayersContainer.innerHTML = ''; // Clear existing content

const similarPlayerTable = document.createElement("table");
similarPlayerTable.classList.add("similar-table");

const headerRow = document.createElement("tr");
const headerCell = document.createElement("th");
headerCell.setAttribute("colspan", "5");
// Use the last player's color class instead of the first one
headerCell.classList.add(playerColor || colorClasses[colorIndex % colorClasses.length]);
headerRow.appendChild(headerCell);
similarPlayerTable.appendChild(headerRow);

// Use the exact playerData from the search to ensure consistency
const playerName = playerData[1];
const playerAge = playerData[3];
headerCell.classList.add("similar-text");
headerCell.innerHTML = `<span data-i18n="similar.to">Similar data to</span> ${playerName}, ${playerAge}`;

const similarPlayerRow = document.createElement("tr");

for (let i = 0; i < mostSimilarPlayers.length; i++) {
    const playerIndex = mostSimilarPlayers[i].index;
    const similarPlayerName = dataArray[playerIndex][1];
    const similarPlayerAge = dataArray[playerIndex][3];
    const similarPlayerTeam = dataArray[playerIndex][2];      
    const playerCell = document.createElement("td");
    playerCell.textContent = similarPlayerName + ", " + similarPlayerAge;
    playerCell.style.fontSize = "10.8px";
    playerCell.style.cursor = "pointer";

    playerCell.addEventListener("click", function() {
      const searchInput = document.getElementById('searchInput1');
      const searchButton = document.getElementById('searchButton1');
      // Include the age and team to ensure we get the correct player
      searchInput.value = `${similarPlayerName},${similarPlayerAge},${similarPlayerTeam}`;
      searchButton.click();
    });

    similarPlayerRow.appendChild(playerCell);
}

similarPlayerTable.appendChild(similarPlayerRow);
similarPlayersContainer.appendChild(similarPlayerTable);
}