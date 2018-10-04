import { MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import { theme } from "./components/MUITheme";
import { Voyager } from "./components";
import schema from "../../demo/schema/schema";

export interface VizProps {
  queryModeHandler(): undefined;
  toggleQueryMode(): undefined; 
  inQueryMode: boolean;
}
export default class Viz extends React.Component<VizProps> {
  constructor(props) {
    super(props);
  }
  
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Voyager
          hideSettings={true}
          introspection={schema}
          toggleQueryMode={this.props.toggleQueryMode}
          inQueryMode={this.props.inQueryMode}
          queryModeHandler={this.props.queryModeHandler}
        />
      </MuiThemeProvider>
    );
  }
}
