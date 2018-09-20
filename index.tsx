import * as React from "react";
import {render} from "react-dom";
import { GraphiQL } from "./src/components/GraphiQL";
import * as helpers from "./helpers.js";

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
