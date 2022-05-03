# Rushdown
Battleships is a strategic, turn-based guessing game in which each user attempts to damage and eventually sink their opponents ships. Battleship actually dates back prior to World War I and was later published by various companies as a pad-and-pencil game in the 1930s. It was then officially released as a plastic board game by Milton Bradley in 1967. 
 - At the start of the game, each user will place their ships on coordinates of their own choosing. There are a total of 100 coordinates/spaces on each user's game board, and each ship can take up anywhere from 2-5 coordinates/spaces on the board.
 - During each turn, the user will decide on coordinates to attack.
 - If the attacked coordinates are empty, the turn is labelled as a "miss". However, if the coordinates are holding a section of their opponent's ship, the turn is labelled as a "hit" and the ship will take damage in that specific coordinate.
 - If all coordinates which house a ship are attacked, that ship is considered to be sunk, and is no longer active in the game.
 - The user also has access to a "hit board" which labels all coordinates which they have attacked and whether they were a "hit" or a "miss".
 - This helps each user to track their shots and make strategic guesses as to where their opponent may be hiding their ships.
 - The first person to successfully sink all their opponents ships is the winner!  
The full **[Battleship](https://conorg180.github.io/rushdown-mma-gym/index.html)** game can be played here.  
<!-- Insert image here later -->

## Wireframes
Before starting development on the project, Balsamiq was used to form wireframes for each separate page within the game. Basamiq was chosen due to it's efficiency and it's ability to reproduce relatively simplistic, yet easy to understand wireframes. This helped me to visualise ideas for each of the game's pages and features, and organise how certain features would be laid out and implemented within the game.  
![index.html wireframe](assets/wireframes/index.html.png "index.html (Main menu)")
![Game options wireframe](assets/wireframes/game-options.png "game options menu" )
![Game Screen set-up wireframe](assets/wireframes/game-screen-setup.png "Game Screen Set up")
![ Game screen wireframe](assets/wireframes/game-screen.png "Game Screen")
![instructions modal wireframe](assets/wireframes/instructions-modal.png "Instructions modal")
![Game-finished modal wireframe](assets/wireframes/game-finished.png "Game-finished modal")

# Features
## Existing features

### Main menu
The Main menu of the game is the first screen that the user should see when the game is loaded. It is designed to be eyecatching and aesthetic, yet not over the top. It should also provide the user an easy route to the game with little difficulty and distractions. Within the main menu, there are 2 buttons
 - Start game button, which triggers the game start-up/options menu to appear.
 - An instructions button, which activates a pop up screen/modal of the game's instructions and how to play the game. 
  #### **Images**  
    <!-- Insert image here -->
### Game options menu
The Game options menu of the game is the screen which triggers once the user clicks "Begin new game" on the main menu. This screen allows the user to customise the game to their liking, and includes features such as:
  - Entering their name - This value will be used as the game goes on to refer to the player, and will be used in features such as the user's action bar.
  - A difficulty setting - This setting will allow the user to determine at which difficulty they would like to play at. Naturally, a player who is unsure of the game and who is just beginning to learn can set the game to be "easy", if they please. However, medium and hard mode (Especially hard mode) should provide more of a challenge for those who are looking for it
    - Easy - The logic of the Easy mode is as follows: On the opponent's turn, the opponent will randomly pick one coordinate out of a possible 100, and attack the coordinate
    - Medium - The logic of the Medium mode is as follows: On the opponent's turn, the opponent will randomly pick one coordinate out of a possible 100, and attack the coordinate. The opponent will then remove that coordinate from their attackChoices property, and on the next turn, will pick one possible coordinate out of 99. This ensures the opponent never hits the same coordinate twice, as opposed to easy mode.
    - Hard - The logic of the Hard mode is as follows: On the opponent's turn, the opponent will act the same as if the setting was set to Medium difficulty. However, a missCounter variable is used to count the number of times the opponent consecutively misses. Should the opponent miss 3 times in a row, the opponent will guarentee a hit against the user on the 4th turn. If the opponent hit's a ship, the missCounter is reset to 0.
  #### **Images**  
    <!-- Insert image here -->
  ### Game Screen
  The Game screen is the main screen which the user plays the battleships game, and naturally has the most features. The gameScreen itself is built using grid and has been designed to be fully responsive down to a 350px screen. Subfeatures included on the Game screen include:
   - Action bar - the Action bar holds all relevant information that the user will want to see during the game, including the number of ships that they and their opponent have left, and the user's score.
     - Score - The score on the action bar represents how well the player is doing. Points are score when the user hits or sinks a ship, and a score multiplier is included to increase the score even further when consecutive hits have been made. However, points can be lost for missed, and also if the opponent hits or sinks the user's ships 
     - Ships remaining - The ships remaining part of the action bar displays how many ships/lives the user or opponent has left. Once this reaches 0, the game will be finished, and the user will be declared to have won or lost.
     - Text area - The text area is where the user can find out and retrace their previous coordinate attacks. The text-area will display a different style for the user's attacks, and will declare the coordinate attacked, if the attack made by the user or opponent was a hit or miss, and whether they have sunk a ship.
   - Game board - The Game board is the actual grid where the user will place their ships. Each coordinate responds in various ways when a ship enters, leaves, or is dropped on to it. This includes highlighting various coordinates or scaling a ship to fit itself according to the number of spaces it has.
   - Fleet - The fleet includes each ship which the user has access to. Each ship can be placed on the grid by simply dragging the ship on to the grid and dropping the start of the ship into a coordinate.
    #### **Images**  
    <!-- Insert image here -->
  ### Game begin screen
  The Game begin screen is actually a modal which will pop up when the user has placed their last ship. It will ask the user to confirm if they would like to begin the game. The user can click yes, which will officially start the game, or no, which will move the last placed ship back to the fleet and allow the user to reposition their ships if wanted.
   <!-- Insert image here -->