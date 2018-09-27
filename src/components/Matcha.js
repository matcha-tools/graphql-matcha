import * as React from "react";
import { GraphiQL } from "../queryRunner/components/GraphiQL";
import * as helpers from "../helpers";
import {CollapsibleVisualizer} from "./CollapsibleVisualizer";

export default class Matcha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inQueryMode: false,
      queryStr: ""
    };

    this.toggleQueryMode = this.toggleQueryMode.bind(this);
  }

  toggleQueryMode() {
    const inQueryMode = !this.state.inQueryMode;
    this.setState({ inQueryMode });
  }

  render() {
    let toggleDraftModeText = "Draft Query";
    if (this.state.inQueryMode) {
      toggleDraftModeText = "Exit Draft";
    }

    return (
      <div id="matcha">
        <CollapsibleVisualizer toggleQueryMode={this.toggleQueryMode} draftButtonText={toggleDraftModeText}/>
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
