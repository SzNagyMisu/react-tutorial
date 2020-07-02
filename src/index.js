import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {calculateWinner} from './helpers'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />);
    }

    render() {
        return (
            <div>
                {Array(3).fill(null).map((_value, row) => (
                    <div className="board-row" key={row}>
                        {Array(3).fill(null).map((_value, col) => (
                            this.renderSquare(row * 3 + col)
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            winner: null,
        };
    }


    getCurrent() {
        return this.state.history[this.state.stepNumber];
    }

    getStatus() {
        return this.state.winner
            ? `Winner: ${this.state.winner}`
            : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    getMoves() {
        return this.state.history.map((step, move) => {
            const desc = move
                ? this.getDescriptionForStep(step, move)
                : `Go to game start`;
            const selectedClass = move === this.state.stepNumber ? 'selected' : null
            
            return (
                <li key={move}>
                    <button
                        className={selectedClass}
                        onClick={() => this.jumpTo(move)}
                    >{desc}</button>
                </li>
            );
        });
    }

    getDescriptionForStep(step, nr) {
        const {player, row, column} = step.move;
        return `Go to move #${nr} (${player}: ${row}, ${column})`
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
            winner: calculateWinner(this.state.history[step].squares),
        });
    }

    handleClick(i) {
        const current = this.getCurrent();
        if (this.state.winner || current.squares[i]) return;

        const squares = current.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const move = {
            player: squares[i],
            row: Math.floor(i / 3) + 1,
            column: i % 3 + 1,
        };
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const xIsNext = !this.state.xIsNext;
        const winner = calculateWinner(squares);

        this.setState({
            history: history.concat([{squares, move}]),
            stepNumber: history.length,
            xIsNext,
            winner,
        });
    }

    render() {
        const current = this.getCurrent();
        const status = this.getStatus();
        const moves = this.getMoves();

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
