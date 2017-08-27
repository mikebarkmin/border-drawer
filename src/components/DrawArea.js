import React from 'react';
import { List } from 'immutable';
import Drawing from './Drawing';

class DrawArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      points: new List()
    };
  }
  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.points.size === 0) {
      this.reset();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.points.size !== 0) {
      return false;
    }
    return true;
  }

  onMouseUp = () => {
    this.setState({
      isDrawing: false
    });
  };
  onMouseDown = event => {
    if (event.button !== 0) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(event);
    let points = this.state.points;
    if (this.props.oneStroke) {
      points = new List();
    }
    points = points.push(point);
    this.setState({
      points,
      isDrawing: true
    });

    this.props.onChange(points);
  };
  onMouseMove = event => {
    if (!this.state.isDrawing) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(event);
    const points = this.state.points;

    this.setState({
      points: points.push(point)
    });

    this.props.onChange(points);
  };
  reset = () => {
    this.setState({
      points: new List(),
      isDrawing: false,
      score: undefined
    });
  };
  relativeCoordinatesForEvent = event => {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new List([
      event.clientX - boundingRect.left,
      event.clientY - boundingRect.top
    ]);
  };
  render() {
    return (
      <div
        className="drawArea grid"
        ref="drawArea"
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
      >
        <Drawing points={this.state.points} />
      </div>
    );
  }
}

DrawArea.defaultProps = {
  onChange: () => {}
};

export default DrawArea;
