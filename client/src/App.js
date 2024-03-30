import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Component/home';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route>
            <Home />
          </Route>
        </Switch>
      </div>

    </Router>

  );
}

export default App;
