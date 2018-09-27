import * as React from "react";
import { render } from "react-dom";
import Matcha from "./components/matcha";
import { GraphiQL } from "./queryRunner/components/GraphiQL";
import * as helpers from "./helpers";
import PropTypes from "prop-types";
import Viz from "./visualizer";

// export class App extends React.Component {
//   static propTypes = {
//     showVoyager: PropTypes.bool
//   };

//   constructor(props) {
//     super(props);
//     this.state = { voyagerIsVisible: false };
//   }

//   render() {
//     let voyager;
//     let graphiqlHeight;

//     if (this.state.voyagerIsVisible) {
//       voyager = (
//         <div id="viz" style={{ height: "60vh" }}>
//           <Viz />
//         </div>
//       );
//       graphiqlHeight = { height: "40vh" };
//     } else {
//       graphiqlHeight = { height: "100vh" };
//     }

//     return (
//       <div>
//         {voyager}
//         <div id="graphiql" style={graphiqlHeight}>
//           <GraphiQL
//             fetcher={helpers.graphQLFetcher}
//             query={helpers.parameters.query}
//             variables={helpers.parameters.variables}
//             operationName={helpers.parameters.operationName}
//             onEditQuery={helpers.onEditQuery}
//             onEditVariables={helpers.onEditVariables}
//             onEditOperationName={helpers.onEditOperationName}
//             onToggleVoyager={this.toggleVoyager}
//             voyagerIsVisible={this.state.voyagerIsVisible}
//           />
//         </div>
//       </div>
//     );
//   }

//   toggleVoyager = () => {
//     const voyagerIsVisible = !this.state.voyagerIsVisible;
//     this.setState({ voyagerIsVisible });
//   };
// }

render(<Matcha />, document.getElementById("root"));
