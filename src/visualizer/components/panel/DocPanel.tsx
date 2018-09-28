import * as React from 'react';

import './DocPanel.css';

import TypeDoc from '../doc-explorer/TypeDoc';
import TypeInfoPopover from './TypeInfoPopover';

export interface DocPanelProps {
  header: React.ReactChild;
  toggleQueryMode: any;
  inQueryMode: boolean;
}

export default class DocPanel extends React.Component<DocPanelProps> {
  render() {
    return (
      <div className="doc-panel">
        <div className="contents">
          {this.props.header}
          <TypeDoc 
            toggleQueryMode={this.props.toggleQueryMode}
            inQueryMode={this.props.inQueryMode}
          />
          
        </div>
        <TypeInfoPopover />
      </div>
    );
  }
}
