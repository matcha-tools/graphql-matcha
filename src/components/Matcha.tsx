import * as React from "react";
import * as helpers from "../helpers";
import { GraphiQL } from "../queryRunner/components/GraphiQL";
import { CollapsibleVisualizer } from "./CollapsibleVisualizer";
import { parseQueryArray } from "../utils/parsers";

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
    this.queryModeListener = this.queryModeListener.bind(this);
  }

  toggleQueryMode() {
    const inQueryMode = !this.state.inQueryMode;
    this.setState({ inQueryMode });
  }

  endQueryMode() {
    this.setState({  inQueryMode: false });
  }

  componentDidUpdate(){
    // console.log('Matcha did update');
  }

  shouldComponentUpdate(){
    // console.log('Sholdmatcha update? true');
    return true;
  }

  queryModeListener(queryStack) {
    //queryStack.history --> the stack of nodes the person wants
    //".currentFields --> the selected edges of the current
    if (this.state) {
      if (!queryStack.history.length) return;
      let queryArray = queryStack.history;
      if (queryStack.currentFields && queryStack.currentFields.length) {
        queryArray = queryArray.concat([queryStack.currentFields]);
      }
      console.log('QM LISTENER CALLED, stack-->', queryArray);
      const queryStr = parseQueryArray(queryArray);
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
          queryModeListener={this.queryModeListener}
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
