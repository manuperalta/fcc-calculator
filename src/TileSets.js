import { NUMBERS, OPERATIONS, SYMBOLS } from "./numbops.js";
import React from "react";
export default function TileSets(props) {
  let numbTileSet = NUMBERS.map((x, i) => (
    <NumTile
      id={x}
      key={x}
      number={i.toString(10)}
      input={props.input}
      setInput={props.setInput}
    />
  ));
  let opTileSet = OPERATIONS.map((x, i) => (
    <OpTile
      id={x}
      key={x}
      symbol={SYMBOLS[i]}
      input={props.input}
      setInput={props.setInput}
    />
  ));
  return (
    <div id="tileset">
      {numbTileSet}
      {opTileSet}
      <Decimal input={props.input} setInput={props.setInput} />
      <Equals
        className="tile"
        input={props.input}
        setInput={props.setInput}
        total={props.total}
        setTotal={props.setTotal}
      />
      <button
        className="tile"
        id="clear"
        onClick={() => {
          props.setInput("0");
          props.setTotal(0);
        }}
      >
        C
      </button>
    </div>
  );
}
function NumTile(props) {
  let input = props.input;
  let setInput = props.setInput;
  let number = props.number;
  let endsWithOperation = /[+\-*/]$/;
  let handleClick = () => {
    if (input === "0") return setInput(number);
    if (number === "0" && endsWithOperation.test(input)) return; //prevents writing more than one zero immediately after an operation
    return setInput(input + number);
  };

  return (
    <button className="tile number" id={props.id} onClick={handleClick}>
      {props.number}
    </button>
  );
}
function OpTile(props) {
  let symbol = props.symbol;
  let input = props.input;
  let setInput = props.setInput;
  let handleClick = () => {
    if (input === "0" || input[input.length - 1] === symbol) return;
    else setInput(input + symbol);
  };
  return (
    <button className="tile operation" id={props.id} onClick={handleClick}>
      {props.symbol}
    </button>
  );
}
function Decimal(props) {
  let input = props.input;
  let setInput = props.setInput;
  let regex = /[0-9]*\.[0-9]*$/g;
  let currentNumber = input.match(regex);
  let handleClick = () => {
    if (currentNumber === null && !input.match(/[+\-*/]$/))
      // avoids putting decimals in numbers that already have one, and next to any operation sign.
      return setInput(input + ".");
    if (input.match(/[+\-*/]$/)) return setInput(input + "0.");
    return;
  };
  return (
    <button id="decimal" className="tile operation" onClick={handleClick}>
      {"."}
    </button>
  );
}
function Equals(props) {
  let input = props.input;
  let setInput = props.setInput;
  let setTotal = props.setTotal;
  let numRegex = /-{0,1}[0-9]+\.{0,1}[0-9]*/g;
  let numVector = input.match(numRegex).map((x) => Number(x));
  //this creates an array containing every number,
  //accounting for negative numbers.
  let opRegex = /[+\-*/]+/g;
  let opVector = input.match(opRegex);
  //this makes an array containing every operation
  let handleClick = () => {
    if (opVector === null || numVector === null) return setTotal(input);
    if (opVector[0] === "-" && numVector[0] < 0) opVector.shift();
    if (/[+\-*/]+$/.test(input)) opVector.pop();

    //since operations are always in-between numbers,
    //there should always be one less operations than there are numbers.
    //ex 30 + 12 - 44 * 2 : 4 numbers, 3 operations
    //this means operation[i] will always operate between number[i] and number[i+1].

    for (let i = 0; i < opVector.length; i++) {
      if (opVector[i].length > 2)
        opVector[i] = opVector[i].match(/[+\-*/]{2}$/)[0];
      if (opVector[i].length === 2) {
        if (opVector[i][1] === "-") {
          opVector[i] = opVector[i][0];
        } else opVector[i] = opVector[i].match(/[+\-*/]$/)[0];
      }
      switch (opVector[i]) {
        case "*":
          numVector[i] = numVector[i] * numVector[i + 1];
          numVector.splice(i + 1, 1);
          opVector.splice(i, 1);
          i--;
          break;
        case "/":
          numVector[i] = numVector[i] / numVector[i + 1];
          numVector.splice(i + 1, 1);
          opVector.splice(i, 1);
          i--;
          break;
        default:
          break;
      }
    } //division and multiplication go first
    //this algo removes the two numbers it operates on from numVector
    //and then puts the result of that operation in the same location

    for (let i = 0; i < opVector.length; i++) {
      if (opVector[i] === "+" || opVector[i] === "-") {
        //both cases are the same because in subtractions, the number added is already a negative in numVector.
        numVector[i] = numVector[i] + numVector[i + 1];
        numVector.splice(i + 1, 1);
        opVector.splice(i, 1);
        i--;
      }
    } //additions and subtractions go last
    //same algorithm as the one above, just for adding and subtracting.

    setInput(numVector[0].toString());
    setTotal(numVector[0].toString());
  };
  return (
    <button id="equals" className="tile" onClick={handleClick}>
      {"="}
    </button>
  );
}
