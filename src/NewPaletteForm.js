import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import DraggableColorBox from './DraggableColorBox';
import DraggableColorList from './DraggableColorList';
import { ChromePicker } from 'react-color';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { arrayMove } from 'react-sortable-hoc';

const drawerWidth = 400;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class NewPaletteForm extends React.Component {
  state = {
    open: true,
    currentColor: 'teal',
    newColorName: '',
    colors: this.props.palettes[0].colors,
    newPaletteName: '',
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('isColorNameUnique', (value) =>
      this.state.colors.every(
        ({ name }) => name.toLowerCase() !== value.toLowerCase()
      )
    );
    ValidatorForm.addValidationRule('isColorUnique', (value) =>
      this.state.colors.every(({ color }) => color !== this.state.currentColor)
    );
    ValidatorForm.addValidationRule('isPaletteNameUnique', (value) =>
      this.props.palettes.every(
        ({ paletteName }) => paletteName.toLowerCase() !== value.toLowerCase()
      )
    );
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  updateCurrentColor = (newColor) => {
    this.setState({ currentColor: newColor.hex });
  };

  addNewColor = () => {
    const newColor = {
      color: this.state.currentColor,
      name: this.state.newColorName,
    };
    this.setState({
      colors: [...this.state.colors, newColor],
      newColorName: '',
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const newName = this.state.newPaletteName;
    const newPalette = {
      paletteName: newName,
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      colors: this.state.colors,
    };
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
    var rand = Math.floor(Math.random() * allColors.length);
    const randomColor = allColors[rand];
    this.setState({ colors: [...this.state.colors, randomColor] });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position='fixed'
          color='default'
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
          <Toolbar disableGutters={!open}>
            <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' color='inherit' noWrap>
              Persistent drawer
            </Typography>
            <ValidatorForm onSubmit={this.handleSubmit}>
              <TextValidator
                label='Palette Name'
                value={this.state.newPaletteName}
                name='newPaletteName'
                onChange={this.handleChange}
                validators={['required', 'isPaletteNameUnique']}
                errorMessages={['enter palette name', 'name already used']}
              />
              <Button variant='contained' color='primary' type='submit'>
                Save Palette
              </Button>
            </ValidatorForm>
          </Toolbar>
        </AppBar>
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
          <Typography variant='h4'>Design your palette</Typography>
          <div>
            <Button
              variant='contained'
              color='secondary'
              onClick={this.clearColors}>
              Clear Palette
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.addRandomColor}>
              Random Color
            </Button>
          </div>
          <ChromePicker
            color={this.state.currentColor}
            onChangeComplete={(newColor) => this.updateCurrentColor(newColor)}
          />
          <ValidatorForm onSubmit={this.addNewColor}>
            <TextValidator
              value={this.state.newColorName}
              name='newColorName'
              onChange={this.handleChange}
              validators={['required', 'isColorNameUnique', 'isColorUnique']}
              errorMessages={[
                'enter a color name',
                'color name must be unique',
                'color already used',
              ]}
            />
            <Button
              variant='contained'
              color='primary'
              type='submit'
              style={{ backgroundColor: this.state.currentColor }}>
              Add color
            </Button>
          </ValidatorForm>
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
