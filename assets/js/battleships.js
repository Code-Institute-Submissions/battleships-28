/* jshint esversion: 8 */
// Game object
let game = {
    mainMenu: document.querySelector("#main-menu"),
    gameBoard: document.querySelector("#game-board"),
    gameScreen: document.querySelector("#game-screen"),
    fleetElem: () => document.querySelector("#fleet"),
    gameBoardNums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    gameBoardLets: ["A","B","C","D","E","F","G","H","I","J"],
    ships: document.querySelectorAll(".ship"),
    coordinates: document.getElementsByClassName("coordinate"),
    draggedShip: document.querySelector(".dragging"),
    getShipCoordinates: (coordinate, ship) => {
        // Return all the coordinates taken up by the ship.
        //Declare variables
        const shipSize = game.fleet[ship.id].size
        let currentCoordinates = coordinate.id;
        let shipCoordinates = [currentCoordinates];
        let testRegexLetters = /[A-J]/g
        let testRegexNumbers = /[0-9]+/g
        //Loop equalling to number of shipSize
        for(let i = 0; i < shipSize-1; i++){
            //Get number and letter/Letter charactercode
            let number = currentCoordinates.match(testRegexNumbers)
            let letter = currentCoordinates.match(testRegexLetters)
            let letCharCode = letter[0].charCodeAt(0)
            //Increment number
            number[0]++
            // letCharCode++
            //Create new set of coordinates and set currentCoordinates to the newly made coordinate. Next loop, currentCoordinates will be different.
            let nextNumber = number;
            let nextLetter = String.fromCharCode(letCharCode);
            currentCoordinates = nextLetter.concat(nextNumber);
            //Push currentCoordinates to shipCoordinates array.
            shipCoordinates.push(currentCoordinates);

        }
        return shipCoordinates;
    },
    getAllOccupiedCoordinates: () => {
        let allOccupiedCoordinates = [];
        for(ship in game.fleet){
            allOccupiedCoordinates.push(...game.fleet[ship].hitBox);
        }
        return allOccupiedCoordinates;
    },
    CheckIfOccupied:(allOccupiedCoordinates,requestedCoordinates) => {
        let access = true;
        const numRegex = /[0-9]+/g;
        requestedCoordinates.forEach(coordinate => {
            //If ship's requested coordinates is occupied by another ship, dragEvent listeners won't fire.
            if(allOccupiedCoordinates.includes(coordinate)){
                access = false;
            }
            //If ship's requested coordinates is outside grid, dragEvent listeners won't fire.
            else if(parseInt(coordinate.match(numRegex)) > 10){
                access = false;
            }
        })
        //If everything is ok, access remains true, and dragEvent listeners fire
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
    getRotatedArray: () => Object.keys(game.fleet).map(key => game.fleet[key].rotated),
    fleetAutoResize:() => {
        const rotatedShipExists = () => {
            //game.getRotatedArray() returns array of each ships rotated value - .some checks if there is at leaast one which is true.
            return game.getRotatedArray().some(value => {
                return value === true
        })
    }
        if(rotatedShipExists()){
            //Gets first ship that is rotated and sets height of fleet element to height of ships container
            let rotatedShip = document.getElementById(Object.keys(game.fleet)[game.getRotatedArray().indexOf(true)]);
            game.fleetElem().style.height = `${rotatedShip.parentElement.offsetWidth}px`;
            console.log(rotatedShip)
        }
        else{
            //Set fleet height to auto if there are no ships rotated.
            console.log(rotatedShipExists())
            game.fleetElem().style.height = `auto`;
        }
    },
    dragShips: () => {
        //Add drag event listeners to each ship
        // WHEN DRAG STARTS
        game.ships.forEach(ship => {
            ship.addEventListener("dragstart", () => {
                ship.classList.add("dragging");
            });
            // WHEN DRAG FINISHES
            ship.addEventListener("dragend", () => {
                ship.classList.remove("dragging");
            })
            //WHEN RIGHT CLICKING ON SHIP
            ship.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                const ship = e.target;
                //Change rotated value on ship to opposite of what it was (true or false)
                game.fleet[ship.id].rotated =  !game.fleet[ship.id].rotated;
                //If ship has been changed to rotated, add rotated class
                if(game.fleet[ship.id].rotated){
                    ship.parentElement.classList.add("rotated")
                }
                //Else take away rotated class
                else{
                    ship.parentElement.classList.remove("rotated")
                }
                //Resize fleet if ship is rotated.
                game.fleetAutoResize();
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
                currentlyOccupiedCoordinates.forEach(coordinate => {
                    let space = document.getElementById(coordinate)
                    space.style.backgroundColor = "blue";
                })
                // console.log("dragEnter",coordinate.id, currentlyOccupiedCoordinates);                       
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
                // CURRENTLY CAUSING BUG
                //Reset coordinate color to original when ship leave Coordinate. Replace with user color choice later.
                // currentlyOccupiedCoordinates.forEach(id => {
                //     let space = document.getElementById(id)
                //     space.style.backgroundColor = "white";
                coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${coordinate.style.gridRowEnd}/${parseInt(coordinate.style.gridColumnStart) + 1}`
                // })
                // console.log("dragLeave", coordinate.id, coordinate.style.gridArea, game.fleet[draggedShip.id].hitBox);
                
            })
            // WHEN SHIP IS DROPPED IN TO COORDINATE
            coordinate.addEventListener("drop", () => {
                //If coordinate contains image/ship, then return
                if(!!coordinate.querySelector("img")){
                    return
                }
                console.log("drop has fired")
                const draggedShip = document.querySelector(".dragging")
                //reset ships coordinate hitbox(This is incase it is switched from a coordinate and already has coordinates).
                game.fleet[draggedShip.id].hitBox = [];
                //If currently occupied coordinates of the dragged ship interfere with any occupied coordinates, return.
                const allOccupiedCoordinates = game.getAllOccupiedCoordinates();
                const currentlyOccupiedCoordinates = game.getShipCoordinates(coordinate, draggedShip);
                if(!game.CheckIfOccupied(allOccupiedCoordinates,currentlyOccupiedCoordinates)){
                    return
                }
                //Attach ship to coordinate
                coordinate.appendChild(draggedShip);
                //get array of coordinates that ship occupies, and add contents of array to ship's hitbox.
                // let shipOccupiedCoordinates = game.getShipCoordinates(coordinate,draggedShip);
                game.fleet[draggedShip.id].hitBox.push(...currentlyOccupiedCoordinates)
                // Align ship with gridArea of the coordinate it is attached to.
                draggedShip.style.gridArea = `${1}/${1}/${2}/${2}`
                //Reset coordinate color to original when ship is dropped. Replace with user color choice later.
                currentlyOccupiedCoordinates.forEach(id => {
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
        window.addEventListener("resize", game.fleetAutoResize);
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