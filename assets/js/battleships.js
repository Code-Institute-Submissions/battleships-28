// Game object
let game = {
    mainMenu: document.querySelector("#main-menu"),
    gameBoard: document.querySelector("#game-board"),
    gameScreen: document.querySelector("#game-screen"),
    gameBoardNums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    gameBoardLets: ["A","B","C","D","E","F","G","H","I","J"],
    gameboardAutoResize: () => {
        //Automatically convert all grid spaces to squares rather than rectangles by default
        let colLength = document.querySelector(".coordinate").offsetWidth
        game.gameBoard.style.gridAutoRows = `${colLength}px`
    },
    gameSetup: (e) => {
        // Prevent default action of beginGameButton
        e.preventDefault();
        //Declare variables for placement within grid.
        let numRowStart = 1;
        let numColStart = 2;
        let letRowStart = 2;
        let letColStart = 1;
        let coordinateRowStart = 2;
        let coordinateColStart;
        // Hide main menu and show gameScreen
        game.mainMenu.remove();
        game.gameScreen.classList.remove("hide");
        // For loops to create labels and coordinates
        for(let i = 0; i < game.gameBoardLets.length; i++) {
            //Create number labels
            let numberLabel = document.createElement("h3")
            numberLabel.classList.add("number-label");
            numberLabel.textContent = game.gameBoardNums[i];
            numberLabel.style.gridArea = `${numRowStart}/${numColStart}`
            //Create letter labels
            let letterLabel = document.createElement("h3")
            letterLabel.classList.add("letter-label");
            letterLabel.textContent = game.gameBoardLets[i];
            letterLabel.style.gridArea = `${letRowStart}/${letColStart}`
            //Attach labels to grid and increment necessary rows/columns
            game.gameBoard.append(numberLabel,letterLabel);
            numColStart++;
            letRowStart++;
            //Nested for loop - Create coordinates for game
            coordinateColStart = 2;
            for(let j = 0; j< game.gameBoardNums.length; j++){
                let coordinate = document.createElement("div")
                let coordinateText = document.createElement("h4");
                coordinate.classList.add("coordinate")
                coordinateText.textContent = game.gameBoardLets[i].concat(game.gameBoardNums[j]);
                coordinate.style.gridArea = `${coordinateRowStart}/${coordinateColStart}`;
                coordinateColStart++;
                coordinate.append(coordinateText);
                game.gameBoard.append(coordinate);
            }
            coordinateRowStart++
        };
        game.gameboardAutoResize();
        window.addEventListener("resize", game.gameboardAutoResize)

},
    toggleGameOptions: () => {
        let gameOptionsScreen = document.querySelector("#game-options-screen");
        if(gameOptionsScreen.className){
            gameOptionsScreen.classList.remove("hide");
        }
        else{
            gameOptionsScreen.classList.add("hide");
        }
        let beginGameButton = document.querySelector("#begin-game-button");
        beginGameButton.addEventListener("click", e => game.gameSetup(e))
    },
    toggleGameInstructions: () => {
        let gameInstructions = document.querySelector("#instructions");
        gameInstructions.showModal();
        let closeButton = document.querySelector("#instructions-close-button");
        closeButton.addEventListener("click", () => {
            gameInstructions.close()
        })
    }
}

// function to add event listeners without creating global variables
const addListener = (id,typeOfEvent,eventLogic) => {
    let element = document.getElementById(id)
    element.addEventListener(typeOfEvent, eventLogic)
}

// Add functionality to game start up button in main menu.
addListener("game-setup-button", "click", game.toggleGameOptions);

// Add functionality to instructions button in main menu.
addListener("instructions-button", "click", game.toggleGameInstructions);