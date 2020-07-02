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
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />);
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
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
                ? `Go to move #${move}`
                : `Go to game start`;
            
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        })
    }

    handleClick(i) {
        const current = this.getCurrent();
        if (this.state.winner || current.squares[i]) return;

        const squares = current.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const xIsNext = !this.state.xIsNext;
        const winner = calculateWinner(squares);

        this.setState({
            history: history.concat([{squares}]),
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
