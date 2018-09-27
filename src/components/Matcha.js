import * as React from "react";
import { GraphiQL } from "./components/GraphiQL";
import * as helpers from "../helpers";

export default class Matcha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visualizerIsVisible: false,
      inQueryMode: false,
      queryStr: ""
    };

    this.toggleQueryMode = this.toggleQueryMode.bind(this);
    this.toggleVisualizer = this.toggleVisualizer.bind(this);
  }

  toggleQueryMode() {
    const inQueryMode = !this.state.inQueryMode;
    this.setState({ inQueryMode });
  }
  toggleVisualizer() {
    const visualizerIsVisible = !this.state.visualizerIsVisible;
    this.setState({ visualizerIsVisible });
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.toggleQueryMode} value="Toggle Query Mode"/>
        <Voyager inQueryMode={this.state.inQueryMode} />
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
    );
  }
}
