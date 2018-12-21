import React, { Component } from 'react';
import './App.scss';
import VideoUpload from './VideoUpload';
import { connect }            from 'react-redux'


class App extends Component {

  componentDidMount(){
  }
 
  render() {
    return (
      
      <div className="App">
        <VideoUpload></VideoUpload>
      </div>
       
    );
  }
  
}



export default App;
