/* jshint esversion: 8 */
// Game object
let game = {
    mainMenu: document.querySelector("#main-menu"),
    gameBoard: document.querySelector("#game-board"),
    gameScreen: document.querySelector("#game-screen"),
    gameBoardNums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    gameBoardLets: ["A","B","C","D","E","F","G","H","I","J"],
    ships: document.querySelectorAll(".ship"),
    coordinates: document.getElementsByClassName("coordinate"),
    draggedShip: document.querySelector(".dragging"),
    getShipCoordinates: (coordinate, ship) => {
        // Return all the coordinates taken up by the ship.
        const shipSize = game.fleet[ship.id].size
        let currentCoordinates = coordinate.id;
        let shipCoordinates = [currentCoordinates];
        for(let i = 0; i < shipSize-1; i++){
            //Javascript automatically converts back to strings here! Because we add string and number together!
            let currentNumberCoordinate = parseInt(currentCoordinates[1]);
            let nextNumberCoordinate = currentNumberCoordinate + 1;
            let nextCoordinates = currentCoordinates[0] + nextNumberCoordinate;
            shipCoordinates.push(nextCoordinates);
            currentCoordinates = nextCoordinates;
            // let letCharCode = currentCoordinates[0].charCodeAt(0)
            // let numCharCode = currentCoordinates[1].charCodeAt(0)
            // letCharCode++;
            // numCharCode++;
            // let nextCoordinateLet = String.fromCharCode(letCharCode);
            // let nextCoordinateNum = String.fromCharCode(numCharCode);
            // currentCoordinates[1] = nextCoordinateNum;
            // currentCoordinates.join()
        }
        return shipCoordinates;
    },
    getAllOccupiedCoordinates: () => {
        let allOccupiedCoordinates = [];
        for(ship in game.fleet){
            allOccupiedCoordinates.push(...game.fleet[ship].hitBox);
        }
        console.log(allOccupiedCoordinates)
        return allOccupiedCoordinates;
    },
    CheckIfOccupied:(allOccupiedCoordinates,requestedCoordinates) => {
        let access = true
        requestedCoordinates.forEach(coordinate => {
            if(allOccupiedCoordinates.includes(coordinate)){
                access = false}
                return access
        })

        return access
    },
    fleet: {
        carrier: {
            name: "Carrier",
            size: 5,
            rotated: false,
            hitBox: [],
            shipImg: () => {
                const shipImg = document.createElement("img");
                shipImg.src = "assets/images/carrier.png"
                shipImg.classList.add("ship-dragged-image");
                return shipImg
            }
        },
        battleship: {
            name: "Battleship",
            size: 4,
            rotated: false,
            hitBox: [],
            shipImg: () => {
                const shipImg = document.createElement("img");
                shipImg.src = "assets/images/battleship.webp"
                shipImg.classList.add("ship-dragged-image");
                return shipImg
            }
        },
        cruiser: {
            name: "Cruiser",
            size: 3,
            rotated: false,
            hitBox: [],
            shipImg: () => {
                const shipImg = document.createElement("img");
                shipImg.src = "assets/images/cruiser.png"
                shipImg.classList.add("ship-dragged-image");
                return shipImg
            }
        },
        submarine: {
            name: "Submarine",
            size: 3,
            rotated: false,
            hitBox: [],
            shipImg: () => {
                const shipImg = document.createElement("img");
                shipImg.src = "assets/images/submarine.png"
                shipImg.classList.add("ship-dragged-image");
                return shipImg
            }
        },
        destroyer: {
            name: "Destroyer",
            size: 2,
            rotated: false,
            hitBox: [],
            shipImg: () => {
                const shipImg = document.createElement("img");
                shipImg.src = "assets/images/destroyer.png"
                shipImg.className = "ship-dragged-image";
                return shipImg
            }
        }
    },
    dragShips: () => {
        //Add drag event listeners to each ship
        // WHEN DRAG STARTS
        game.ships.forEach(ship => {
            ship.addEventListener("dragstart", () => {
                ship.classList.add("dragging");
                const draggedShip = document.querySelector(".dragging")
                console.log(game.fleet[draggedShip.id].hitBox)
                //clear reset ships coordinate hitbox (until it's dropped again to pick up new coordinates)
                game.fleet[draggedShip.id].hitBox = [];
            });
            // WHEN DRAG FINISHES
            ship.addEventListener("dragend", () => {
                ship.classList.remove("dragging");
            })
        });
        //Add dragEnter, dragLeave, DragOver and dragDropevent listeners to coordinates to interact with ship.
        Array.from(game.coordinates).forEach(coordinate => {
            // WHEN SHIP IS DRAGGED INTO COORDINATE
            coordinate.addEventListener("dragenter", (e) => {
                //If coordinate contains image/ship, then return
                if(!!coordinate.querySelector("img")){
                    return
                }
                //Declare variables for interacting with ship in coordinate.
                const draggedShip = document.querySelector(".dragging")
                const allOccupiedCoordinates = game.getAllOccupiedCoordinates();
                const currentlyOccupiedCoordinates = game.getShipCoordinates(coordinate, draggedShip);
                //If currently occupied coordinates of the dragged ship interfere with any occupied coordinates, return.
                if(!game.CheckIfOccupied(allOccupiedCoordinates,currentlyOccupiedCoordinates)){
                    return
                }
                const shipSize = game.fleet[draggedShip.id].size
                const shipSpan = parseInt(coordinate.style.gridColumnStart) + shipSize;
                //When entering coordinate, coordinate grows to length/height of the ships total size.
                coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${coordinate.style.gridRowEnd}/${shipSpan}`
                //Ship then grows to length of newly sized coordinate.
                draggedShip.style.width = `${coordinate.offsetWidth * shipSize}px`
                draggedShip.style.height = `${coordinate.offsetHeight}px`
                //Hover effect upon entering coordinates
                //First, remove other colors from coordinates (Used to prevent a bug). Later, can replace this with user color. //May be able to do this more efficiently with dragLeave/drop.
                Array.from(game.coordinates).forEach(coordinate => coordinate.style.backgroundColor = "white");
                //Get occupied coordinates and change color of them. Later, can replace this with user color.
                let occupiedCoordinates = game.getShipCoordinates(coordinate,draggedShip);
                occupiedCoordinates.forEach(coordinate => {
                    let space = document.getElementById(coordinate)
                    space.style.backgroundColor = "blue";
                })                       
            })
            // WHILE SHIP IS DRAGGED OVER COORDINATE
            coordinate.addEventListener("dragover", e => {
                //Used to allow dragDrop event to happen. 
                e.preventDefault();
            })
            // WHEN SHIP IS DRAGGED OUT OF COORDINATE
            coordinate.addEventListener("dragleave", () => {
                //If coordinate contains image/ship, then return
                if(!!coordinate.querySelector("img")){
                    return
                }
                //Declare variables for interacting with ship in coordinate.
                const draggedShip = document.querySelector(".dragging");
                const allOccupiedCoordinates = game.getAllOccupiedCoordinates();
                const currentlyOccupiedCoordinates = game.getShipCoordinates(coordinate, draggedShip);
                //If currently occupied coordinates of the dragged ship interfere with any occupied coordinates, return.
                if(!game.CheckIfOccupied(allOccupiedCoordinates,currentlyOccupiedCoordinates)){
                    return
                }
                console.log("dragLeave", coordinate.id, coordinate.style.gridArea, game.fleet[draggedShip.id].hitBox);
                
            })
            // WHEN SHIP IS DROPPED IN TO COORDINATE
            coordinate.addEventListener("drop", () => {
                //If coordinate contains image/ship, then return
                if(!!coordinate.querySelector("img")){
                    return
                }
                console.log("drop has fired")
                const draggedShip = document.querySelector(".dragging")
                //If currently occupied coordinates of the dragged ship interfere with any occupied coordinates, return.
                const allOccupiedCoordinates = game.getAllOccupiedCoordinates();
                const currentlyOccupiedCoordinates = game.getShipCoordinates(coordinate, draggedShip);
                if(!game.CheckIfOccupied(allOccupiedCoordinates,currentlyOccupiedCoordinates)){
                    return
                }
                //Attach ship to coordinate
                coordinate.appendChild(draggedShip);
                //get array of coordinates that ship occupies, and add contents of array to ship's hitbox.
                let shipOccupiedCoordinates = game.getShipCoordinates(coordinate,draggedShip);
                game.fleet[draggedShip.id].hitBox.push(...shipOccupiedCoordinates)
                // Align ship with gridArea of the coordinate it is attached to.
                draggedShip.style.gridArea = `${1}/${1}/${2}/${2}`
                //Reset coordinate color to original when ship is dropped. Replace with user color choice later.
                shipOccupiedCoordinates.forEach(id => {
                    let space = document.getElementById(id)
                    space.style.backgroundColor = "white";
                })
            
            })
            
        })
        
    },
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
                coordinateText.textContent = game.gameBoardLets[i].concat(game.gameBoardNums[j]);
                coordinate.id = coordinateText.textContent;
                coordinate.classList.add("coordinate");
                coordinate.style.gridArea = `${coordinateRowStart}/${coordinateColStart}`;
                coordinateColStart++;
                coordinate.append(coordinateText);
                game.gameBoard.append(coordinate);
            }
            coordinateRowStart++
        };
        game.gameboardAutoResize();
        window.addEventListener("resize", game.gameboardAutoResize);
        game.dragShips();
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