import React, { Component } from 'react';
import simplify from 'simplify-js';
import { List } from 'immutable';
import DrawArea from './components/DrawArea';
import Drawing from './components/Drawing';
import {
  Container,
  Title,
  Relative,
  Absolute,
  ButtonPrimary,
  Text
} from 'gestyled';
import { calcSimilarity, lngLatToXy, pickRandomProperty } from './utils/helper';
import * as borders from './borders';

class BorderDrawer extends Component {
  constructor(props) {
    super(props);
    const borderName = props.match.params.borderName;
    let border = borders[pickRandomProperty(borders)];
    if (borderName in borders) {
      border = borders[borderName];
    }
    this.state = {
      score: undefined,
      points: new List(),
      calcingScore: false,
      dimensions: {
        width: 900,
        height: 800
      },
      border
    };
  }
  onChange = points => {
    this.setState({
      points
    });
  };
  reset = () => {
    this.setState({
      points: new List(),
      score: undefined,
      calcingScore: false
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    const nextDimensions = nextState.dimensions;
    const nextScore = nextState.score;
    const { dimensions, score } = this.state;
    return (
      nextScore !== score ||
      nextDimensions.width !== dimensions.width ||
      nextDimensions.height !== dimensions.height
    );
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    this.updateWindowDimensions();
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions = () => {
    this.setState({
      dimensions: {
        width: window.innerWidth < 1024 ? window.innerWidth - 100 : 1024,
        height: window.innerHeight - 200
      }
    });
  };
  submit = () => {
    let points = this.state.points;
    this.setState(
      {
        calcingScore: true
      },
      () => {
        let similarity = 0;
        if (points.size > 4) {
          points = points
            .map(point => ({
              x: point.get(0),
              y: point.get(1)
            }))
            .toJS();
          // simplify points for faster caculation
          points = new List(simplify(points));
          points = points.map(point => [point.x, point.y]).toSet().toJS();

          points.push(points[0]);
          similarity = calcSimilarity(
            points,
            this.state.border,
            this.state.dimensions
          );
        }
        this.setState({
          score: similarity,
          calcingScore: false
        });
      }
    );
  };
  render() {
    let pointsReal = new List(
      this.state.border.geometry.coordinates[0].map(
        coordinate =>
          new List(
            lngLatToXy(this.state.dimensions, coordinate, this.state.border)
          )
      )
    );
    pointsReal = pointsReal.push(pointsReal.get(0));
    return (
      <Container py={20}>
        <Container pb={20} style={{ textAlign: 'center' }}>
          <Title>
            Draw {this.state.border.properties.name}
          </Title>
        </Container>
        <Relative mx="auto" mb={10} style={this.state.dimensions}>
          {this.state.score !== undefined
            ? <Absolute
                top
                left
                style={{ opacity: 0.5, ...this.state.dimensions }}
              >
                <Drawing
                  points={pointsReal}
                  fill="gold"
                  stroke="black"
                  strokeWidth="1px"
                />
              </Absolute>
            : null}
          <Absolute
            top
            left
            style={{ userSelect: 'none', ...this.state.dimensions }}
          >
            {this.state.border.properties.labels.map(label => {
              const xy = lngLatToXy(
                this.state.dimensions,
                label.coordinates,
                this.state.border
              );
              return (
                <Text
                  key={label.label}
                  style={{
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: -7 + xy[1],
                    left: -7 + xy[0]
                  }}
                >
                  {label.icon || '⚫'} {label.label}
                </Text>
              );
            })}
          </Absolute>
          <Absolute top left style={this.state.dimensions}>
            <DrawArea
              oneStroke
              onChange={this.onChange}
              points={this.state.points}
            />
          </Absolute>
        </Relative>
        <Container py={10} style={{ textAlign: 'center' }}>
          {this.state.score === undefined
            ? <Container>
                <ButtonPrimary mr={8} onClick={this.reset}>
                  Reset
                </ButtonPrimary>
                <ButtonPrimary onClick={this.submit}>Submit</ButtonPrimary>
              </Container>
            : <Container>
                <Title>
                  Score: {this.state.score}
                </Title>
                <ButtonPrimary full mt={10} onClick={this.reset}>
                  Retry
                </ButtonPrimary>
              </Container>}
        </Container>
      </Container>
    );
  }
}

export default BorderDrawer;
