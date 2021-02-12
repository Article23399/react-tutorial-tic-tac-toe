import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={`square ${props.value.highLight ? "active" : "null"}`}
            onClick={props.onClick}>
            {props.value.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(i, length) {
        return Array(length).fill(null).map((value, index) => {
            return this.renderSquare(i * length + index);
        });
    }

    render() {
        const row = 3;
        const col = 3;
        const board = Array(row).fill(null).map((value, index) => {
            return (
                <div key={index} className="board-row">
                    {this.renderRow(index, col)}
                </div>
            )
        });

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill({
                        value: null,
                        highLight: false
                    }),
                    pos: null
                }
            ],
            xIsNext: false,
            stepNumber: 0,
            historyOrderReversed: false
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i].value) {
            return;
        }

        squares[i] = {
            value: this.state.xIsNext ? 'X' : 'O',
            highLight: false
        };
        this.setState({
            history: history.concat([{squares: squares, pos: '(' + (i % 3) + ',' + Math.floor(i / 3) + ')'}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: ((this.state.stepNumber - step) % 2) === 0 ? this.state.xIsNext : !this.state.xIsNext,
        })
    }

    highLightText(current, a, b, c) {
        current[a] = {
            ...current[a], highLight: true
        };
        current[b] = {
            ...current[b], highLight: true
        };
        current[c] = {
            ...current[c], highLight: true
        };
    }

    reverseHistoryOrder() {
        this.setState({
            ...this.state, historyOrderReversed: !this.state.historyOrderReversed
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];


        const winner = calculateWinner(current.squares);

        console.log(winner);

        const moves = history.map((step, move) => {
            const pos = step.pos;
            const desc = move ?
                'Go to move #' + move + ' pos ' + pos :
                'Go to Game start';
            return (
                <li key={move} >
                    <button style={{fontWeight: (move === this.state.stepNumber) ? "bold" : "normal"}} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner.value;
            this.highLightText(current.squares, winner.a, winner.b, winner.c);
        } else if (this.state.stepNumber < 9) {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } else {
            status = 'Game end, draw';
        }

        console.log(current);

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.reverseHistoryOrder()}>
                        {this.state.historyOrderReversed ? 'ascending' : 'descending'}
                    </button>
                    <ol reversed={this.state.historyOrderReversed}>
                        {this.state.historyOrderReversed ? moves.reverse() : moves}
                    </ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
            return {winner: squares[a], a:a, b:b, c:c};
        }
    }
    return null;
}