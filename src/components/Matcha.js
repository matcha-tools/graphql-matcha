import * as React from "react";
import { GraphiQL } from "../queryRunner/components/GraphiQL";
import * as helpers from "../helpers";
import Viz from "../visualizer";

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
    console.log('RENDERING Matcha');
    let visVisibility = "vis-closed";
    let toggleVisText = "View Schema";
    let visualizer;
    if (this.state.visualizerIsVisible) {
      visVisibility = "vis-open";
      visualizer = (
        <div id="viz" className={visVisibility}>
          <Viz />
        </div>
      );
      
      toggleVisText = "Hide Schema";
    }

 

    const toggleVisButton = (
      <button type="button" onClick={this.toggleVisualizer}>
        {toggleVisText}
      </button>
    );

    let toggleDraftModeText = "Draft Query";
    if (this.state.inQueryMode) {
      toggleDraftModeText = "Exit Draft";
    }

    const toggleDraftButton = (
      <button type="button" onClick={this.toggleQueryMode}>
        {toggleDraftModeText}
      </button>
    );

    console.log('Vis BUtton -== >', toggleVisText)

    return (
      <div id="matcha">
        {toggleVisButton}
        {toggleDraftButton}
        {visualizer}
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
