import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Palette from './Palette';
import seedColors from './seedColors';
import { generatePalette } from './ColorHelpers';

import './App.css';

class App extends Component {
  findPalette = (id) => seedColors.find((palette) => palette.id === id);
  
  render() {
    return (
      <Switch>
        <Route exact path='/' render={() => <h1>PALETTE LIST</h1>} />
        <Route
          exact
          path='/palette/:id'
          render={(routeProps) => (
            <Palette
              palette={generatePalette(
                this.findPalette(routeProps.match.params.id)
              )}
            />
          )}
        />
      </Switch>
      // <div>
      //   <Palette palette={generatePalette(seedColors[4])} />
      // </div>
    );
  }
}

export default App;
