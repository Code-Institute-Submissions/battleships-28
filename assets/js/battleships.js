/* jshint esversion: 8 */
//Fleet class
class Fleet{
    constructor(){
        this.carrier = {
            name: "Carrier",
            size: 5,
            rotated: false,
            hitBox: [],
        }
        this.battleship = {
            name: "Battleship",
            size: 4,
            rotated: false,
            hitBox: [],
        }
        this.cruiser = {
            name: "Cruiser",
            size: 3,
            rotated: false,
            hitBox: [],
        }
        this.submarine = {
            name: "Submarine",
            size: 3,
            rotated: false,
            hitBox: [],
        }
        this.destroyer = {
            name: "Destroyer",
            size: 2,
            rotated: false,
            hitBox: [],
        }
    }
}
// Game object
let game = {
    mainMenu: document.querySelector("#main-menu"),
    gameOptionsButton: document.querySelector("#game-options-button"),
    instructionsButton: document.querySelector("#instructions-button"),
    userNameEntry: document.querySelector("#name"),
    gameBoard: document.querySelector("#game-board"),
    gameScreen: document.querySelector("#game-screen"),
    userName: document.querySelector("#user-name"),
    fleetElem: () => document.querySelector("#fleet"),
    gameBoardNums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    gameBoardLets: ["A","B","C","D","E","F","G","H","I","J"],
    userNameRegex: /[A-Za-z]+/g,
    numRegex: /[0-9]+/g,
    letRegex: /[A-Z]/g,
    coordinateRegex:/^[A-J]([0-9]|10)$/,
    gameNowActive: false,
    gameVerdict: document.querySelector("#game-verdict"),
    gameVerdictHeader: document.querySelector("#game-verdict-header"),
    winOrLose: document.querySelector("#win-or-lose"),
    playAgain: document.querySelector("#play-again"),
    inGameInstructions: document.querySelector("#in-game-instructions"),
    inGameReturn: document.querySelector("#in-game-return"),
    returnMainMenu: document.querySelector("#return-to-start"),
    ships: document.querySelectorAll(".ship"),
    textArea: document.querySelector("#text-area"),
    coordinates: document.getElementsByClassName("coordinate"),
    draggedShip: document.querySelector(".dragging"),
    gameStartModal: document.querySelector("#game-start-modal"),
    userScore: () => document.querySelector("#score"),
    userShipsRemaining: () => document.querySelector("#user-ships-remaining"),
    userScoreMultiplier: 1,
    usersTurn: true,
    userCoordinateInput: () => document.querySelector("#user-coordinate-input"),
    userCoordinateInputButton: () => document.querySelector("#confirm-coordinates"),
    userAttackedCoordinate: () => document.querySelector("#attacked-coordinate"),
    generateRandomNumber: (min,max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    rotationOnGridHappening: false,
    rotateOnGrid: (hitBox, shipSize, rotate) => {
        let shipSizeRange = [];
        let  newHitBox = [];
        //Get range of numbers of shipsize (Excluding final number). E.g, ship size is 3, populate array of numbers [0,1,2]
        for(let i = 0; i < shipSize; i++){
            shipSizeRange.push(i);
        }
        //Increment numbers/letters based on if rotate parameter is true or false in function execution.
        for(let i = 0; i < hitBox.length; i++){
            let number = hitBox[i].match(game.numRegex);
            let letter = hitBox[i].match(game.letRegex);
            let letCharCode = letter[0].charCodeAt(0);
            let newNumber;
            let newLetter
            //If rotate is true decrement numbers and increment letters. If false, do the reverse.
            if(rotate){
                newNumber = parseInt(number) - shipSizeRange[i];
                newLetter = String.fromCharCode(letCharCode + shipSizeRange[i]);
            }
            else{
                newNumber = parseInt(number) + shipSizeRange[i];
                newLetter = String.fromCharCode(letCharCode - shipSizeRange[i])
            }
            //Create new coordinate and push it to newHitbox array. Then return newHitbox.
            let newCoordinate = newLetter.concat(newNumber);
            newHitBox.push(newCoordinate)
        }
        return newHitBox;


    },
    getShipCoordinates: (fleet,coordinate,ship) => {
        // Return all the coordinates taken up by the ship.
        //Declare variables
        const shipSize = fleet[ship.id].size
        let currentCoordinates = coordinate.id;
        let shipCoordinates = [currentCoordinates];
        //Loop equalling to number of shipSize
        for(let i = 0; i < shipSize-1; i++){
            //Get number and letter/Letter charactercode
            let number = currentCoordinates.match(game.numRegex)
            let letter = currentCoordinates.match(game.letRegex)
            let letCharCode = letter[0].charCodeAt(0)
            //Increment number
            if(fleet[ship.id].rotated === false){
                number[0]++
            }
            else{
                letCharCode++;
            }
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
    getAllOccupiedCoordinates: (fleet) => {
        let allOccupiedCoordinates = [];
        for(ship in fleet){
            allOccupiedCoordinates.push(...fleet[ship].hitBox);
        }
        return allOccupiedCoordinates;
    },
    checkIfOccupied:(allOccupiedCoordinates,requestedCoordinates) => {
        //Checks if ships requested coordinates are occupied by another ship or outside grid.
        let access = true;
        let skippedCoordinate;
        //If the ship is rotated on the grid by the user, we need to exclude the first coordinate in ship's hitbox
        //This is because the ship will always be on this and therefore won't move, as it will interfere with itself. So we use shift()
        //game.rotationOnGridHappening does not signify the value of ships rotate value. It signifies IF a ship is being rotated by user on the board.
        //This was made to fix bug which occured when populating opponent's ship's hitboxes.
        //Sometimes it will duplicate first coordinate in hitbox, because opponent is not rotating a ship while it's on the grid.
        //This can only be done by the user.
        //The opponent is placing a ship WHICH IS ALREADY ROTATED on the grid.
        if(game.rotationOnGridHappening === true){
            skippedCoordinate = requestedCoordinates.shift();
        }
        requestedCoordinates.forEach(coordinate => {
            //If ship's requested coordinates is occupied by another ship, dragEvent listeners won't fire.
            if(allOccupiedCoordinates.includes(coordinate)){
                access = false;
            }
            //If ship's requested coordinates is outside grid, dragEvent listeners won't fire.
            else if(parseInt(coordinate.match(game.numRegex)) > 10 || coordinate.match(game.letRegex)[0].charCodeAt(0) > 74){
                access = false;
            }
        })
        //If a ship was changed on the grid and we excluded the first coordinate in array, we add it back to its hitbox here.
        if(game.rotationOnGridHappening === true){
            requestedCoordinates.unshift(skippedCoordinate)
        }
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
        if(!game.fleetElem()){
            return;
        }
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
        }
        else{
            //Set fleet height to auto if there are no ships rotated.
            game.fleetElem().style.height = `auto`;
        }
    },
    dragShips: () => {
        //Add drag event listeners to each ship
        // WHEN DRAG STARTS
        game.ships.forEach(ship => {
            ship.addEventListener("dragstart", () => {
                //Check if game is active, and if so, then return
                if(game.gameNowActive){
                    return
                }
                ship.classList.add("dragging");
            });
            // WHEN DRAG FINISHES
            ship.addEventListener("dragend", () => {
                //Check if game is active, and if so, then return
                if(game.gameNowActive){
                    return
                }
                ship.classList.remove("dragging");
            })
            //WHEN RIGHT CLICKING ON SHIP
            ship.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                //Check if game is active, and if so, then return
                if(game.gameNowActive){
                    return
                }
                const ship = e.target;
                //Change rotated value on ship to opposite of what it was (true or false)
                game.fleet[ship.id].rotated =  !game.fleet[ship.id].rotated;
                // If ship is in fleet and not on grid, toggle rotated class.
                if(game.fleet[ship.id].hitBox.length <= 0){
                    ship.classList.toggle("rotated")
                }
                //If ship is on the grid when rotated
                if(game.fleet[ship.id].hitBox.length > 0){
                    //Target coordinate which ship is attached to.
                    const coordinate = document.getElementById(game.fleet[ship.id].hitBox[0]);
                    game.rotationOnGridHappening = !game.rotationOnGridHappening;
                    //if ship rotated value is switched to true on right click
                        if(game.fleet[ship.id].rotated){
                            //Make array of requested coordinates
                            const requestedHitbox = game.rotateOnGrid(game.fleet[ship.id].hitBox, game.fleet[ship.id].size, true);
                            //Check if it's possible to rotate ship to requested coordinates. If not, reverse rotated value on ship and return.
                            if(!game.checkIfOccupied(game.getAllOccupiedCoordinates(game.fleet),requestedHitbox)){
                                game.fleet[ship.id].rotated =  !game.fleet[ship.id].rotated;
                                game.rotationOnGridHappening = !game.rotationOnGridHappening;
                                return
                            }
                            //Add rotated class.
                            ship.classList.add("rotated")
                            const shipSpan = parseInt(coordinate.style.gridRowStart) + game.fleet[ship.id].size;
                            //Reset ship's hitbox.
                            game.fleet[ship.id].hitBox = requestedHitbox;
                            //Reset coordinate gridAreas.
                            coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${shipSpan}/auto`
                            coordinate.style.height = coordinate.offsetWidth * game.fleet[ship.id].size;
                            //Reset ships width and height.
                            ship.style.maxWidth = `none`;
                            ship.style.width = `${coordinate.offsetHeight}px`
                            ship.style.height = `${coordinate.offsetWidth}px`
                        }
                        ////if ship rotated value is switched to false on right click
                        else{

                            //Make array of requested coordinates
                            const requestedHitbox = game.rotateOnGrid(game.fleet[ship.id].hitBox, game.fleet[ship.id].size, false);
                            //Check if it's possible to rotate ship to requested coordinates. If not, reverse rotated value on ship and return.
                            if(!game.checkIfOccupied(game.getAllOccupiedCoordinates(game.fleet),requestedHitbox)){
                                game.fleet[ship.id].rotated =  !game.fleet[ship.id].rotated;
                                game.rotationOnGridHappening = !game.rotationOnGridHappening;
                                return
                            }
                            //Remove rotated class
                            ship.classList.remove("rotated")
                            const shipSpan = parseInt(coordinate.style.gridColumnStart) + game.fleet[ship.id].size;
                            //Reset ship's hitbox.
                            game.fleet[ship.id].hitBox = requestedHitbox;
                            //Reset coordinate gridAreas.
                            coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/auto/${shipSpan}`
                            coordinate.style.width = coordinate.offsetWidth * game.fleet[ship.id].size;
                            //Reset ships width and height.
                            ship.style.maxWidth = `${100}%`
                            ship.style.width = `${coordinate.offsetWidth * game.fleet[ship.id].size}px`
                            ship.style.height = `${coordinate.offsetHeight}px`
                        }
                        game.rotationOnGridHappening = !game.rotationOnGridHappening;
                }
                //Resize fleet if ship is rotated.
                game.fleetAutoResize();
            })
        });
        //Add dragEnter, dragLeave, DragOver and dragDropevent listeners to coordinates to interact with ship.
        Array.from(game.coordinates).forEach(coordinate => {
            // WHEN SHIP IS DRAGGED INTO COORDINATE
            coordinate.addEventListener("dragenter", (e) => {
                //Check if game is active, and if so, then return
                if(game.gameNowActive){
                    return
                }
                //If coordinate contains image/ship, then return
                if(!!coordinate.querySelector("img")){
                    return
                }
                //Declare variables for interacting with ship in coordinate.
                const draggedShip = document.querySelector(".dragging")
                const allOccupiedCoordinates = game.getAllOccupiedCoordinates(game.fleet);
                const currentlyOccupiedCoordinates = game.getShipCoordinates(game.fleet,coordinate, draggedShip);
                //If currently occupied coordinates of the dragged ship interfere with any occupied coordinates, return.
                if(!game.checkIfOccupied(allOccupiedCoordinates,currentlyOccupiedCoordinates)){
                    return
                }
                const shipSize = game.fleet[draggedShip.id].size
                //if Ship is NOT rotated
                if(game.fleet[draggedShip.id].rotated === false){
                const shipSpan = parseInt(coordinate.style.gridColumnStart) + shipSize;
                //When entering coordinate, coordinate grows to length/height of the ships total size.
                coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${coordinate.style.gridRowEnd}/${shipSpan}`
                //Ship then grows to length of newly sized coordinate.
                draggedShip.style.maxWidth = `${100}%`
                draggedShip.style.width = `${coordinate.offsetWidth * shipSize}px`
                draggedShip.style.height = `${coordinate.offsetHeight}px`
            }   
                // Else if ship IS rotated
                else{
                    const shipSpan = parseInt(coordinate.style.gridRowStart) + shipSize;
                    coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${shipSpan}/${coordinate.style.gridColumnEnd}`
                    draggedShip.style.width = `${coordinate.offsetHeight}px`
                    draggedShip.style.height = `${coordinate.offsetWidth}px`
                }
                //Hover effect upon entering coordinates
                //First, remove other colors from coordinates (Used to prevent a bug). Later, can replace this with user color. //May be able to do this more efficiently with dragLeave/drop.
                //Get occupied coordinates and change color of them. Later, can replace this with user color.
                Array.from(game.coordinates).forEach(coordinate => coordinate.style.backgroundColor = "white");
                currentlyOccupiedCoordinates.forEach(coordinate => {
                    let space = document.getElementById(coordinate)
                    space.style.backgroundColor = "blue";
                })                  
            })
            // WHILE SHIP IS DRAGGED OVER COORDINATE
            coordinate.addEventListener("dragover", e => {
                //Used to allow dragDrop event to happen. 
                e.preventDefault();
                //Check if game is active, and if so, then return
                if(game.gameNowActive){
                    return
                }
            })
            // WHEN SHIP IS DRAGGED OUT OF COORDINATE
            coordinate.addEventListener("dragleave", () => {
                //Check if game is active, and if so, then return
                if(game.gameNowActive){
                    return
                }
                //If coordinate contains image/ship, then return
                if(!!coordinate.querySelector("img")){
                    return
                }
                //Declare variables for interacting with ship in coordinate.
                const draggedShip = document.querySelector(".dragging");
                const allOccupiedCoordinates = game.getAllOccupiedCoordinates(game.fleet);
                const currentlyOccupiedCoordinates = game.getShipCoordinates(game.fleet,coordinate, draggedShip);
                //If currently occupied coordinates of the dragged ship interfere with any occupied coordinates, return.
                if(!game.checkIfOccupied(allOccupiedCoordinates,currentlyOccupiedCoordinates)){
                    return
                }
                // CURRENTLY CAUSING BUG
                //Reset coordinate color to original when ship leave Coordinate. Replace with user color choice later.
                // currentlyOccupiedCoordinates.forEach(id => {
                //     let space = document.getElementById(id)
                //     space.style.backgroundColor = "white";
                if(game.fleet[draggedShip.id].rotated === false){
                    coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${coordinate.style.gridRowEnd}/${parseInt(coordinate.style.gridColumnStart) + 1}`
                }
                else{
                    coordinate.style.gridArea = `${coordinate.style.gridRowStart}/${coordinate.style.gridColumnStart}/${parseInt(coordinate.style.gridRowStart) + 1}/${coordinate.style.gridColumnEnd}`
                }
                
            })
            // WHEN SHIP IS DROPPED IN TO COORDINATE
            coordinate.addEventListener("drop", () => {
                //Check if game is active, and if so, then return
                if(game.gameNowActive){
                    return
                }
                //If coordinate contains image/ship, then return
                if(!!coordinate.querySelector("img")){
                    return
                }
                const draggedShip = document.querySelector(".dragging")
                //reset ships coordinate hitbox(This is incase it is switched from a coordinate and already has coordinates).
                game.fleet[draggedShip.id].hitBox = [];
                //If currently occupied coordinates of the dragged ship interfere with any occupied coordinates, return.
                const allOccupiedCoordinates = game.getAllOccupiedCoordinates(game.fleet);
                const currentlyOccupiedCoordinates = game.getShipCoordinates(game.fleet,coordinate, draggedShip);
                if(!game.checkIfOccupied(allOccupiedCoordinates,currentlyOccupiedCoordinates)){
                    return
                }
                //Attach ship to coordinate
                coordinate.appendChild(draggedShip);
                //add coordinates that ship occupies to the ships hitbox.
                game.fleet[draggedShip.id].hitBox.push(...currentlyOccupiedCoordinates)
                // Align ship with gridArea of the coordinate it is attached to.
                draggedShip.style.gridArea = `${1}/${1}/${2}/${2}`
                //Reset coordinate color to original when ship is dropped. Replace with user color choice later.
                currentlyOccupiedCoordinates.forEach(id => {
                    let space = document.getElementById(id)
                    space.style.backgroundColor = "white";
                })
                if(game.fleet[draggedShip.id].rotated === true){
                    draggedShip.style.maxWidth = "none";
                }
                //Check if fleet is now empty after dropping ship
                if(!game.fleetElem().querySelector(".ship")){
                    //Show modal if empty
                    game.gameStartModal.showModal();
                    //Assign logic to Yes and No buttons.
                    const gameStartYes =  document.querySelector("#game-start-yes");
                    const gameStartNo = document.querySelector("#game-start-no");
                    gameStartYes.addEventListener("click", game.opponent.opponentSetup)
                    gameStartNo.addEventListener("click", () => {
                        game.gameStartModal.close();
                        //Reset ship's hitbox and image size, then attach ship back to it's respective container
                        game.fleet[draggedShip.id].hitBox = [];
                        draggedShip.style.height = "auto";
                        draggedShip.style.width = "auto";
                        draggedShip.style.maxWidth = `${100}%`;
                        document.querySelector(`#${draggedShip.id}-container`).appendChild(draggedShip);
                        currentlyOccupiedCoordinates.forEach(id => {
                            let space = document.getElementById(id)
                            space.style.border = "none";
                        })
                        game.fleetAutoResize();
                    })
                }
            })
        })
        
    },
    turn: (attackedFleet, attackedCoordinate) => {
        //Turn logic for user/opponent based on game.usersTurn property
        let shipSank = false;
        let hit = false;
        const turnLogic = (ship) => {
            const makeTextBox = () => {
                let textBoxes = [];
                    let textBox = document.createElement("div");
                    textBox.classList.add("text-box");
                    let textBoxPara = document.createElement("p");
                    textBox.appendChild(textBoxPara);
                    textBoxes.push(textBox);
                    game.usersTurn ? textBoxes[0].classList.add("user-text-box") : textBoxes[0].classList.add("opponent-text-box")
                    return textBoxes
                    // game.textArea.appendChild(textBox);
            }
            const setScore = (points, shipSize = 1) => {
                let score;
                if(game.usersTurn){
                    // +25 points X Score Multiplier for hitting opponent ship
                    // +20 points X ship size X score multiplier for sinking opponent ship
                    if(hit){
                        score = parseInt(game.userScore().textContent) + ((points * shipSize) * game.userScoreMultiplier)
                        game.userScoreMultiplier++;
                    }
                    // -20 points for miss
                    else if(!hit){
                        score = parseInt(game.userScore().textContent) - points;
                        game.userScoreMultiplier = 1;
                    }
                }
                else if(!game.usersTurn){
                    // -30 points for opponent hit.
                    // -40 points X shipsize for opponent sinking ship
                    score = parseInt(game.userScore().textContent) - ((points * shipSize))
                    }
                if(score < 0){
                    score = 0;
                }
                    game.userScore().textContent = score;
            }
            const setShipsRemaining = () => {
                if(game.usersTurn){
                    const shipsRemaining = parseInt(game.opponent.opponentShipsRemaining().textContent) -1;
                    game.opponent.opponentShipsRemaining().textContent = shipsRemaining;
                    if(shipsRemaining === 0){
                        game.winOrLose.textContent = "You've won!"
                        game.winOrLose.classList.add("win")
                        game.gameVerdictHeader.textContent = "Well done captain 😎"
                        game.gameVerdict.showModal();
                    }
                    
                }
                else if(!game.usersTurn){
                    const shipsRemaining = parseInt(game.userShipsRemaining().textContent) -1;
                    game.userShipsRemaining().textContent = shipsRemaining;
                    if(shipsRemaining === 0){
                        game.winOrLose.textContent = "You've lost!"
                        game.winOrLose.classList.add("loss")
                        game.gameVerdictHeader.textContent = "Hard luck captain 😰"
                        game.gameVerdict.showModal();
                    }
                }
            }
            if(game.usersTurn){
                //Capitalise coordinate letter in case user enters lowecase letter
                attackedCoordinate = attackedCoordinate.toUpperCase();
                //If coordinate entered by user doesn't test true to regex /^[A-J]([0-9]|10)$/ then alert and return
                if(!game.coordinateRegex.test(attackedCoordinate)){
                    alert("You must enter a valid coordinate!")
                    game.usersTurn = !game.usersTurn;
                    return;
                }
                if(hit && shipSank){
                    let textBoxes = makeTextBox();
                    textBoxes[0].firstChild.textContent = `${attackedCoordinate}: Hit! Your have sunk your opponent's ${attackedFleet[ship].name}`
                    textBoxes.forEach(textbox => game.textArea.appendChild(textbox));
                    //Set the user's score
                    setScore(20, attackedFleet[ship].size);
                    //Subtract 1 ship from ships remaining in opponent action bar
                    setShipsRemaining()
                }
                else if(hit){
                    let textBoxes = makeTextBox();
                    textBoxes[0].firstChild.textContent = `${attackedCoordinate}: Hit! You have damaged your opponent's ${attackedFleet[ship].name}`
                    textBoxes.forEach(textbox => game.textArea.appendChild(textbox));
                    //Set the user's score
                    setScore(25);
                }
                else{
                    let textBoxes = makeTextBox();
                    textBoxes[0].firstChild.textContent = `${attackedCoordinate}: You missed...`
                    textBoxes.forEach(textbox => game.textArea.appendChild(textbox));
                    //Set the user's score
                    setScore(20);
                }
            }
            else if(!game.usersTurn){
                if(hit && shipSank){
                    let textBoxes = makeTextBox();
                    textBoxes[0].firstChild.textContent = `${attackedCoordinate}: Hit! Your opponent has sunk your ${attackedFleet[ship].name}`
                    textBoxes.forEach(textbox => game.textArea.appendChild(textbox));
                    document.getElementById(attackedCoordinate).style.backgroundColor = "rgba(255,0,0,0.3)"
                    document.querySelector(`#${ship}`).remove();
                    //Set the user's score
                    setScore(25, attackedFleet[ship].size);
                    //Subtract 1 ship from ships remaining in user action bar
                    setShipsRemaining();
                }
                else if(hit){
                    let textBoxes = makeTextBox();
                    textBoxes[0].firstChild.textContent = `${attackedCoordinate}: Hit! Your opponent has damaged your ${attackedFleet[ship].name}`
                    textBoxes.forEach(textbox => game.textArea.appendChild(textbox));
                    document.getElementById(attackedCoordinate).style.backgroundColor = "rgba(255,0,0,0.3)"
                    //Set the user's score
                    setScore(30);
                }
                else{
                    let textBoxes = makeTextBox();
                    textBoxes[0].firstChild.textContent = `${attackedCoordinate}: Your opponent has missed...`
                    textBoxes.forEach(textbox => game.textArea.appendChild(textbox));
                }
            }
            game.textArea.scrollTop = game.textArea.scrollHeight;
        }
            //Checks if any ships have been hit.
            for(ship in attackedFleet){
                attackedCoordinate = attackedCoordinate.toUpperCase();
                if(attackedFleet[ship].hitBox.includes(attackedCoordinate)){
                        hit = true;
                        const index = attackedFleet[ship].hitBox.indexOf(attackedCoordinate);
                        attackedFleet[ship].hitBox.splice(index,1);
                        if(attackedFleet[ship].hitBox.length <= 0){
                            shipSank = true
                        }
                    turnLogic(ship);
                    game.usersTurn = !game.usersTurn;
                    if(!game.usersTurn){
                        const randomNum = game.generateRandomNumber(0,game.opponent.attackChoices.length-1)
                        game.turn(game.fleet, game.opponent.attackChoices[randomNum])
                        game.opponent.attackChoices.splice(randomNum,1)
                        return
                    }
                    else if(game.usersTurn){
                        return
                    }
                }
            }
            //This will fire on a miss. If it doesn't fire, that means it has already gone into the above if statements and hit something.
            turnLogic();
            game.usersTurn = !game.usersTurn;
            if(!game.usersTurn){
                const randomNum = game.generateRandomNumber(0,game.opponent.attackChoices.length-1)
                game.turn(game.fleet, game.opponent.attackChoices[randomNum])
                game.opponent.attackChoices.splice(randomNum,1)
            }

    },
    gameHasReset: false,
    resetGame: (e) => {
        //Add flag if resetting game.
        game.gameHasReset = true;
        //As game is over, make game.gameNowActive false
        game.gameNowActive = false;
        //Close win/lose modal
        game.gameVerdict.close();
        //Remove event listeners as these will be added again during gameSetup()
        window.removeEventListener("resize", game.gameboardAutoResize);
        window.removeEventListener("resize", game.fleetAutoResize);
        // Remove gameScreen
        game.gameScreen.innerHTML = " ";
        // Add blank gameScreen
        game.gameScreen.innerHTML = `<div class = "header-container">
        <button id="in-game-instructions" class="button">
            Instructions
        </button>
        <button id="in-game-return" class="button">
            Main menu
        </button>
        <h2 id = "game-header">
            <i class="fa-solid fa-anchor"></i>
            Battleships
            <i class="fa-solid fa-anchor"></i>
        </h2>
    </div>
    <div id = "action-bar">
        <div id = "user-section">
            <h2>User</h2>
            <h3>ships left:<span id = "user-ships-remaining">5</span></h3>
            <h3>score: <span id = "score">1000</span></h3>
            <label>
                <input type = "checkbox">
            </label>
        </div>
        <div id = "text-area">
            <div class = "text-box">
                <p>Get ready! The game will start soon!</p>
            </div>
        </div>
        <div id = "opponent-section">
            <h2 id = "opponent-name">Opponent</h2>
            <h3>ships left:<span id = "opponent-ships-remaining">5</span></h3>
        </div>
    </div>
    <div id = "game-board">
    </div>
    <div id = "fleet">
        <div class = "ship-container" id = "carrier-container">
            <img src = "assets/images/carrier.png" alt = "An image of your carrier ship" class = "ship" id = "carrier" draggable="true">
        </div>
        <h3>
            Carrier
        </h3>
        <div class = "ship-container" id = "battleship-container">
            <img src = "assets/images/battleship.webp" alt = "An image of your battleship ship" class = "ship" id = "battleship" draggable="true">
        </div>
        <h3>
            Battleship
        </h3>
        <div class = "ship-container" id = "cruiser-container">
            <img src = "assets/images/cruiser.png" alt = "An image of your cruiser ship" class = "ship" id = "cruiser" draggable="true">
        </div>
        <h3>
            Cruiser
        </h3>
        <div class = "ship-container" id = "submarine-container">
            <img src = "assets/images/submarine.png" alt = "An image of your submarine ship" class = "ship" id = "submarine" draggable="true">
        </div>
        <h3>
            Submarine
        </h3>
        <div class = "ship-container" id = "destroyer-container">
            <img src = "assets/images/destroyer.png" alt = "An image of your destroyer ship" class = "ship" id = "destroyer" draggable="true">
        </div>
        <h3>
            Destroyer
        </h3>
    </div>
    <form class = "hide" id = "user-coordinate-input">
        <label> Enter Coordinates to attack!</label>
        <input type = "text" id = "attacked-coordinate" required>
        <button class = "button" id = "confirm-coordinates">Fire!</button>
    </form>`
        //Some game properties were not recognised during the game reset. So, declare these properties again so they can be recognised.
        //It seems that resetting the innerHTML in the gamescreen has caused this.
        game.gameScreen = document.querySelector("#game-screen")
        game.gameBoard = document.querySelector("#game-board"),
        game.fleetElem = () => document.querySelector("#fleet")
        game.ships = document.querySelectorAll(".ship")
        game.textArea = document.querySelector("#text-area"),
        game.gameSetup(e);
        game.fleet = new Fleet();
        game.opponent.fleet = new Fleet();
        game.fleetAutoResize();
        game.winOrLose.classList = ""
        game.usersTurn = true;
        game.gameHasReset = false;
        game.inGameInstructions = document.querySelector("#in-game-instructions");
        game.inGameReturn = document.querySelector("#in-game-return");
        //Re-activate listeners on in game instructions and return buttons
        game.inGameInstructions.addEventListener("click", game.toggleGameInstructions)
        game.inGameReturn.addEventListener("click", () => window.location.reload())
    },

    opponent: {
        opponentSetup: () => {
            game.gameNowActive = true;
            game.gameStartModal.close();
            game.fleetElem().remove();
            game.userCoordinateInput().classList.remove("hide");
            game.opponent.populateFleet();
            game.opponent.populateAttackChoices();
            game.returnMainMenu.addEventListener("click", () => window.location.reload())
            game.playAgain.addEventListener("click", (e) => game.resetGame(e))
    },
    generateRandomCoordinate: () => {
        let letter = game.gameBoardLets[game.generateRandomNumber(0,9)];
        let number = game.gameBoardNums[game.generateRandomNumber(0,9)];
        return `${letter.concat(number)}`;
    },
    attackChoices: [],
    opponentShipsRemaining: () =>  document.querySelector("#opponent-ships-remaining"),
    populateAttackChoices: () => {
        const allCoordinates = document.querySelectorAll(".coordinate")
        allCoordinates.forEach(coordinate => {
            game.opponent.attackChoices.push(coordinate.id)
        })
    },
    populateFleet: () => {
        //Create opponent's fleet
        game.opponent.fleet = new Fleet()
        // function to reset opponent's ship's hitbox
        const resetHitboxes = ship => {
            game.opponent.fleet[ship].hitBox = [];
        }
        // function to randomly generate a opponent's ship's rotated property
    const setRotatedValue = ship => {
        let rotatedValue;
        game.generateRandomNumber(0,1) < 0.5 ? rotatedValue = false : rotatedValue = true;
        game.opponent.fleet[ship].rotated = rotatedValue
    }
        // function to generate random first coordinate of opponent's ship
        const getCoordinates = ship => {
            const coordinate = document.querySelector(`#${game.opponent.generateRandomCoordinate()}`)

            //get Opponent's requested coordinates based off first coordinate
            const requestedCoordinates = game.getShipCoordinates(game.opponent.fleet, coordinate, ship)
            //Get currently occupied coordinates of the opponent's ships on grid
            const opponentOccupiedCoordinates = game.getAllOccupiedCoordinates(game.opponent.fleet)
            //check if these requested coordinates are available on opponent's grid
            const checkIfOccupied = game.checkIfOccupied(opponentOccupiedCoordinates,requestedCoordinates, game.opponent.fleet[ship.id].rotated)
            //If they are occupied, call getCoordinates again and generate different coordinate - attempt to place boat somewhere else on grid.
            if(!checkIfOccupied){
                getCoordinates(ship)
            }
            //Else if they are not occupied, push the requested coordinates to opponent's ship's hitbox.
            else{
                game.opponent.fleet[ship.id].hitBox.push(...requestedCoordinates);
            }

        }
        //Iterate through each ship on opponent's fleet
        for(shipObject in game.opponent.fleet){
            //ship is equal to the id of each ship, needed for getCoordinates function.
            const ship = document.querySelector(`#${game.opponent.fleet[shipObject].name.toLowerCase()}`)
            //Reset each hitbox and randomly generate rotated value for each ship on opponent's fleet. (As opponent ship is a clone of user ship, these need to be reset/randomly generated and overwritten)
            resetHitboxes(shipObject)
            setRotatedValue(shipObject)

            //Set Timeout really important here. Prevents bug of copying user total coordinates as opponents total coordinates. Asynchronous issue.
            //Get coordinates for each ship and do all necessary checks to see if already occupied.
            setTimeout(() => {
                getCoordinates(ship);
            },500)
        }
        // Once fleet has finished populating, add event to allow user turn
        game.userCoordinateInputButton().addEventListener("click",(e) =>{
            e.preventDefault();
            game.turn(game.opponent.fleet, game.userAttackedCoordinate().value);
        })
    },
        },
    gameboardAutoResize: () => {
        //FIRES WHEN WINDOW IS RESIZED AND WHEN GAMEBOARD FIRST APPEARS.
        //Target first empty coordinate on board
        let firstEmptyCooordinate = Array.from(document.querySelectorAll(".coordinate")).find(coordinate => !coordinate.querySelector("img"));
        let colLength = firstEmptyCooordinate.offsetWidth
        //Automatically convert all grid spaces to squares rather than rectangles by default
        game.gameBoard.style.gridAutoRows = `${colLength}px`
        // Change sizes of ships/rows which ships are placed on the grid.
        //ships holds an array of all ships which are placed on the gameboard.
        const ships = Array.from(game.gameBoard.querySelectorAll(".ship"));
        ships.forEach(ship => {
            if(game.fleet[ship.id].rotated){
                ship.style.width = `${colLength * game.fleet[ship.id].size}px`
                ship.style.height = `${colLength}px`
            }
            else{
                ship.parentElement.style.gridTemplateRows = `${colLength}px`
            }
        })
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
        game.mainMenu.classList.add("hide");
        game.gameScreen.classList.remove("hide");
        game.userName.textContent = game.userNameEntry.value;
        game.inGameInstructions.addEventListener("click", game.toggleGameInstructions)
        game.inGameReturn.addEventListener("click", () => window.location.reload())
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
    toggleGameOptions: (e) => {
        e.preventDefault();
        let gameOptionsScreen = document.querySelector("#game-options-screen");
        if(gameOptionsScreen.className){
            gameOptionsScreen.classList.remove("hide");
        }
        else{
            gameOptionsScreen.classList.add("hide");
        }
        let beginGameButton = document.querySelector("#begin-game-button");
        beginGameButton.addEventListener("click", e =>{
            e.preventDefault();
            //If no username is entered, return
            if(game.userNameEntry.value === ""){
                game.userNameEntry.style.backgroundColor = "rgba(255,0,0,0.3)";
                setTimeout(() => game.userNameEntry.style.backgroundColor = "",2500);
                return;
            }
            //If username is above 11 characters, return
            else if(game.userNameEntry.value.length > 11){
                alert("Your username cannot exceed 11 characters")
                return;
            }
            //If username has characters other than letters, return
            else if(!game.userNameRegex.test(game.userNameEntry.value)){
                console.log(game.userNameRegex.test(game.userNameEntry.value))
                alert("Your username may only contain letters")
                return;
            }
            game.gameSetup(e)
        })
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


// Add functionality to game start up button in main menu.
game.gameOptionsButton.addEventListener("click", e => game.toggleGameOptions(e))

// Add functionality to instructions button in main menu.
game.instructionsButton.addEventListener("click", game.toggleGameInstructions)
