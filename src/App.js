import Palette from './Palette';
import seedColors from './seedColors';
import { generatePalette } from './ColorHelpers';

import './App.css';

const App = () => {
  console.log(generatePalette(seedColors[4]));
  return (
    <div>
      <Palette palette={seedColors[2]} />
    </div>
  );
};

export default App;
