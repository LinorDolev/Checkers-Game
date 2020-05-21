import React from "react";
import "./Game.css";
import Board from "../../components/Board/Board";

const ROWS = 8,
    COLS = 8;

const BLACK_CHEQUER = "BlackChequer",
    WHITE_CHEQUER = "WhiteChequer";
const BLACK = "Black",
    WHITE = "White";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardGame: this.buildBoard(),
            turn: BLACK,
            glowChequers: [],
            currentPiece: null,
            killArr: []
        };
    }

    checkRange(index) {
        return index >= 0 && index < ROWS;
    }

    checkDirection(boardGame, i, j, iDelta, jDelta, glowChequers, killArr) {
        let newRow = i + iDelta;
        let newCol = j + jDelta;
        if (this.checkRange(newRow) && this.checkRange(newCol)) {
            if (boardGame[newRow][newCol].piece === null) {
                glowChequers.push(boardGame[newRow][newCol]);
            }
            else {
                newRow += iDelta;
                newCol += jDelta;
                if (this.checkRange(newRow) && this.checkRange(newCol)) {
                    if (boardGame[newRow][newCol].piece === null) {
                        glowChequers.push(boardGame[newRow][newCol]);
                        killArr.push({
                            newRow, 
                            newCol, 
                            chequerToClean: boardGame[newRow - iDelta][newCol - jDelta]
                        })
                    }
                }
            }
        }
    }

    showPossibleMoves(boardGame, i, j, glowChequers, killArr) {
        let pieceColor = boardGame[i][j].piece.pieceColor;
        let iDelta = pieceColor === BLACK ? -1 : 1;
        
        this.checkDirection(boardGame, i, j, iDelta, 1, glowChequers, killArr);
        this.checkDirection(boardGame, i, j, iDelta, -1, glowChequers, killArr);
        if(boardGame[i][j].piece.king){
            this.checkDirection(boardGame, i, j, -iDelta, 1, glowChequers, killArr);
            this.checkDirection(boardGame, i, j, -iDelta, -1, glowChequers, killArr);
        }
    }

    onSelectChequer(i, j) {
        let boardGame = this.state.boardGame;
        let glowChequers = this.state.glowChequers;
        let currentPiece = boardGame[i][j].piece;
        let killArr = [];

        if (boardGame[i][j].piece.pieceColor !== this.state.turn) 
            return;

        if (glowChequers.length !== 0) {
            glowChequers.forEach(chequer => {
                chequer.glow = false;
            });
            glowChequers = [];
        }

        this.showPossibleMoves(boardGame, i, j, glowChequers, killArr);
        glowChequers.forEach(chequer => (chequer.glow = true));
        this.setState({ boardGame, glowChequers, currentPiece, killArr });
        // TODO check if king
    }

    checkIfPieceIsKing(piece, i, j){
        if((piece.pieceColor === BLACK && i === 0) 
            || (piece.pieceColor === WHITE && i === ROWS - 1)){
            piece.king = true;
        }
    }

    onMoveHere(i, j) {
        let currentPiece = this.state.currentPiece;
        let boardGame = this.state.boardGame;
        let glowChequers = this.state.glowChequers;
        let killArr = this.state.killArr;

        this.checkIfPieceIsKing(currentPiece, i, j);

        killArr.forEach(killInfo => {
          if(killInfo.newRow === i && killInfo.newCol === j){
              killInfo.chequerToClean.piece = null;
          }  
        });

        boardGame[currentPiece.i][currentPiece.j].piece = null;
        currentPiece.i = i;
        currentPiece.j = j;
        boardGame[i][j].piece = currentPiece;
        currentPiece = null;

        let turn = this.state.turn === BLACK ? WHITE : BLACK;
        
        glowChequers.forEach(chequer => (chequer.glow = false));
        glowChequers = [];

        this.setState({ boardGame, currentPiece, turn, glowChequers, killArr:[]});
    }

    buildBoard() {
        let board = [];
        for (let i = 0; i < ROWS; i++) {
            let row = [];
            for (let j = 0; j < COLS; j++) {
                let chequerColor = BLACK_CHEQUER;
                let pieceColor = null;
                if (i % 2 === j % 2) {
                    chequerColor = WHITE_CHEQUER;
                } else if (i < 3) {
                    pieceColor = WHITE;
                } else if (i >= ROWS - 3) {
                    pieceColor = BLACK;
                }
                let piece = { i, j, pieceColor };
                if (pieceColor === null) {
                    piece = null;
                }
                let chequer = {
                    chequerColor,
                    onSelectChequer: this.onSelectChequer.bind(this),
                    onMoveHere: this.onMoveHere.bind(this),
                    i,
                    j
                };
                row.push({ chequer, piece, glow: false });
            }
            board.push(row);
        }
        return board;
    }

    render() {
        return (
            <div className="Game">
                <h1>Turn: {this.state.turn}</h1>
                <Board boardGame={this.state.boardGame} />
            </div>
        );
    }
}

export default Game;
