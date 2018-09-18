import * as React from 'react';

import './DocPanel.css';

import TypeDoc from '../doc-explorer/TypeDoc';
import TypeInfoPopover from './TypeInfoPopover';

export interface DocPanelProps {
  header: React.ReactChild;
}

export default class DocPanel extends React.Component<DocPanelProps> {
  render() {
    return (
      <div className="doc-panel">
        <div className="contents">
          {this.props.header}
          <TypeDoc />
          
        </div>
        <TypeInfoPopover />
      </div>
    );
  }
}
