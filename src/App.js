import Palette from './Palette';
import seedColors from './seedColors';

import './App.css';

const App = () => {
  return (
    <div>
      <Palette palette={seedColors[4]} />
    </div>
  );
}

export default App;
