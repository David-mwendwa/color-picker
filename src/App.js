import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import PaletteList from './PaletteList';
import SingleColorPalette from './SingleColorPalette';
import Palette from './Palette';
import seedColors from './seedColors';
import NewPaletteForm from './NewPaletteForm';
import { generatePalette } from './ColorHelpers';

import './App.css';

class App extends Component {
  state = { palettes: seedColors };

  findPalette = (id) =>
    this.state.palettes.find((palette) => palette.id === id);

  savePalette = (newPalette) =>
    this.setState({ palettes: [...this.state.palettes, newPalette] });

  render() {
    return (
      <Switch>
        <Route
          exact
          path='/palette/new'
          render={(routeProps) => (
            <NewPaletteForm savePalette={this.savePalette} {...routeProps} />
          )}
        />
        <Route
          path='/palette/:paletteId/:colorId'
          render={(routeProps) => (
            <SingleColorPalette
              colorId={routeProps.match.params.colorId}
              palette={generatePalette(
                this.findPalette(routeProps.match.params.paletteId)
              )}
            />
          )}
        />
        <Route
          exact
          path='/'
          render={(routeProps) => (
            <PaletteList palettes={this.state.palettes} {...routeProps} />
          )}
        />
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
