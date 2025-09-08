document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const gameMessageElement = document.getElementById('game-message');
    const gameOverElement = document.getElementById('game-over');
    const gameOverTextElement = document.getElementById('game-over-text');
    const newGameBtn = document.getElementById('new-game-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    
    // Game variables
    let board = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let hasWon = false;
    let gameOver = false;
    
    // Initialize best score display
    bestScoreElement.textContent = bestScore;
    
    // Initialize game
    function initGame() {
        // Reset game state
        board = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        hasWon = false;
        gameOver = false;
        
        // Update UI
        updateScore();
        gameMessageElement.textContent = '';
        gameOverElement.style.display = 'none';
        
        // Clear existing tiles
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.remove());
        
        // Add two initial tiles
        addNewTile();
        addNewTile();
        
        // Update the board display
        updateBoard();
    }
    
    // Update score display
    function updateScore() {
        scoreElement.textContent = score;
        
        if (score > bestScore) {
            bestScore = score;
            bestScoreElement.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }
    
    // Add a new tile to the board
    function addNewTile() {
        const emptyCells = [];
        
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 0) {
                    emptyCells.push({r, c});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    // Update the board display
    function updateBoard() {
        // Clear existing tiles
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.remove());
        
        // Create new tiles
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${board[r][c]}`;
                    tile.textContent = board[r][c];
                    
                    // Calculate position based on grid
                    const cellSize = 25; // 25% of container width
                    const gapSize = 2.5; // Gap between cells
                    
                    tile.style.left = `${c * cellSize + (c + 1) * gapSize}%`;
                    tile.style.top = `${r * cellSize + (r + 1) * gapSize}%`;
                    gameBoard.appendChild(tile);
                }
            }
        }
    }
    
    // Move tiles in the specified direction
    function move(direction) {
        if (gameOver) return false;
        
        let moved = false;
        const newBoard = JSON.parse(JSON.stringify(board));
        
        // Process movement based on direction
        if (direction === 'left') {
            for (let r = 0; r < 4; r++) {
                const row = newBoard[r].filter(val => val !== 0);
                
                // Merge tiles
                for (let c = 0; c < row.length - 1; c++) {
                    if (row[c] === row[c + 1]) {
                        row[c] *= 2;
                        score += row[c];
                        row.splice(c + 1, 1);
                        
                        // Check for win
                        if (row[c] === 2048 && !hasWon) {
                            hasWon = true;
                            gameMessageElement.textContent = "You've reached 2048! Keep going!";
                        }
                    }
                }
                
                // Fill with zeros
                while (row.length < 4) {
                    row.push(0);
                }
                
                // Check if row changed
                for (let c = 0; c < 4; c++) {
                    if (board[r][c] !== row[c]) {
                        moved = true;
                    }
                }
                
                newBoard[r] = row;
            }
        } else if (direction === 'right') {
            for (let r = 0; r < 4; r++) {
                const row = newBoard[r].filter(val => val !== 0);
                
                // Merge tiles from right
                for (let c = row.length - 1; c > 0; c--) {
                    if (row[c] === row[c - 1]) {
                        row[c] *= 2;
                        score += row[c];
                        row.splice(c - 1, 1);
                        c--;
                        
                        // Check for win
                        if (row[c] === 2048 && !hasWon) {
                            hasWon = true;
                            gameMessageElement.textContent = "You've reached 2048! Keep going!";
                        }
                    }
                }
                
                // Fill with zeros at the beginning
                while (row.length < 4) {
                    row.unshift(0);
                }
                
                // Check if row changed
                for (let c = 0; c < 4; c++) {
                    if (board[r][c] !== row[c]) {
                        moved = true;
                    }
                }
                
                newBoard[r] = row;
            }
        } else if (direction === 'up') {
            for (let c = 0; c < 4; c++) {
                const column = [];
                for (let r = 0; r < 4; r++) {
                    if (newBoard[r][c] !== 0) {
                        column.push(newBoard[r][c]);
                    }
                }
                
                // Merge tiles
                for (let r = 0; r < column.length - 1; r++) {
                    if (column[r] === column[r + 1]) {
                        column[r] *= 2;
                        score += column[r];
                        column.splice(r + 1, 1);
                        
                        // Check for win
                        if (column[r] === 2048 && !hasWon) {
                            hasWon = true;
                            gameMessageElement.textContent = "You've reached 2048! Keep going!";
                        }
                    }
                }
                
                // Fill with zeros
                while (column.length < 4) {
                    column.push(0);
                }
                
                // Check if column changed
                for (let r = 0; r < 4; r++) {
                    if (board[r][c] !== column[r]) {
                        moved = true;
                    }
                    newBoard[r][c] = column[r];
                }
            }
        } else if (direction === 'down') {
            for (let c = 0; c < 4; c++) {
                const column = [];
                for (let r = 0; r < 4; r++) {
                    if (newBoard[r][c] !== 0) {
                        column.push(newBoard[r][c]);
                    }
                }
                
                // Merge tiles from bottom
                for (let r = column.length - 1; r > 0; r--) {
                    if (column[r] === column[r - 1]) {
                        column[r] *= 2;
                        score += column[r];
                        column.splice(r - 1, 1);
                        r--;
                        
                        // Check for win
                        if (column[r] === 2048 && !hasWon) {
                            hasWon = true;
                            gameMessageElement.textContent = "You've reached 2048! Keep going!";
                        }
                    }
                }
                
                // Fill with zeros at the beginning
                while (column.length < 4) {
                    column.unshift(0);
                }
                
                // Check if column changed
                for (let r = 0; r < 4; r++) {
                    if (board[r][c] !== column[r]) {
                        moved = true;
                    }
                    newBoard[r][c] = column[r];
                }
            }
        }
        
        if (moved) {
            board = newBoard;
            updateScore();
            addNewTile();
            updateBoard();
            
            // Check if game is over
            if (isGameOver()) {
                gameOver = true;
                gameOverElement.style.display = 'flex';
                gameOverTextElement.textContent = 'Game Over!';
            }
        }
        
        return moved;
    }
    
    // Check if the game is over
    function isGameOver() {
        // Check for empty cells
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const current = board[r][c];
                
                // Check right
                if (c < 3 && board[r][c + 1] === current) {
                    return false;
                }
                
                // Check down
                if (r < 3 && board[r + 1][c] === current) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            move('left');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            move('right');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            move('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            move('down');
        }
    });
    
    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    gameBoard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    gameBoard.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                // Swipe left
                move('left');
            } else {
                // Swipe right
                move('right');
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                // Swipe up
                move('up');
            } else {
                // Swipe down
                move('down');
            }
        }
    }
    
    // Button event listeners
    newGameBtn.addEventListener('click', initGame);
    tryAgainBtn.addEventListener('click', initGame);
    
    // Initialize the game
    initGame();
});
