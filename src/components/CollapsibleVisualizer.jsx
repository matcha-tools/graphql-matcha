import Collapsible from "react-collapsible";
import React, { Component } from "react";
import Viz from "../visualizer";

export default class CollapsibleVisualizer extends Component {
  constructor(props) {
    super(props);
  }

  closedTrigger = () => {
    return (
    <div className="trigger">
      <span>View Schema</span>
    </div>
    )
  }

  openTrigger = () => { 
    return (
    <div className="trigger">
      <span>Hide Schema</span>
    </div>
    )
  }

  render() {
    // why do we have to invoke the below functions? It wouldn't render unless invoked
    return (
      <Collapsible
        trigger={this.closedTrigger()}
        triggerWhenOpen={this.openTrigger()}
        onClose={this.props.endQueryMode}
        lazyRender
      >
        <div id="viz" className="vis-open">
          <Viz toggleQueryMode={this.props.toggleQueryMode} inQueryMode={this.props.inQueryMode}/>
        </div>
      </Collapsible>
    );
  }
}
