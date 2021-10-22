import "./styles.css";
import Display from "./display";
import TileSets from "./TileSets";
import React, { useState } from "react";
export default function App() {
  let [input, setInput] = useState("0");
  let [total, setTotal] = useState(0);
  return (
    <div className="App">
      <h1 id="title"> React Calculator</h1>

      <Display
        input={input}
        setInput={setInput}
        total={total}
        setTotal={setTotal}
      />

      <TileSets
        input={input}
        setInput={setInput}
        total={total}
        setTotal={setTotal}
      />
    </div>
  );
}
