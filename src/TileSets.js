import { NUMBERS, OPERATIONS, SYMBOLS } from "./numbops.js";
import React from "react";
export default function TileSets(props) {
  console.log(props.input);

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
  let regex = /[+\-*/]$/;
  let handleClick = () => {
    if (input === "0") return setInput(number);
    if (number === "0" && regex.test(input)) return; //prevents writing more than one zero immediately after an operation
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
  let regex = /([/*\-+])$/;
  let handleClick = () => {
    if (input === "0") return;
    if (regex.test(input)) setInput(input.slice(0, input.length - 1) + symbol);
    //prevents writing more than one operation in a row. any new operation replaces the previous one.
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
  console.log(currentNumber);
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
  let numRegex = /-*[0-9]+\.{0,1}[0-9]*/g;
  let numVector = input.match(numRegex).map((x) => Number(x));
  let opRegex = /[+\-*/]/g;
  let opVector = input.match(opRegex);
  let allRegex = /[+\-*/]|[0-9]+\.{0,1}[0-9]*/g;
  let diffSplit = input.match(allRegex);
  console.log(diffSplit);
  console.log(numVector);
  let handleClick = () => {
    if (opVector === null || numVector === null) {
      return setTotal(input);
    }
    if (opVector[0] === "-" && numVector[0] < 0) opVector.shift();
    if (opVector.length === numVector.length) opVector.pop();
    console.log(numVector);
    //since operations are always in-between numbers,
    //there should always be one less operations than there are numbers.
    //ex 30 + 12 - 44 * 2 : 4 numbers, 3 operations
    for (let i = 0; i < opVector.length; i++) {
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
    //this algo removes the two numbers it operates on from the array of numbers numVector
    //and then puts the result of that operation in the same location
    console.log(numVector);
    for (let i = 0; i < opVector.length; i++) {
      if (opVector[i] === "+" || opVector[i] === "-") {
        //both cases are the same because in subtractions, the number added is already a negative in the array numVector.
        numVector[i] = numVector[i] + numVector[i + 1];
        numVector.splice(i + 1, 1);
        opVector.splice(i, 1);
        i--;
      }
    } //additions and subtractions go last
    //same algorithm as the one above, just for adding and subtracting.
    console.log(numVector);

    setInput(numVector[0].toString());
    setTotal(numVector[0].toString());
  };
  return (
    <button id="equals" className="tile" onClick={handleClick}>
      {"="}
    </button>
  );
}
