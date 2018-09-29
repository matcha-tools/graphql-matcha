import * as React from "react";
import { GraphiQL } from "../queryRunner/components/GraphiQL";
import * as helpers from "../helpers";
import { CollapsibleVisualizer } from "./CollapsibleVisualizer.jsx";

export default class Matcha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inQueryMode: false,
      queryStr: ""
    };

    this.toggleQueryMode = this.toggleQueryMode.bind(this);
    this.endQueryMode = this.endQueryMode.bind(this);
  }

  toggleQueryMode() {
    const inQueryMode = !this.state.inQueryMode;
    this.setState({ inQueryMode });
  }

  endQueryMode() {
    this.setState({ inQueryMode: false });
  }

  queryModeListener(store) {
    //pass this down to Voya to listen for state changes.
    //when state.
    console.log('matcha', store);
  }

  render() {
    return (
      <div id="matcha">
        <CollapsibleVisualizer
          toggleQueryMode={this.toggleQueryMode}
          endQueryMode={this.endQueryMode}
          queryModeListener={this.queryModeListener}
          inQueryMode={this.state.inQueryMode}
        />
        <div id="query-runner">
          <GraphiQL
            fetcher={helpers.graphQLFetcher}
            query={helpers.parameters.query}
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
