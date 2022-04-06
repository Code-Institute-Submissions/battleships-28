// Game object
let game = {
    toggleGameOptions: () => {
        let gameOptionsScreen = document.querySelector("#game-options-screen")
        if(gameOptionsScreen.className){
            gameOptionsScreen.classList.remove("hide")
        }
        else{
            gameOptionsScreen.classList.add("hide")
        }
    }
}

// function to add event listeners without creating global variables
const addListener = (id,typeOfEvent,eventLogic) => {
    let target = document.getElementById(id)
    target.addEventListener(typeOfEvent, eventLogic)
}

// Add functionality to game start up button in main menu.
addListener("game-setup-button", "click", game.toggleGameOptions);
