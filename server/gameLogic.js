const { validateMove, applyMove, checkGameOver } = require('./moveValidation');
const logger = require('./utils'); 

let currentPlayer = 'A';
const gridSize = 5;
const initialState = {
    A: ['A-P1', 'A-P2', 'A-P3', 'A-H1', 'A-H2'],
    B: ['B-P1', 'B-P2', 'B-P3', 'B-H1', 'B-H2']
};
let gameState = { ...initialState };

function handleMove({ player, character, move }) {
    logger.info(`Player ${player} is attempting to move ${character} to ${move}`);
    
    try {
        if (player !== currentPlayer) {
            throw new Error("It's not your turn.");
        }

        if (!validateMove(player, character, move, gameState)) {
            throw new Error("Invalid move.");
        }

        gameState = applyMove(player, character, move, gameState);

        if (checkGameOver(gameState)) {
            logger.info(`Game over! Player ${currentPlayer} wins!`);
            return { status: 'gameOver', winner: currentPlayer };
        }

        // Switch to the next player
        currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
        logger.info(`Move successful. Next player: ${currentPlayer}`);
        return { status: 'continue', gameState, currentPlayer };
    } catch (error) {
        logger.error(`Error during move: ${error.message}`);
        return { status: 'error', message: error.message };
    }
}

function resetGame() {
    logger.info('Game reset.');
    currentPlayer = 'A';
    gameState = { ...initialState };
    return gameState;
}

module.exports = { handleMove, resetGame, gameState };
