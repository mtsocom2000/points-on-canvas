import React, { Component } from 'react';
import './app.css';
import Points2DApp from './canvas';

class App extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <div >
        <canvas id="myCanvas" width="800" height="800"></canvas>
      </div>
    );
  }
  componentDidMount() {
    this.threeApp = new Points2DApp(document.getElementById('myCanvas'));
    this.threeApp.start();
  }
}

export default App;
