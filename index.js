const COHORT = "2407-FTB-ET-WEB-PT";

const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");

const addPartiesForm = document.querySelector("#addParties");
addPartiesForm.addEventListener("submit", addParties);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();

/**
 * Update state with recipes from API
 */
async function getParties() {
  // TODO
  try {
    const response = await fetch(API_URL);
    //console.log(response);
    const json = await response.json();
    console.log(json);
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Handle form submission for adding a recipe
 * @param {Event} event
 */
async function addParties(event) {
  // This function is essentially just a wrapper around `createRecipe`,
  event.preventDefault();

  await createParties(
    addPartiesForm.name.value,
    addPartiesForm.description.value,
    addPartiesForm.location.value,
    addPartiesForm.date.value,
    
  );
}

/**
 * Ask API to create a new recipe and rerender
 * @param {string} name name of recipe
 * @param {string} location url of recipe image
 * @param {string} description description of the recipe
 * @param {string} date date of the recipe
 */
async function createParties(name, description, location, date) {
  // TODO
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, location, date: new Date(date)}),
    });
    const json = await response.json();
    console.log(json);

    render();
  } catch (error) {
    console.error(error);
  }
}


/**
 * Ask API to delete a party and rerender
 * @param {number} id id of party to delete
 */
async function deleteParties(id) {
  // TODO
  console.log("id", id);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("recipe could not be deleted");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render parties from state
 */
function renderParties() {
  if (!state.parties.length) {
    partiesList.innerHTML =
      /*html*/
      `<li>No party found.</li>`;
    return;
  }
  // This uses a combination of `createElement` and `innerHTML`;
  // You can use either one, but `createElement` is
  // more flexible and `innerHTML` is more concise.
  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");
    partyCard.innerHTML = /*html*/ `
      <h2>${party.name}</h2>
      <img src="${party.imageUrl}" alt="${party.name}" />
      <div>${party.location}</div>
      <div>${party.date}</div>
      <p>${party.description}</p>
    `;

    // We use createElement because we need to attach an event listener.
    // If we used `innerHTML`, we'd have to use `querySelector` as well.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    // Access the correct recipe id
    deleteButton.addEventListener("click", () => deleteParties(party.id));

    return partyCard;
  });
  partiesList.replaceChildren(...partyCards);
}