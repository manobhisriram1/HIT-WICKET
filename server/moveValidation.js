const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

let gameState = {
    grid: {}, 
    positions: {}, 
    currentPlayer: 'A',
    status: 'ongoing'
};

const initialPositions = {
    A: ['A-P1', 'A-H1', 'A-P2', 'A-H2', 'A-P3'],
    B: ['B-P1', 'B-H1', 'B-P2', 'B-H2', 'B-P3']
};


function initializeGame() {
    gameState.grid = {};
    gameState.positions = {};

    initialPositions.A.forEach((char, index) => {
        const position = [4, index]; 
        gameState.grid[positionKey(position)] = char;
        gameState.positions[char] = position;
    });

    initialPositions.B.forEach((char, index) => {
        const position = [0, index]; 
        gameState.grid[positionKey(position)] = char;
        gameState.positions[char] = position;
    });

    gameState.currentPlayer = 'A';
    gameState.status = 'ongoing';
}

server.on('connection', ws => {
    ws.on('message', message => {
        const { type, payload } = JSON.parse(message);

        if (type === 'initialize') {
            initializeGame();
            broadcastGameState();
        } else if (type === 'move') {
            handleMove(payload.player, payload.character, payload.move);
        }
    });
});

function handleMove(player, character, move) {
    if (player !== gameState.currentPlayer || gameState.status !== 'ongoing') {
        return;
    }

    if (!validateMove(player, character, move, gameState)) {
        broadcastInvalidMove();
        return;
    }

    const characterPosition = gameState.positions[character];
    const moveSteps = character.startsWith('H1') || character.startsWith('H2') ? 2 : 1;
    const targetPosition = getTargetPosition(characterPosition, move, moveSteps);

    // Remove opponent's character if present
    const targetKey = positionKey(targetPosition);
    const targetCharacter = gameState.grid[targetKey];
    if (targetCharacter && targetCharacter[0] !== player) {
        delete gameState.positions[targetCharacter];
    }

    // Update the grid and positions
    delete gameState.grid[positionKey(characterPosition)];
    gameState.grid[targetKey] = character;
    gameState.positions[character] = targetPosition;

    // Check for game over condition
    if (Object.values(gameState.grid).filter(char => char[0] !== player).length === 0) {
        gameState.status = 'over';
        broadcastGameOver(player);
    } else {
        // Switch turns
        gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
        broadcastGameState();
    }
}

function validateMove(player, character, move, gameState) {
    const characterPosition = gameState.positions[character];
    
    if (!characterPosition) {
        return false;
    }

    const moveSteps = character.startsWith('H1') || character.startsWith('H2') ? 2 : 1;
    const targetPosition = getTargetPosition(characterPosition, move, moveSteps);

    if (!isWithinBounds(targetPosition)) {
        return false;
    }

    const targetKey = positionKey(targetPosition);
    const targetCharacter = gameState.grid[targetKey];

    if (targetCharacter && targetCharacter[0] === player) {
        return false;
    }

    if (character.startsWith('P')) {
        if (move === 'L' || move === 'R') {
            return !targetCharacter; 
        }
        if (move === 'F' || move === 'B') {
            return !targetCharacter || targetCharacter[0] !== player; 
        }
    }

    return true;
}

function getTargetPosition(position, move, steps) {
    let [row, col] = position;
    switch (move) {
        case 'L': col -= steps; break;
        case 'R': col += steps; break;
        case 'F': row -= steps; break;
        case 'B': row += steps; break;
        case 'FL': row -= steps; col -= steps; break;
        case 'FR': row -= steps; col += steps; break;
        case 'BL': row += steps; col -= steps; break;
        case 'BR': row += steps; col += steps; break;
    }
    return [row, col];
}

function isWithinBounds([row, col]) {
    return row >= 0 && row < 5 && col >= 0 && col < 5;
}

function positionKey([row, col]) {
    return `${row},${col}`;
}

function broadcastGameState() {
    const stateMessage = JSON.stringify({ type: 'state', payload: gameState });
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(stateMessage);
        }
    });
}

function broadcastInvalidMove() {
    const invalidMoveMessage = JSON.stringify({ type: 'invalidMove' });
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(invalidMoveMessage);
        }
    });
}

function broadcastGameOver(winner) {
    const gameOverMessage = JSON.stringify({ type: 'gameOver', payload: { winner } });
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(gameOverMessage);
        }
    });
}
