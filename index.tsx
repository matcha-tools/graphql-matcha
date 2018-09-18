import * as React from "react";
import {render} from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { theme } from "./src/visualizer/components/MUITheme";
import { GraphQLVoyager } from "./src/visualizer";

import { GraphiQL } from "./src/components/GraphiQL";

import schema from "./demo/schema/schema";
import * as helpers from "./helpers.js";

export default class Viz extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <GraphQLVoyager introspection={schema} />
      </MuiThemeProvider>
    );
  }
}



render(
    <Viz />,
  document.getElementById("viz")
);

render(
  <GraphiQL 
  fetcher={helpers.graphQLFetcher}
  query={helpers.parameters.query}
  variables={helpers.parameters.variables}
  operationName={helpers.parameters.operationName}
  onEditQuery={helpers.onEditQuery}
  onEditVariables={helpers.onEditVariables}
  onEditOperationName={helpers.onEditOperationName}
  />,
document.getElementById("graphiql")
);
