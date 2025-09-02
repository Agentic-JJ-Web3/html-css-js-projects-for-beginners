# Word Search Puzzle

This project is a classic word search game built with HTML, CSS, and JavaScript. It features a dynamic grid, various categories and difficulties, and a clean, modern user interface.

## How It Works

The project is composed of three main files:

- `index.html`: The main HTML file that defines the structure of the web page.
- `styles.css`: The CSS file that styles the game, including the grid, words, and overall layout.
- `script.js`: The JavaScript file that contains all the game logic.

### `index.html`

-   **Structure**: Sets up the game's layout, including the header, game container, puzzle grid, word list, and control buttons.
-   **Game Elements**: Defines `div` elements that will be populated by JavaScript to create the puzzle grid and the list of words to find.
-   **Controls**: Includes buttons for "New Game", "Hint", and dropdowns for selecting difficulty and category.
-   **Scripts**: Links to the `styles.css` for styling and the `script.js` for functionality.

### `styles.css`

-   **Layout**: Uses CSS Grid to create the main layout of the game container.
-   **Grid Styling**: Styles the word search grid and the individual cells. It includes hover effects and styles for when letters are selected or a word is found.
-   **Word List**: Styles the list of words, including a strikethrough effect for words that have been found.
-   **Responsiveness**: Includes media queries to ensure the game is playable on smaller screens.
-   **Visuals**: Adds an animated "aurora" background and floating particles for a more engaging user experience.

### `script.js`

This file contains the core logic of the game, encapsulated within a `WordSearchGame` class.

-   **Game State**: Manages the grid size, the words to be found, found words, and the current selection.
-   **Word Bank**: Contains a comprehensive list of words organized by category (e.g., Technology, Animals, Food) and difficulty (Easy, Medium, Hard).
-   **Grid Generation**:
    -   `createGrid()`: Initializes an empty 2D array for the grid.
    -   `placeWords()`: Randomly places the words from the word list onto the grid. It tries to place words horizontally, vertically, and diagonally in both forward and backward directions.
    -   `fillEmptyCells()`: Fills the remaining empty cells in the grid with random letters.
-   **Rendering**:
    -   `renderGrid()`: Creates the HTML `div` elements for each cell and displays them on the page.
    -   `renderWordList()`: Displays the list of words to be found.
-   **User Interaction**:
    -   `setupEventListeners()`: Sets up event listeners for mouse and touch events (mousedown/touchstart, mouseover/touchmove, mouseup/touchend) to handle the letter selection process.
    -   `startSelection()`, `updateSelection()`, `endSelection()`: These methods manage the process of a user clicking and dragging to select a word.
-   **Game Logic**:
    -   `checkWord()`: When the user finishes a selection, this logic checks if the selected letters form a valid word from the list (forwards or backwards).
    -   `markWordAsFound()`: If a word is found, it's marked, styled, and the UI is updated.
    -   `gameComplete()`: Displays a completion message when all words are found.
-   **Features**:
    -   **Timer**: Tracks how long the player takes.
    -   **Hints**: Allows the player to get a hint to find a word.
    -   **Difficulty/Category Selection**: Lets the user change the game's difficulty and word category, which dynamically regenerates the puzzle.
    -   **Local Storage**: Remembers the player's name between sessions.

## How to Run

1.  Clone or download the repository.
2.  Open the `index.html` file in any modern web browser.

No special setup or dependencies are required.
