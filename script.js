document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector("#sudoku-board tbody");

    for (let i = 0; i < 9; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("td");
            let input = document.createElement("input");

            input.setAttribute("type", "text");
            input.setAttribute("maxlength", "1");
            input.addEventListener("input", (e) => {
                if (!/^[1-9]$/.test(e.target.value)) {
                    e.target.value = "";
                }
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
});
