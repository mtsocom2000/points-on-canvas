import React, { Component } from 'react';
import './app.css';
// import Points3DApp from './three/index';
import Points3DApp from './paper/index';

class App extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <div >
      </div>
    );
  }
  componentDidMount() {
    this.app = new Points3DApp(document.getElementById('myCanvas'));
    this.app.start([
      {
        x: -200, y: 200,
      },
      {
        x: -200, y: -200,
      },
      {
        x: 200, y: -200,
      },
      {
        x: 200, y: 200,
      },
    ]);
  }
}

export default App;
