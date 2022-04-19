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
    dragStartHandler: () => {
        game.ships.forEach(ship => {
            ship.addEventListener("dragstart", () => {
                console.log("dragStart", ship.classList);
                ship.classList.add("dragging");
            })
        });
    },
    dragEndHandler: () => {
        game.ships.forEach(ship => {
            ship.addEventListener("dragend", () => {
                console.log("dragend", ship.classList, ship.id);
                ship.classList.remove("dragging");
            })
        });
    },
    dragShips: () => {
        //Add drag event listeners to each ship
        game.ships.forEach(ship => {
            ship.addEventListener("dragstart", () => {
                ship.classList.add("dragging");
                //When dragged, clear reset ships coordinate hitbox (until it's dropped again to pick up new coordinates)
                const draggedShip = document.querySelector(".dragging")
                game.fleet[draggedShip.id].hitBox = []
                console.log("i'm fired")
                // console.log(game.coordinates[3].style.eve)
            });
            ship.addEventListener("dragend", () => {
                ship.classList.remove("dragging");

            })
        });
        //Add event listeners to coordinates to place and hold the ship when dragged over said coordinate
        Array.from(game.coordinates).forEach(coordinate => {
            for(ship in game.fleet){
                if(game.fleet[ship].hitBox.includes(coordinate.id)){
                    console.log("These have showed to been in hitbox of ship",coordinate.id)
                }
            }     
            coordinate.addEventListener("dragenter", (e) => {
                console.log("dragEnter", coordinate.id, coordinate.style.gridArea);
                const draggedShip = document.querySelector(".dragging")
                const shipSize = game.fleet[draggedShip.id].size
                const shipSpan = parseInt(coordinate.style.gridColumnStart) + shipSize;
                //When entering coordinate, coordinate grows to length/height of the ships total spaces.
                coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${coordinate.style.gridRowEnd}/${shipSpan}`
                //Ship then grows to length of newly sized coordinate coordinate.
                draggedShip.style.width = `${coordinate.offsetWidth * shipSize}px`
                draggedShip.style.height = `${coordinate.offsetHeight}px`
                //Hover effect upon entering coordinates
                //First, remove other colors from coordinates (Used to prevent a bug)
                Array.from(game.coordinates).forEach(coordinate => coordinate.style.backgroundColor = "white");
                //Get occupied coordinates and change color of them.
                let occupiedCoordinates = game.getShipCoordinates(coordinate,draggedShip);
                occupiedCoordinates.forEach(id => {
                    let space = document.getElementById(id)
                    space.style.backgroundColor = "blue";
                })
            })
            coordinate.addEventListener("dragover", e => {
                e.preventDefault();

            })
            coordinate.addEventListener("dragleave", () => {
                console.log("dragLeave", coordinate.id, coordinate.style.gridArea);
                const draggedShip = document.querySelector(".dragging");
                // let occupiedCoordinates = game.getShipCoordinates(coordinate,draggedShip);
                // occupiedCoordinates.forEach(id => {
                //     let space = document.getElementById(id)
                //     space.classList.remove("occupied-coordinates");
                // })

            })
            coordinate.addEventListener("drop", () => {
                // console.log("dragDrop", coordinate);
                //attach original image of ship to coordinate, the image which was originally on the fleet.
                const draggedShip = document.querySelector(".dragging")
                coordinate.appendChild(draggedShip);
                //get array of coordinates that ship occupies, and add contents of array to ship's hitbox
                let shipOccupiedCoordinates = game.getShipCoordinates(coordinate,draggedShip);
                game.fleet[draggedShip.id].hitBox.push(...shipOccupiedCoordinates)
                
                shipOccupiedCoordinates.forEach(id => {
                    let space = document.getElementById(id)
                    space.style.backgroundColor = "white";
                })
                // console.log(game.fleet[draggedShip.id].hitBox)
                // get coordinates that ship occupies and add to ship's hitbox
                // coordinate.removeChild()
                draggedShip.style.gridColumnStart = 1;
                draggedShip.style.gridColumnEnd = 2;
                draggedShip.style.gridRowStart = 1;
                draggedShip.style.gridRowEnd = 2;
                // game.dragShips();
                // Array.from(game.coordinates).forEach(coordinate => coordinate.replaceWith(coordinate.cloneNode(true)))
                
                // coordinate.append(draggedShip)
            })
            
        })
        
    },

    dragLeaveHandler: () => {
        console.log("I am dragLeave handler before forEach loop");
        Array.from(game.coordinates).forEach(coordinate => {
            coordinate.addEventListener("dragleave", () => {
                console.log("dragLeave", coordinate.id);
            })
        });
    },
    dragOverHandler: (e) => {
        console.log("I am dragOver handler before forEach loop");
        Array.from(game.coordinates).forEach(coordinate => {
            coordinate.addEventListener("dragover", e => {
                e.preventDefault();
                // console.log("dragover", coordinate.id, coordinate.style.gridArea);
            })
        });
    },
    dragDropHandler: () => {
        console.log("I am dragDROP handler before forEach loop");
        Array.from(game.coordinates).forEach(coordinate => {
            coordinate.addEventListener("drop", () => {
                console.log("dragDROP", coordinate.id, coordinate.style.gridArea);
            })
        });
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
        // game.ships.forEach(ship => {
        //     ship.addEventListener("mousedown", () => {
        //         console.log("mousedown is firing")
        //         //here needs to be true
        //         game.dragEnterObj.dragEnterFunction(true);
        //     });
        // })
        // game.ships.forEach(ship => {
        //     ship.addEventListener("mouseup", () => {
        //         console.log("mouseup is firing")
        //         game.dragEnterObj.dragEnterFunction(false);
        //     });
        // })

        // game.dragStartHandler();
        // game.dragEndHandler();
        // game.dragEnterHandler(true);
        // game.dragLeaveHandler();
        // game.dragOverHandler();
        // game.dragDropHandler()
        // Array.from(game.coordinates).forEach(coordinate => {
            // coordinate.addEventListener("dragenter", );
            // coordinate.addEventListener("dragover", game.dragOverHandler(e));
            // coordinate.addEventListener("dragleave", game.dragLeaveHandler);
            // coordinate.addEventListener("drop", game.dragDropHandler);
        // })
        
        

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