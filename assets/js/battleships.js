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