import React from "react";
export default function Display(props) {
  let input = props.input;
  let numRegex = /[0-9]+\.{0,1}[0-9]*/g;
  let numVector = input.match(numRegex);
  let opRegex = /[+\-*/]/g;
  let opVector = input.match(opRegex);
  console.log(numVector);
  console.log(opVector);
  return (
    <div>
      <h2>{props.total}</h2>
      <h3 id="display">{props.input}</h3>
    </div>
  );
}
