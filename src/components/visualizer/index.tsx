import { MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import { theme } from "./components/MUITheme";
import { Voyager } from "./components";
// import { GraphQLSchema } from "graphql";

export interface VizProps {
  queryModeHandler(): undefined;
  toggleQueryMode(): undefined; 
  inQueryMode: boolean;
  schema: any;
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
          introspection={this.props.schema}
          toggleQueryMode={this.props.toggleQueryMode}
          inQueryMode={this.props.inQueryMode}
          queryModeHandler={this.props.queryModeHandler}
        />
      </MuiThemeProvider>
    );
  }
}
