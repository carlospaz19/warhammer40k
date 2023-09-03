// Array for characters
let characters = [];

// References to DOM elements
const form = document.getElementById("character-form");
const characterList = document.getElementById("characters");
const characterSection = document.getElementById("character-list")
const characterDetails = document.getElementById("character-details"); // Cambiado el ID aquí
const modal = document.getElementById("myModal");
const closeModal = document.getElementById("closeModal");
const modalMessage = document.getElementById("modal-message");
const deleteAllButton = document.getElementById("delete-all-button");
const nameInput = document.getElementById("name");

initializeCharacters();

function initializeCharacters() {
    const storedCharacters = localStorage.getItem("characters");
    if (storedCharacters) {
        characters = JSON.parse(storedCharacters);
    } else {
        characters = [];
    }
    displayCharacters();
}

// Showing character list
function displayCharacters() {
    const storedCharacters = localStorage.getItem("characters");
    if (storedCharacters) {
        characters = JSON.parse(storedCharacters);
    } else {
        characters = [];
    }

    if (characters.length !== 0) {
        showListSection();
    } else {
        hideListSection();
        return;
    }

    characterList.innerHTML = "";
    characters.forEach((character, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img id="imperium_logo" src="images/imperium_logo.png" alt="Imperium Logo">
            <span>${character.name}</span>
        `
        li.addEventListener("click", () => nameInput.value = "");
        li.addEventListener("click", () => showDetails(index));
        characterList.appendChild(li);
    });

    const sectionList = document.getElementById(`character-list`);
    sectionList.scrollIntoView({ behavior: "smooth" });
}

// Creating a new character
function createCharacter(name, chapter, weapon) {
    hideAlert();
    const storedCharacters = localStorage.getItem('characters')
		if (storedCharacters) {
			characters = JSON.parse(storedCharacters)
		} else {
			characters = []
		}
    // Adding a new character if is not repeated
    characters.push({ name, chapter, weapon });
    localStorage.setItem('characters', JSON.stringify(characters))
    displayCharacters();
    nameInput.value = "";
}

// Showing character details
function showDetails(index) {
    const character = characters[index];
    characterDetails.innerHTML = `
    <div class="details-container" id="character-details-${index}">
        <h2>Adeptus Details</h2>
            <h3>${character.name}</h3>
            <p>Chapter: ${character.chapter}</p>
            <p>Weapon: ${character.weapon}</p>
            <button id="edit-button">Repair</button>
            <button id="delete-button">Destroy!</button>
    </div>
    `;

    // Edit Character when the repair button is pressed
    const editButton = document.getElementById("edit-button");
    editButton.addEventListener("click", () => editCharacter(index));

    // Delete Character when the destroy button is pressed
    const deleteButton = document.getElementById("delete-button");
    deleteButton.addEventListener("click", () => deleteCharacter(index));

    characterDetails.style.display = "block";

    // Scroll into view for character details
    const detailsContainer = document.getElementById(`character-details`);
    detailsContainer.scrollIntoView({ behavior: "smooth" });
}

function editCharacter(index) {
    const character = characters[index];
    characterDetails.innerHTML = `
        <div class="edit-container">
            <h2>Edit ${character.name}</h2>
            <div class="edit-elements">
                <div class="form-group">
                    <label for="new-name">Name:</label>
                    <input type="text" id="new-name" value="${character.name}" required>
                </div>
                <div class="form-group">
                    <label for="new-chapter">Chapter:</label>
                    <select id="new-chapter">
                        <option ${character.chapter === "Space Marine" ? "selected" : ""}>Space Marine</option>
                        <option ${character.chapter === "Adeptus Mechanicus" ? "selected" : ""}>Adeptus Mechanicus</option>
                        <option ${character.chapter === "Adeptus Titanicus" ? "selected" : ""}>Adeptus Titanicus</option>
                        <option ${character.chapter === "Adeptus Custodes" ? "selected" : ""}>Adeptus Custodes</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="new-weapon">Weapon:</label>
                    <select id="new-weapon">
                        <option ${character.weapon === "Bolter" ? "selected" : ""}>Bolter</option>
                        <option ${character.weapon === "Power Sword" ? "selected" : ""}>Power Sword</option>
                        <option ${character.weapon === "Missile Launcher" ? "selected" : ""}>Missile Launcher</option>
                        <option ${character.weapon === "Flamer" ? "selected" : ""}>Flamer</option>
                    </select>
                </div>
            </div>
            <button id="update-button">Repair</button>
        </div>
    `;

    // Update Character is called when the Repair button is pressed
    const updateButton = document.getElementById("update-button");
    updateButton.addEventListener("click", () => updateCharacter(index));
}

function deleteCharacter(index) {
    characters.splice(index, 1);

    // Updating local storage list
    localStorage.setItem("characters", JSON.stringify(characters));

    displayCharacters();
    characterDetails.style.display = "none";
    hideAlert();
    showAlert("In the name of the GOD Emperor, this brother has been purged");
    const characterForm = document.getElementById(`character-form`);
    characterForm.scrollIntoView({ behavior: "smooth" });
}

function deleteAllCharacters() {
    // Empty character array
    characters = [];
    localStorage.removeItem('characters');
    // Updating characters to display
    displayCharacters();
    //Hide character details
    characterDetails.style.display = "none";
    nameInput.addEventListener("click", ()=> nameInput.value="");
    hideAlert();
    showAlert("The planet's fate was sealed in fire and brimstone");
    //Scroll into view for the character form
    const characterForm = document.getElementById(`character-form`);
    characterForm.scrollIntoView({ behavior: "smooth" });
}

function updateCharacter(index) {
    const character = characters[index];
    const originalName = character.name;
    const originalChapter = character.chapter;
    const originalWeapon = character.weapon;

    const newNameInput = document.getElementById("new-name");
    const newChapter = document.getElementById("new-chapter").value;
    const newWeapon = document.getElementById("new-weapon").value;

    // If the field value is empty, alert message is shown
    if (newNameInput.value === "") {
        showAlert("You heartless heretic!!! Enter a name!!!");
        newNameInput.value = originalName;
        return;
    }

    // Verifying if there is an existing name in the list
    const nameExists = characters.some((char, i) => i !== index && char.name === newNameInput.value);
    if (nameExists) {
        showAlert("Don't steal your brother's soul! Try a different name.");
        newNameInput.value = originalName;
        return;
    }
    else{
        character.name = newNameInput.value;
        character.chapter = newChapter;
        character.weapon = newWeapon;

        // Updating local storage data
        characters[index] = character;
        localStorage.setItem("characters", JSON.stringify(characters));

        displayCharacters();    
        showDetails(index);

        // If any of the character data is updated, alert message is shown
        if(character.name !== originalName || character.chapter !== originalChapter || character.weapon !== originalWeapon){
            showAlert("In the name of the GOD Emperor, this brother has been upgraded")
            const sectionDetails = document.getElementById(`character-details`);
            sectionDetails.scrollIntoView({ behavior: "smooth" });
        }
    }
}

function showAlert(message) {

    modalMessage.textContent = message;
    modal.style.display = "block";

    // Adding event to close modal with 'X'
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.addEventListener("click", () => {
        hideAlert();
    });
}

function hideAlert() {
    modal.style.display = "none";
}

function showListSection(){
    characterSection.classList.remove("hidden");
}

function hideListSection(){
    characterSection.classList.add("hidden");
}

function closeCharacterDetails(){
    characterDetails.style.display = "none";
}

// Form manager
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const chapter = document.getElementById("chapter").value;
    const weapon = document.getElementById("weapon").value;

    if(name === ""){
        showAlert("SUCH HERECY!!! Enter a real name");
        return;
    }

    const existingCharacter = characters.find(character => character.name === name);
    if (existingCharacter) {
        showAlert("Cloning is forbidden science! Try a different brother's name.");
        nameInput.value = "";
        return;
    }
    createCharacter(name, chapter, weapon);
    form.reset();
});

nameInput.addEventListener("click", closeCharacterDetails);
nameInput.addEventListener("input", hideAlert);
deleteAllButton.addEventListener("click", deleteAllCharacters);

// Hide section when the page is reloaded
characterDetails.style.display = "none";

// Addign event when pressing outside the modal
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
  
// Addign event when pressing 'X' modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});