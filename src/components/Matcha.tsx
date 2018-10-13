import * as React from "react";
import * as helpers from "../helpers";
import { GraphiQL } from "./queryRunner/components/GraphiQL";
import { CollapsibleVisualizer } from "./CollapsibleVisualizer";
import { parseQueryStack } from "../utils/parsers";
import { debounce } from "lodash";
import {introspectionQuery, buildClientSchema, GraphQLSchema} from "graphql";

interface MatchaStateTypes {
  inQueryMode: boolean;
  queryStr: string;
  schema?: GraphQLSchema;
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

    this.toggleQueryMode = this.toggleQueryMode.bind(this);
    this.endQueryMode = this.endQueryMode.bind(this);
    this.queryModeHandler = this.queryModeHandler.bind(this);
    
  }

  componentDidMount(){
    this.getIntroSpectionThenRender();
  }
  
  
  getIntroSpectionThenRender(){
    fetch(`http://localhost:3000/graphql?query=${introspectionQuery}`)
    .then(res => res.json())
    .then(introspectionResponse => buildClientSchema(introspectionResponse.data))
    .then(clientSchema => this.setState({schema:clientSchema}))
    .catch(err=>console.error(err));
  }

  toggleQueryMode() {
    const inQueryMode = !this.state.inQueryMode;
    const delayedSetState = debounce(() => this.setState({ inQueryMode }), 50);
    delayedSetState();
  }

  endQueryMode() {
    this.setState({ inQueryMode: false });
  }

  queryModeHandler(connections: { history: string[][], currentFields: string[]}): void {
    if (this.state) {
      if (!connections.history.length) return;
      let queryStack = connections.history;
      if (connections.currentFields && connections.currentFields.length) {
        queryStack = queryStack.concat([connections.currentFields]);
      }
      const queryStr = parseQueryStack(queryStack);
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
