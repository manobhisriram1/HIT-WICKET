const http = require('http');
const WebSocket = require('ws');
const { handleMove, resetGame } = require('./gameLogic');
const port = 3000;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let gameState = {
    positions: {},
    grid: {},
    currentPlayer: 'A',
    status: 'Setup',
    moveHistory: []
};

function broadcastState(update = {}) {
    const message = JSON.stringify({ type: 'state', payload: gameState });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
    if (update.type) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(update));
            }
        });
    }
}

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const { type, payload } = JSON.parse(message);

        if (type === 'initialize') {
            gameState = resetGame();
            broadcastState();
        } else if (type === 'move') {
            const { player, character, move } = payload;
            const result = handleMove({ player, character, move });
            
            if (result.status === 'gameOver') {
                broadcastState({ type: 'gameOver', payload: { winner: result.winner } });
                gameState.status = 'Game Over';
            } else if (result.status === 'error') {
                ws.send(JSON.stringify({ type: 'error', payload: { message: result.message } }));
            } else {
                gameState = result.gameState;
                gameState.currentPlayer = result.currentPlayer;
                broadcastState();
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on ws://localhost:${port}`);
});
