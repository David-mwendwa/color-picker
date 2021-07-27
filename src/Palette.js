import React, { Component } from 'react';
import ColorBox from './ColorBox';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Palette.css';

class Palette extends Component {
  state = { level: 500 };

  changeLevel = (newLevel) => {
    this.setState({ level: newLevel });
  };

  render() {
    const {colors} = this.props.palette;
    const {level} = this.state;
    const colorBoxes = colors[level].map((color) => (
      <ColorBox background={color.hex} name={color.name} />
    ));

    return (
      <div className='Palette'>
        <Slider
          defaultValue={level}
          min={100}
          max={900}
          step={100}
          onAfterChange={this.changeLevel}
        />
        <div className='Palette-colors'>{colorBoxes}</div>
      </div>
    );
  }
}

export default Palette;
