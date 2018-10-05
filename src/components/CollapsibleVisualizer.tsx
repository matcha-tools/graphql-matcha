import Collapsible from "react-collapsible";
import * as React from "react";
import Viz from "./visualizer";

export const CollapsibleVisualizer = props => {
  const closedTrigger = (
    <div className="trigger-open">
      <span>View Schema</span>
    </div>
  );
  const openTrigger = (
    <div className="trigger-close">
      <span>Hide Schema</span>
    </div>
  );

  return (
    <Collapsible
      trigger={closedTrigger}
      triggerWhenOpen={openTrigger}
      onClose={props.endQueryMode}
      lazyRender
    >
      <div id="viz" className="vis-open">
        <Viz
          queryModeHandler={props.queryModeHandler}
          toggleQueryMode={props.toggleQueryMode}
          inQueryMode={props.inQueryMode}
          schema={props.schema}
        />
      </div>
    </Collapsible>
  );
};
