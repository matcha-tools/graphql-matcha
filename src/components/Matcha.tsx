import * as React from "react";
import * as helpers from "../helpers";
import { GraphiQL } from "./queryRunner/components/GraphiQL";
import { CollapsibleVisualizer } from "./CollapsibleVisualizer";
import { parseQueryStack } from "../utils/parsers";
import { debounce } from "lodash";

interface MatchaStateTypes {
  inQueryMode: boolean;
  queryStr: string;
  schema?: any;
}

export default class Matcha extends React.Component<null, MatchaStateTypes> {
  schema: any;

  constructor(props) {
    super(props);
    this.state = {
      inQueryMode: false,
      queryStr: "",
      schema: null
    };

    fetch("http://localhost:3000/matcha/schema")
      .then(res => {console.log(res); return res.json()})
      .then(schema =>{console.log(schema); console.log(typeof schema); this.setState({ schema })})
      .catch(err=>console.error(err));

    this.toggleQueryMode = this.toggleQueryMode.bind(this);
    this.endQueryMode = this.endQueryMode.bind(this);
    this.queryModeHandler = this.queryModeHandler.bind(this);
  }

  toggleQueryMode() {
    const inQueryMode = !this.state.inQueryMode;
    const delayedSetState = debounce(() => this.setState({ inQueryMode }), 50);
    delayedSetState();
  }

  endQueryMode() {
    this.setState({ inQueryMode: false });
  }

  queryModeHandler(connections): void {
    if (this.state) {
      // we need to exit out of query mode if query mode is enabled and nothing is selected
      // spoke with sean about this at 11PM - 10/1/18 - Jon
      if (!connections.history.length) return;
      let queryStack = connections.history;
      if (connections.currentFields && connections.currentFields.length) {
        queryStack = queryStack.concat([connections.currentFields]);
      }
      const queryStr = parseQueryStack(queryStack);
      //TODO make sure we are checking for diffs
      if (queryStr) this.setState({ queryStr });
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
          schema={this.state.schema}
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
