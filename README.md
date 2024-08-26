Manobhi Sriram (21BPS1433)


# Turn-Based Chess-Like Game with WebSocket Communication

## Overview
This project is a turn-based chess-like game designed for real-time play using WebSocket communication. Players control teams of characters on a 5x5 grid, aiming to capture their opponent's pieces. The game supports two players with distinct movement rules for different character types and updates the game state in real-time.

## Components

### 1. Server
- **Language**: Node.js
- **Responsibilities**:
  - Implement core game logic.
  - Set up and manage the WebSocket server.
  - Process game moves and maintain the game state.
  - Broadcast game state updates to clients.

### 2. WebSocket Layer
- **Responsibilities**:
  - Handle real-time communication between the server and clients.
  - Manage events for game initialization, moves, state updates, and notifications.

### 3. Web Client
- **Technologies**: HTML, CSS, JavaScript
- **Responsibilities**:
  - Display the game board and controls.
  - Implement WebSocket communication with the server.
  - Render game state and provide interactive controls for players.

## Game Rules

### Setup
- **Grid**: 5x5
- **Characters per Player**: 5 (Pawns, Hero1, Hero2)
- **Initial Setup**: Players arrange their characters on their respective starting rows.

### Characters and Movement

#### Pawn
- Moves one block in any direction (L, R, F, B).

#### Hero1
- Moves two blocks straight in any direction.
- Captures any opponent's character in its path.

#### Hero2
- Moves two blocks diagonally in any direction.
- Captures any opponent's character in its path.

- **Move Commands**: FL (Forward-Left), FR (Forward-Right), BL (Backward-Left), BR (Backward-Right)

### Game Flow
- **Turns**: Players alternate turns, making one move per turn.
- **Combat**: Characters capture opponent's pieces in their path.
- **Invalid Moves**: Moves are invalid if they go out of bounds, are not valid for the character type, or target a friendly piece.
- **Game State Display**: Shows a 5x5 grid with all characters' positions.
- **Winning**: The game ends when one player eliminates all of the opponent’s characters.

## Features
- **Two Player Support**: Connects two players via WebSocket.
- **Real-Time Updates**: Reflects moves and game state in real-time.
- **Character Movements**: Includes different movement rules for various character types.
- **Game End Detection**: Detects when a player has won by capturing all opponent's characters.
- **Move History**: Displays the history of moves made during the game.

## Technologies
- **Backend**: Node.js, WebSocket
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: CSS Grid for layout

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- WebSocket-compatible browser (modern browsers like Chrome, Firefox, or Edge).

### Usage
- **Start Game**: Click the "Start Game" button to initialize the game.
- **Reset Game**: Click the "Reset Game" button to restart the game.
- **Move Characters**: Click on a character to select it, then use the move controls to make a move.
- **View Move History**: The move history panel will display all moves made during the game.

