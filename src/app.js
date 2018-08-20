import React, { Component } from 'react';
import './app.css';
import Points3DApp from './three';

class App extends Component {
  constructor(props) {
    super(props);
    this.onTextChange = this.onTextChange.bind(this);
    this.threeApp = new Points3DApp();
    this.threeApp.start();
  }
  render() {
    return (
      <div className="controls">
        <div className="textInput">
          <textarea onChange={this.onTextChange}></textarea>
        </div>
        <div className="pointList">
          <div></div>
        </div>
      </div>
    );
  }

  onTextChange(e) {
    // this.threeApp.parsePoints(e.target.value);
  }
}

export default App;
