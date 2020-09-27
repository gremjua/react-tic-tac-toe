import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button className="square" onClick={props.onClick} style={{fontWeight: props.bold?'bold':'normal'}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  createSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        bold={this.props.boldSquares?.includes(i)}
      />
    );
  }

  createBoard() {
    let board = [];
    for(let i=0; i<3; i++){
      let row = [];
      for(let j=0; j<3; j++){
        row.push(this.createSquare(i*3+j));
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div>
        {board}
      </div>
    );
  }

  render() {
    return this.createBoard();
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        history: [{
            squares: Array(9).fill(null),
            position: null,
            move: 0
        }],
        stepNumber: 0,
        xIsNext: true,
        reverseMoves: false
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if ( calculateWinner(squares) || squares[i] ) {
        return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
          squares: squares,
          position: i,
          move: history.length
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
    });
  }
  toggleMovesOrder() {
    this.setState({
      reverseMoves: !this.state.reverseMoves
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = (this.state.reverseMoves ? [...history].reverse() : [...history])
      .map((step, index) => {
        const desc = step.move ? 
            `Go to move #${step.move} (${getRow(step.position)}, ${getCol(step.position)})`:
            'Go to game start';
        const style = {'fontWeight': this.state.stepNumber === step.move ? 'bold' : 'normal'};
        return (
            <li key={index} style={style}>
                <button onClick={() => this.jumpTo(step.move)} style={style}>{desc}</button>
            </li>
        );     
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = `Next player: ${this.state.xIsNext?'X':'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            boldSquares={winner?.squares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <input type="checkbox" onChange={() => this.toggleMovesOrder()}/>
            <label>Reverse moves order</label>
          </div>
          <ul>{moves}</ul>
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {player: squares[a], squares: lines[i]};
    }
  }
  return null;
}

function getCol(i) {
    return i % 3;
}

function getRow(i) {
    return Math.floor(i / 3);
}