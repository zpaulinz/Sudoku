document.addEventListener("DOMContentLoaded", () => {
    const successMessage = document.getElementById("success-message");
    const board = document.querySelector("#sudoku-board tbody");
    const newGameButton = document.querySelector("#new-game");
    const difficultyModal = document.getElementById("difficulty-modal");
    const startGameButton = document.querySelector("#start-game");
    
    let selectedDifficulty = "easy";
    let solution = []

    // "New Game" Button - Show Difficulty Modal
    newGameButton.addEventListener("click", () => {
        const modal = new bootstrap.Modal(difficultyModal);
        modal.show();
    });

    // Difficulty Level Selection
    document.querySelectorAll(".difficulty input").forEach(input => {
        input.addEventListener("change", (event) => {
            selectedDifficulty = event.target.id.replace("difficulty-", "");
        });
    });

    // "Confirm" Button -> Generate Sudoku
    startGameButton.addEventListener("click", () => {
        generateSudoku(selectedDifficulty);
        const modalInstance = bootstrap.Modal.getInstance(difficultyModal);
        modalInstance.hide();
    });

    // Create Empty Sudoku Board
    function createEmptyBoard() {
        board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 9; j++) {
                let cell = document.createElement("td");
                let input = document.createElement("input");

                input.setAttribute("type", "text");
                input.setAttribute("maxlength", "1");
                input.setAttribute("readonly", "true");

                cell.appendChild(input);
                row.appendChild(cell);
            }
            board.appendChild(row);
        } 
    }

    createEmptyBoard();

    // Check If User's Input Matches Solution
     function checkSolution() {
        let cells = board.querySelectorAll("input");
        let index = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let input = cells[index++];
                if (parseInt(input.value) !== solution[i][j]) {
                    return false;
                }
            }
        }
        
        successMessage.style.visibility = "visible"; 
        return true;   
    }

    // Generate Full Sudoku Board
    function generateFullSudoku() {
        let board = new Array(9).fill(null).map(() => new Array(9).fill(0));

        function isValid(num, row, col) {
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num || board[i][col] === num) return false;
                let boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
                let boxCol = 3 * Math.floor(col / 3) + (i % 3);
                if (board[boxRow][boxCol] === num) return false;
            }
            return true;
        }

        function fillBoard(row, col) {
            if (row === 9) return true;
            if (col === 9) return fillBoard(row + 1, 0);
            if (board[row][col] !== 0) return fillBoard(row, col + 1);

            let numbers = [...Array(9).keys()].map(n => n + 1).sort(() => Math.random() - 0.5);
            for (let num of numbers) {
                if (isValid(num, row, col)) {
                    board[row][col] = num;
                    if (fillBoard(row, col + 1)) return true;
                    board[row][col] = 0;
                }
            }
            return false;
        }

        fillBoard(0, 0);
        return board;
    }

    // Generate Sudoku Puzzle with Missing Values (Removing Numbers)
    function createSudokuPuzzle(difficulty) {
        let solutionBoard = generateFullSudoku();
        let puzzle = JSON.parse(JSON.stringify(solutionBoard)); // Copy for User

        let removeCount = difficulty === "easy" ? 20 : difficulty === "medium" ? 40 : 55;
        while (removeCount > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0; 
                removeCount--;
            }
        }

        return { puzzle, solutionBoard };
    }

    // Generate And Display New Sudoku Puzzle
    function generateSudoku(difficulty) {
        let { puzzle, solutionBoard } = createSudokuPuzzle(difficulty);
        solution = solutionBoard;
        successMessage.style.visibility = "hidden";  

        // Fill The Board With Puzzle Values
        let cells = board.querySelectorAll("input");
        let index = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let input = cells[index++];
                if (puzzle[i][j] !== 0) {
                    input.value = puzzle[i][j];
                    input.setAttribute("readonly", "true"); 
                    input.classList.remove("user-input"); 
                } else {
                    input.value = "";
                    input.removeAttribute("readonly"); 
                    input.classList.add("user-input");     
                }

                // Validation Of Entered Numbers
                input.addEventListener("input", (e) => {
                    if (!/^[1-9]$/.test(e.target.value)) {
                        e.target.value = "";
                    }
                    checkSolution();
                });
            }
        }
    }

});
