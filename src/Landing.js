import React from 'react';
import { Link } from 'react-router-dom';
import * as borders from './borders';
import { Container, ButtonPrimary, Title } from 'gestyled';

class Landing extends React.Component {
  render() {
    return (
      <Container py={20} style={{ textAlign: 'center' }}>
        <Container pb={20}>
          <Title>Which border would you like to draw?</Title>
        </Container>
        {Object.keys(borders).map(key => {
          const border = borders[key];
          return (
            <Link to={`/${key}`}>
              <ButtonPrimary mr={8}>
                {border.properties.name}
              </ButtonPrimary>
            </Link>
          );
        })}
      </Container>
    );
  }
}

export default Landing;
