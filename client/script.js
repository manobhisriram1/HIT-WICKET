let selectedCharacter = null;
let selectedSquare = null;
let gameState = {};
let currentPlayer = 'A';

const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (message) => {
    const data = JSON.parse(message.data);

    if (data.status === 'connected') {
        console.log('Connected to the server');
    } else if (data.status === 'gameOver') {
        document.getElementById('game-status').textContent = `Game Over! Winner: ${data.winner}`;
        disableMoveButtons();
    } else if (data.status === 'continue') {
        gameState = data.gameState;
        currentPlayer = data.currentPlayer;
        updateBoard(gameState);
        updateCurrentPlayer(currentPlayer);
    } else if (data.status === 'reset') {
        gameState = data.gameState;
        resetBoard();
        updateCurrentPlayer('A');
        enableMoveButtons();
    } else if (data.status === 'error') {
        document.getElementById('game-status').textContent = `Error: ${data.message}`;
    }
};

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);

document.querySelectorAll('.move-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const move = e.target.dataset.move;
        if (selectedCharacter) {
            sendMove(selectedCharacter, move);
        }
    });
});

function startGame() {
    ws.send(JSON.stringify({ type: 'start' }));
    enableMoveButtons();
    document.getElementById('game-status').textContent = 'Game Started!';
}

function resetGame() {
    ws.send(JSON.stringify({ type: 'reset' }));
}

function sendMove(character, move) {
    ws.send(JSON.stringify({
        type: 'move',
        payload: { player: currentPlayer, character, move }
    }));
}

function updateBoard(gameState) {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; 

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const position = `row${row}-col${col}`;
            const character = gameState[position];

            if (character) {
                cell.classList.add('occupied');
                cell.textContent = character;
            }

            cell.addEventListener('click', () => selectSquare(position, character, cell));
            board.appendChild(cell);
        }
    }
}

function selectSquare(position, character, cell) {
    selectedSquare = position;
    selectedCharacter = character;

    document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');

    document.getElementById('selected-square').textContent = `Selected: ${selectedSquare}`;
    document.getElementById('valid-moves').textContent = `Valid Moves for ${selectedCharacter}: ${getValidMoves(selectedCharacter)}`;
}

function getValidMoves(character) {
    if (!character) return 'None';

    switch (character.split('-')[1][0]) {
        case 'P':
            return 'L, R, F, B';
        case 'H1':
            return 'L, R, F, B';
        case 'H2':
            return 'FL, FR, BL, BR';
    }
}

function updateCurrentPlayer(player) {
    document.getElementById('current-player').textContent = `Current Player: ${player}`;
}

function resetBoard() {
    updateBoard(gameState);
    document.getElementById('game-status').textContent = 'Game Reset!';
    document.getElementById('selected-square').textContent = 'Selected: ';
    document.getElementById('valid-moves').textContent = 'Valid Moves: ';
}

function disableMoveButtons() {
    document.querySelectorAll('.move-btn').forEach(btn => btn.disabled = true);
}

function enableMoveButtons() {
    document.querySelectorAll('.move-btn').forEach(btn => btn.disabled = false);
}
