const DATABASE_INTERFACE = 'http://localhost:8080';

function fetchJson(address) {
  return fetch(address, {
    method: 'GET',
    headers: {
     'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

function fetchPage(page) {
  return fetchJson(DATABASE_INTERFACE + '/json/max_players/' + page);
}

function fetchNumberOfPages() {
  return fetchJson(DATABASE_INTERFACE + '/json/max_players/pages');
}

function createItem(jsonItem) {
  const item = document.createElement('tr');
  item.classList.add('playerScoreItem');
  const position = document.createElement('td');
  position.textContent = jsonItem['position'];
  item.appendChild(position);
  const username = document.createElement('td');
  username.title = jsonItem['uuid'];
  username.textContent = jsonItem['username'];
  item.appendChild(username);
  const score = document.createElement('td');
  score.textContent = jsonItem['score'];
  item.appendChild(score);
  return item;
}

function clearChildsOfClass(className, parent) {
  for (const i in parent.children) {
    const child = parent.children[i];
    if (child.className == 'playerScoreItem') {
      parent.removeChild(child);
    }
  }
}



async function insertItems(jsonPromise) {
  const leaderboard = document.getElementById('leaderboard');
  if (leaderboard == null) {
    return;
  }
  clearChildsOfClass('playerScoreItem', leaderboard);
  const json = await jsonPromise;
  for (const i in json) {
    const playerScoreItem = json[i];
    const item = createItem(playerScoreItem);
    leaderboard?.appendChild(item);
  }
}

function generateButton(page, textContent, currentPage){
  const button = document.createElement("button");
  button.textContent = textContent;
  button.onclick = () => createTable(page);
  if(page === currentPage){
    button.id = "active button";
  }
  return button;
}

function generateButtons(page, totalPages){
  if(totalPages <= 1){
    return;
  }
  const buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = "";
  if(totalPages < 7){
    for(let i = 0; i < totalPages; i++){
      buttonContainer.appendChild(generateButton(i,i+1));
    }
    return;
  }
  buttonContainer.appendChild(generateButton(0,'1',page));
  for(let i = page-2; i < page + 3; i++){
    if(i <= 0 || i >= totalPages-1){
      continue;
    }
    buttonContainer.appendChild(generateButton(i,i+1,page));
  }
  buttonContainer.appendChild(generateButton(totalPages-1,totalPages,page));
}

async function createTable(page){
  insertItems(fetchPage(page));
  const totalPages = await fetchNumberOfPages();
  generateButtons(page, totalPages)
}

createTable(0);