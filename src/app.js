import React, { Component } from 'react';
import './app.css';
import Points3DApp from './three/index';

class App extends Component {
  constructor(props) {
    super(props);
    this.onTextChange = this.onTextChange.bind(this);
    this.threeApp = new Points3DApp();
    this.threeApp.start();
  }
  render() {
    return (
      <div className="App">
        <textarea onChange={this.onTextChange}></textarea>
      </div>
    );
  }

  onTextChange(e) {
    this.threeApp.parsePoints(e.target.value);
  }
}

export default App;
