import React, { Component } from 'react';
import Map from './map'
import FilterList from './FilterList'


export default class MapContainer extends Component {

  render() {
    const { google, onChangeMarker, locationsGoogle } = this.props;

    return (
      <div className="map-container">
        <FilterList locationsGoogle={locationsGoogle} />
        <main role="presentation"  aria-label="The neighborhood" className="main-container">
          <Map 
            google={google}
            onChangeMarker={onChangeMarker} 
            />
        </main>
      </div>
    )
  }
}