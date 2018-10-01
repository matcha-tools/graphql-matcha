import * as React from "react";
import * as helpers from "../helpers";
import { GraphiQL } from "../queryRunner/components/GraphiQL";
import { CollapsibleVisualizer } from "./CollapsibleVisualizer";
import { parseQueryStack } from "../utils/parsers";

interface MatchaStateTypes {
  inQueryMode: boolean;
  queryStr: string;
}

export default class Matcha extends React.Component<null, MatchaStateTypes> {

  constructor(props) {
    super(props);
    this.state = {
      inQueryMode: false,
      queryStr: ""
    };

    this.toggleQueryMode = this.toggleQueryMode.bind(this);
    this.endQueryMode = this.endQueryMode.bind(this);
    this.queryModeHandler = this.queryModeHandler.bind(this);
  }

  toggleQueryMode() {
    const inQueryMode = !this.state.inQueryMode;
    this.setState({ inQueryMode });
  }

  endQueryMode() {
    this.setState({  inQueryMode: false });
  }

  queryModeHandler(connections): void {
    if (this.state) {
      if (!connections.history.length) return;
      let queryStack = connections.history;
      if (connections.currentFields && connections.currentFields.length) {
        queryStack = queryStack.concat([connections.currentFields]);
      }
      const queryStr = parseQueryStack(queryStack);
      //TODO make sure we are checking for diffs 
      if(queryStr) this.setState({queryStr});
    }
  }

  render() {
    return (
      <div id="matcha">
        <CollapsibleVisualizer
          toggleQueryMode={this.toggleQueryMode}
          endQueryMode={this.endQueryMode}
          queryModeHandler={this.queryModeHandler}
          inQueryMode={this.state.inQueryMode}
        />
        <div id="query-runner">
          <GraphiQL
            fetcher={helpers.graphQLFetcher}
            variables={helpers.parameters.variables}
            operationName={helpers.parameters.operationName}
            onEditQuery={helpers.onEditQuery}
            onEditVariables={helpers.onEditVariables}
            onEditOperationName={helpers.onEditOperationName}
            inQueryMode={this.state.inQueryMode}
            queryModeQuery={this.state.queryStr}
          />
        </div>
      </div>
    );
  }
}
