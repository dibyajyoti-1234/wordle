document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit");
    const rows = document.querySelectorAll(".row");
    let currentRow = 0;
    let currentCellIndex = 0;
    let wordToGuess = "";

    // Function to fetch words from the words.txt file and choose one randomly
    function fetchWordList() {
        fetch("words.txt")
            .then(response => response.text())
            .then(data => {
                const words = data.split("\n").map(word => word.trim().toUpperCase());
                wordToGuess = words[Math.floor(Math.random() * words.length)];
                console.log("Word to guess:", wordToGuess); // For debugging purposes

                // Display the fetched word for testing
                document.getElementById("word-text").textContent = wordToGuess;
            })
            .catch(error => console.error('Error fetching word list:', error));
    }

    // Call the function to fetch the word list and select a word
    fetchWordList();

    function evaluateGuess() {
        const cells = rows[currentRow].querySelectorAll(".cell");
        let guess = "";
        cells.forEach(cell => {
            guess += cell.value.toUpperCase();
        });

        if (guess.length !== 5) return;

        for (let i = 0; i < 5; i++) {
            if (guess[i] === wordToGuess[i]) {
                cells[i].classList.add("correct");
            } else if (wordToGuess.includes(guess[i])) {
                cells[i].classList.add("present");
            } else {
                cells[i].classList.add("absent");
            }
        }

        if (guess === wordToGuess) {
            alert("Congratulations! You've guessed the word!");
        } else if (currentRow === 5) {
            alert(`Game Over! The word was ${wordToGuess}.`);
        } else {
            enableNextRow();
        }
    }

    function enableNextRow() {
        currentRow++;
        currentCellIndex = 0;
        const nextRowCells = rows[currentRow].querySelectorAll(".cell");
        nextRowCells.forEach(cell => cell.disabled = false);
    }

    function handleTyping(e) {
        const currentRowCells = rows[currentRow].querySelectorAll(".cell");
        if (e.key >= 'a' && e.key <= 'z' || e.key >= 'A' && e.key <= 'Z') {
            if (currentCellIndex < 5) {
                currentRowCells[currentCellIndex].value = e.key.toUpperCase();
                currentCellIndex++;
            }
        } else if (e.key === 'Backspace') {
            if (currentCellIndex > 0) {
                currentCellIndex--;
                currentRowCells[currentCellIndex].value = "";
            }
        } else if (e.key === 'Enter') {
            evaluateGuess();
        }
    }

    document.addEventListener("keydown", handleTyping);
    submitButton.addEventListener("click", evaluateGuess);
});
