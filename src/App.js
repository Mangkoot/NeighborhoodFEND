import React, { Component } from 'react';
import './App.css';
import { GoogleApiWrapper } from 'google-maps-react' 
import * as constants from './locations'
// import child component
import MapContainer from './MapContainer'
import NavBar from './NavBar'

//Handling when  Google's API have any Problem on the request
document.addEventListener("DOMContentLoaded", function(e) {
  let scriptTag = document.getElementsByTagName('SCRIPT').item(1);
  scriptTag.onerror = function(e) {
    console.log('Sorry no mappy')
    let mapContainerElemt = document.querySelector('#root');
    let errElem = document.createElement('div');
    errElem.innerHTML = '<div class="error-msg">Sorry no mappy </div>'
    mapContainerElemt.appendChild(errElem)
  }
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationsGoogle: []
    }
    this.markersGoogle = [];
    this.onChangeMarker = this.onChangeMarker.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
  }

  onChangeMarker(marker) {
   
    this.markersGoogle.push(marker);

    if(this.markersGoogle.length === constants.locations.length) {
     this.setState({locationsGoogle: this.markersGoogle})
    }
  }

  handleQuery(query) {
    let result = this.state.locationsGoogle.map( location => {
      let matched = location.props.title.toLowerCase().indexOf(query) >= 0;
      if (location.marker) {
        location.marker.setVisible(matched);
      }
      return location;
    })

    this.setState({ locationsGoogle: result });   
  }

  render() {    
    return (
      <div className="App">
        <NavBar handleQuery={this.handleQuery} />

        <MapContainer 
          google={this.props.google}
          onChangeMarker={this.onChangeMarker}
          locationsGoogle={this.state.locationsGoogle} />
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCW129hkg-ZnBEQoHOL8OfhHUIqJhwLVYQ',
})(App)
