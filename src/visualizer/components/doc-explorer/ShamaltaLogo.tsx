import * as React from 'react';

interface ShamaltaLogoProps {
  toggleQueryMode: any;
}

export default class ShamaltaLogo extends React.Component<ShamaltaLogoProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="loader" data-type="button" onClick={this.props.toggleQueryMode}>
      <div className="hexContainer">
          <div className="hex">
              <div className="hex inner"></div>
          </div>
      </div>
      <div className="triangleContainer">
          <div className="triangle">
              <div className="triangleInner"></div>
          </div>
      </div>
      <div className="ballContainer">
          <div className="balls ball1"></div>
          <div className="balls ball2"></div>
          <div className="balls ball3"></div>
          <div className="balls ball4"></div>
          <div className="balls ball5"></div>
          <div className="balls ball6"></div>
      </div>
      </div>
    )
  }
}