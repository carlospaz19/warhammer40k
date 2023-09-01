// Arreglo para almacenar los personajes
let characters = [];

// Referencias a elementos del DOM
const form = document.getElementById("character-form");
const characterList = document.getElementById("characters");
const characterSection = document.getElementById("character-list")
const characterDetails = document.getElementById("character-details"); // Cambiado el ID aquí
const modal = document.getElementById("myModal");
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

// Función para crear un nuevo personaje
function createCharacter(name, chapter, weapon) {
    hideAlert();
    const storedCharacters = localStorage.getItem('characters')
		if (storedCharacters) {
			characters = JSON.parse(storedCharacters)
		} else {
			characters = []
		}
    // Agregar el nuevo personaje si el nombre no está repetido
    characters.push({ name, chapter, weapon });
    localStorage.setItem('characters', JSON.stringify(characters))
    displayCharacters();
    nameInput.value = "";
}

// Función para mostrar la lista de personajes
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
        li.addEventListener("click", () => showDetails(index));
        characterList.appendChild(li);
    });

    const sectionList = document.getElementById(`character-list`);
    sectionList.scrollIntoView({ behavior: "smooth" });
}

// Función para mostrar los detalles de un personaje y activar la edición
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

    // Agregar manejador para el botón de edición
    const editButton = document.getElementById("edit-button");
    editButton.addEventListener("click", () => editCharacter(index));

    const deleteButton = document.getElementById("delete-button");
    deleteButton.addEventListener("click", () => deleteCharacter(index));

    characterDetails.style.display = "block";

    // Hacer scroll hacia abajo para mostrar los detalles del personaje
    const detailsContainer = document.getElementById(`character-details-${index}`);
    detailsContainer.scrollIntoView({ behavior: "smooth" });
}

// Función para editar los detalles de un personaje
function editCharacter(index) {
    const character = characters[index];
    characterDetails.innerHTML = `
        <div class="edit-container">
        <h2>Edit ${character.name}</h2>
        <label for="new-name">Name:</label>
        <input type="text" id="new-name" value="${character.name}" required>
        <label for="new-chapter">Chapter:</label>
        <select id="new-chapter">
            <option ${character.chapter === "Space Marine" ? "selected" : ""}>Space Marine</option>
            <option ${character.chapter === "Adeptus Mechanicus" ? "selected" : ""}>Adeptus Mechanicus</option>
            <option ${character.chapter === "Adeptus Titanicus" ? "selected" : ""}>Adeptus Titanicus</option>
            <option ${character.chapter === "Adeptus Custodes" ? "selected" : ""}>Adeptus Custodes</option>
        </select>
        <label for="new-weapon">Weapon:</label>
        <select id="new-weapon">
            <option ${character.weapon === "Bolter" ? "selected" : ""}>Bolter</option>
            <option ${character.weapon === "Power Sword" ? "selected" : ""}>Power Sword</option>
            <option ${character.weapon === "Missile Launcher" ? "selected" : ""}>Missile Launcher</option>
            <option ${character.weapon === "Flamer" ? "selected" : ""}>Flamer</option>
        </select>
        <button id="update-button">Repair</button>
        </div>
    `;

    // Agregar manejador para el botón de actualización
    const updateButton = document.getElementById("update-button");
    updateButton.addEventListener("click", () => updateCharacter(index));
}

function deleteCharacter(index) {
    characters.splice(index, 1);

    // Actualizar los datos en el almacenamiento local
    localStorage.setItem("characters", JSON.stringify(characters));

    displayCharacters();
    characterDetails.style.display = "none";
    hideAlert();
}

// Función para actualizar los detalles de un personaje
function updateCharacter(index) {
    const character = characters[index];
    const originalName = character.name;

    const newNameInput = document.getElementById("new-name");
    const newChapter = document.getElementById("new-chapter").value;
    const newWeapon = document.getElementById("new-weapon").value;

    if (newNameInput.value === "") {
        showAlert("You heartless heretic!!! Enter a name!!!");
        newNameInput.value = originalName;
        return;
    }

    // Verificar si el nuevo nombre ya está en la lista
    const nameExists = characters.some((char, i) => i !== index && char.name === newNameInput.value);
    if (nameExists) {
        showAlert("Don't steal your brother's soul! Try a different name.");
        newNameInput.value = originalName;
        return;
    }

    character.name = newNameInput.value;
    character.chapter = newChapter;
    character.weapon = newWeapon;

    // Actualizar los datos en el almacenamiento local
    characters[index] = character;
    localStorage.setItem("characters", JSON.stringify(characters));

    displayCharacters();
    showDetails(index);
}

function deleteAllCharacters() {
    characters = []; // Vaciar el arreglo de personajes
    localStorage.removeItem('characters');
    displayCharacters(); // Actualizar la visualización de personajes
    characterDetails.style.display = "none"; // Ocultar los detalles del personaje
    hideAlert();
    showAlert("The planet's fate was sealed in fire and brimstone");
}

// Función para mostrar mensajes de alerta
function showAlert(message) {

    modalMessage.textContent = message;
    modal.style.display = "block";

    // Agregar evento para cerrar el modal al hacer clic en la "x"
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.addEventListener("click", () => {
        hideAlert();
    });

    setTimeout(() => {
        hideAlert();
    }, 5000);
}

// Función para ocultar mensajes de alerta
function hideAlert() {
    modal.style.display = "none";
}

function showListSection(){
    characterSection.classList.remove("hidden");
}

function hideListSection(){
    characterSection.classList.add("hidden");
}

// Manejador de envío de formulario
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
        return; // Detener la creación del personaje
    }
    createCharacter(name, chapter, weapon);
    form.reset();
});

nameInput.addEventListener("input", hideAlert);
deleteAllButton.addEventListener("click", deleteAllCharacters);

// Inicialización: Puedes agregar personajes de ejemplo aquí
//createCharacter("Titus", "Space Marine", "Power Sword");

// Ocultar la sección character details al cargar la página
characterDetails.style.display = "none";