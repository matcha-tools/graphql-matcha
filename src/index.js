import * as React from "react";
import { render } from "react-dom";
import Matcha from "./components/Matcha.tsx";


export default function start(schema){
  render(<Matcha schema={schema}/>, document.getElementById("root"));
}

