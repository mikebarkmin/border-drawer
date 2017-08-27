import React, { Component } from 'react';
import { ThemeProvider } from 'gestyled';
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: undefined,
      points: new List(),
      dimensions: {
        width: 900,
        height: 800
      },
      border: borders[pickRandomProperty(borders)]
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
      score: undefined
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.score !== this.state.score;
  }
  submit = () => {
    let points = this.state.points;
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
      score: similarity
    });
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
      <ThemeProvider>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <Title>
              Draw {this.state.border.properties.name}
            </Title>
          </div>
          <Relative mx="auto" mt={10} mb={10} style={this.state.dimensions}>
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
              <DrawArea onChange={this.onChange} points={this.state.points} />
            </Absolute>
          </Relative>
          {this.state.score === undefined
            ? <div style={{ textAlign: 'center' }}>
                <ButtonPrimary mr={8} onClick={this.reset}>
                  Reset
                </ButtonPrimary>
                <ButtonPrimary onClick={this.submit}>Submit</ButtonPrimary>
              </div>
            : <div>
                <Text>
                  Score: {this.state.score}
                </Text>
                <ButtonPrimary full mr={8} onClick={this.reset}>
                  Retry
                </ButtonPrimary>
              </div>}
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
