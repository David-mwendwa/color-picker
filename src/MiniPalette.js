import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import styles from './styles/MiniPaletteStyles';
import DeleteIcon from '@material-ui/icons/Delete';

class MiniPalette extends PureComponent {
  deletePalette = (e) => {
    e.stopPropagation();
    this.props.openDialog(this.props.id)
  };

  handleClick = () => {
    this.props.goToPalette(this.props.id)
  }

  render() {
    const { classes, paletteName, emoji, colors } = this.props;
    const miniColoxBoxes = colors.map((color) => (
      <div
        className={classes.miniColor}
        style={{ backgroundColor: color.color }}
        key={color.name}
      />
    ));

    return (
      <div className={classes.root} onClick={this.handleClick}>
        <div className={classes.delete}></div>
        <div className={classes.colors}>
          <DeleteIcon
            className={classes.deleteIcon}
            styles={{ transition: 'all .3s' }}
            onClick={this.deletePalette}
          />
          {miniColoxBoxes}
        </div>
        <h5 className={classes.title}>
          {paletteName} <span className={classes.emoji}>{emoji}</span>
        </h5>
      </div>
    );
  }
}

export default withStyles(styles)(MiniPalette);
