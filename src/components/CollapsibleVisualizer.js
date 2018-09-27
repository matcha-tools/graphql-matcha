import Collapsible from "react-collapsible";
import React from "react";
import Viz from "../visualizer";

export const CollapsibleVisualizer = props => {
  const toggleDraftButton = (
    <div className="vis-control">
      <button type="button" onClick={props.toggleQueryMode}>
        {props.draftButtonText}
      </button>
    </div>
  );

  const closedTrigger = (
    <div className="trigger">
      <span>View Schema</span>
    </div>
  );
  const openTrigger = (
    <div className="trigger">
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
      {toggleDraftButton}
      <div id="viz" className="vis-open">
        <Viz />
      </div>
    </Collapsible>
  );
};

//export default CollapsibleVisualizer;
