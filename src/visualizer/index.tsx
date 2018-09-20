import { MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import { theme } from "./components/MUITheme";
import { Voyager } from "./components";
import schema from "../../demo/schema/schema";

export default class Viz extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Voyager introspection={schema} />
      </MuiThemeProvider>
    );
  }
}