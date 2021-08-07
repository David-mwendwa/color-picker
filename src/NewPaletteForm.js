import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PaletteFormNav from './PaletteFormNav';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import DraggableColorList from './DraggableColorList';
import { arrayMove } from 'react-sortable-hoc';

import seedColors from './seedColors';
import ColorPickerForm from './ColorPickerForm';

import styles from './styles/NewPaletteFormStyles';

class NewPaletteForm extends React.Component {
  static defaultProps = {
    maxColors: 20,
  };
  state = {
    open: true,
    colors: seedColors[0].colors,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  addNewColor = (newColor) => {
    this.setState({
      colors: [...this.state.colors, newColor],
      newColorName: '',
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (newPalette) => {
    newPalette.id = newPalette.paletteName.toLowerCase().replace(/\s+/g, '-');
    newPalette.colors = this.state.colors;
    this.props.savePalette(newPalette);
    this.props.history.push('/');
  };

  removeColor = (colorName) => {
    this.setState({
      colors: this.state.colors.filter((color) => color.name !== colorName),
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ colors }) => ({
      colors: arrayMove(colors, oldIndex, newIndex),
    }));
  };

  clearColors = () => {
    this.setState({ colors: [] });
  };

  addRandomColor = () => {
    const allColors = this.props.palettes.map((p) => p.colors).flat();
    let rand;
    let randomColor;
    let isDuplicateColor = true;
    while (isDuplicateColor) {
      rand = Math.floor(Math.random() * allColors.length);
      randomColor = allColors[rand];
      isDuplicateColor = this.state.colors.some(
        // eslint-disable-next-line no-loop-func
        (color) => color.name === randomColor.name
      );
      
    }
    this.setState({ colors: [...this.state.colors, randomColor] });
  };

  render() {
    const { classes, maxColors, palettes } = this.props;
    const { open, colors } = this.state;
    const paletteIsFull = colors.length >= maxColors;

    return (
      <div className={classes.root}>
        <PaletteFormNav
          open={open}
          palettes={palettes}
          handleSubmit={this.handleSubmit}
          handleDrawerOpen={this.handleDrawerOpen}
        />
        <Drawer
          className={classes.drawer}
          variant='persistent'
          anchor='left'
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.container}>
            <Typography variant='h4' gutterBottom>
              Design your palette
            </Typography>
            <div className={classes.buttons}>
              <Button
                variant='contained'
                color='secondary'
                className={classes.button}
                onClick={this.clearColors}>
                Clear Palette
              </Button>
              <Button
                variant='contained'
                color='primary'
                className={classes.button}
                onClick={this.addRandomColor}
                disabled={paletteIsFull}>
                Random Color
              </Button>
            </div>
            <ColorPickerForm
              paletteIsFull={paletteIsFull}
              addNewColor={this.addNewColor}
              colors={colors}
            />
          </div>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}>
          <div className={classes.drawerHeader} />
          <DraggableColorList
            colors={this.state.colors}
            removeColor={this.removeColor}
            axis='xy'
            onSortEnd={this.onSortEnd}
            distance={20}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);

// import React, { useState } from 'react';
// import clsx from 'clsx';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import { Button } from '@material-ui/core';
// import DraggableColorBox from './DraggableColorBox';
// import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// import { ChromePicker } from 'react-color';

// const drawerWidth = 400;

// const styles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   appBar: {
//     transition: theme.transitions.create(['margin', 'width'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//   },
//   appBarShift: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: drawerWidth,
//     transition: theme.transitions.create(['margin', 'width'], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   hide: {
//     display: 'none',
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   drawerHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
//     justifyContent: 'flex-end',
//   },
//   content: {
//     flexGrow: 1,
//     height: 'calc(100vh - 64px)',
//     padding: theme.spacing(3),
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: -drawerWidth,
//   },
//   contentShift: {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   },
// }));

// const NewPaletteForm = (props) => {
//   const classes = styles();
//   const theme = useTheme();
//   const [open, setOpen] = useState(false);
//   const [currentColor, setCurrentColor] = useState('teal');
//   const [colors, setColors] = useState([{ color: 'blue', name: 'blue' }]);
//   const [newColorName, setNewName] = useState('');
//   const [newPaletteName, setPaletteName] = useState('')

//   // useEffect(() => {
//   //   ValidatorForm.addValidationRule('isColorNameUnique', (value) => {
//   //     colors.every(({ name }) => name.toLowerCase() !== value.toLowerCase());
//   //   });
//   //   ValidatorForm.addValidationRule('isColorUnique', (value) => {
//   //     colors.every(({ color }) => color !== currentColor);
//   //   });
//   // }, [colors, currentColor]);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   const updateCurrentColor = (newColor) => {
//     setCurrentColor(newColor.hex);
//   };

//   const addNewColor = () => {
//     const newColor = {
//       color: currentColor,
//       name: newColorName,
//     };
//     setColors([...colors, newColor]);
//   };

//   const handleChange = (e) => {
//     setNewName(e.target.value);
//   };

//   const handlePaletteNameChange = (e) => {
//     setPaletteName(e.target.value)
//   }

//   const handleSubmit = () => {
//     let newName = "New Test Palette"
//     const newPalette = {
//       paletteName: newName,
//       id: newName.toLowerCase().replace(/\s/g, '-'),
//       colors: colors,
//     };
//     props.savePalette(newPalette);
//     props.history.push('/')
//   };

//   return (
//     <div className={classes.root}>
//       <CssBaseline />
//       <AppBar
//         position='fixed'
//         color='default'
//         className={clsx(classes.appBar, {
//           [classes.appBarShift]: open,
//         })}>
//         <Toolbar>
//           <IconButton
//             color='inherit'
//             aria-label='open drawer'
//             onClick={handleDrawerOpen}
//             edge='start'
//             className={clsx(classes.menuButton, open && classes.hide)}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant='h6' noWrap>
//             Create a Palette
//           </Typography>
//           <TextValidator label="Palette Name" value={newPaletteName} onChange={handlePaletteNameChange} />
//           <Button
//             variant='contained'
//             color='primary'
//             onClick={handleSubmit}>
//             Save Palette
//           </Button>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         className={classes.drawer}
//         variant='persistent'
//         anchor='left'
//         open={open}
//         classes={{
//           paper: classes.drawerPaper,
//         }}>
//         <div className={classes.drawerHeader}>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === 'ltr' ? (
//               <ChevronLeftIcon />
//             ) : (
//               <ChevronRightIcon />
//             )}
//           </IconButton>
//         </div>
//         <Divider />
//         <Typography variant='h4'>Design Your Palette</Typography>
//         <div>
//           <Button variant='contained' color='secondary'>
//             Clear Palette
//           </Button>
//           <Button variant='contained' color='primary'>
//             Random Color
//           </Button>
//         </div>
//         <ChromePicker
//           color={currentColor}
//           onChangeComplete={updateCurrentColor}
//         />
//         <ValidatorForm onSubmit={addNewColor}>
//           <TextValidator
//             value={newColorName}
//             name="newColorName"
//             onChange={handleChange}
//             // validators={['required']}
//             // errorMessages={['this field is required']}
//           />
//           <Button
//             variant='contained'
//             type='submit'
//             color='primary'
//             style={{ backgroundColor: currentColor }}>
//             Add Color
//           </Button>
//         </ValidatorForm>
//       </Drawer>
//       <main
//         className={clsx(classes.content, {
//           [classes.contentShift]: open,
//         })}>
//         <div className={classes.drawerHeader} />

//         {colors.map((color) => (
//           <DraggableColorBox color={color.color} name={color.name} />
//         ))}
//       </main>
//     </div>
//   );
// };

// export default NewPaletteForm;
