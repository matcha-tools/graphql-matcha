import { MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import { theme } from "./components/MUITheme";
import { Voyager } from "./components";
import schema from "../../demo/schema/schema";

export interface VizProps {
  queryModeListener(): undefined;
  toggleQueryMode(): undefined; 
  inQueryMode: boolean;
}
export default class Viz extends React.Component<VizProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    console.log('Viz IQM ==>',this.props.inQueryMode)
    return (
      <MuiThemeProvider theme={theme}>
        <Voyager
          introspection={schema}
          toggleQueryMode={this.props.toggleQueryMode}
          inQueryMode={this.props.inQueryMode}
          queryModeListener={this.props.queryModeListener}
        />
      </MuiThemeProvider>
    );
  }
}
