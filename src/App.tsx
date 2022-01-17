import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { NumberInput } from "./Components/NumberInput/NumberInput";

function App() {
  const [value, setValue] = useState(0);

  return (
    <div className="App">
      <NumberInput value={value} />
    </div>
  );
}

export default App;
