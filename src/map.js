import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import mapConfig from './mapConfig'
import * as constants from './locations'
import Marker from './marker'

class Map extends Component {

    componentDidMount() { 
        this.loadMap();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
    }
    
    loadMap() {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;
            const divMapElement = ReactDOM.findDOMNode(mapRef);

            //setup the Map
            const { lat, lng } = constants.neighborhood;
            const center = new maps.LatLng(lat, lng);
            const mapObj = Object.assign({}, {
              center: center,
              zoom: mapConfig.zoom,
              styles: mapConfig.styles,
              mapTypeControl: mapConfig.mapTypeControl
            })
            
            //inst. the map            
            this.map = new maps.Map(divMapElement, mapObj);
            //unique instance of Bounds
            this.bounds = new google.maps.LatLngBounds();
            //unique instance of infoWindow
            this.largeInfowindow = new google.maps.InfoWindow();

            //resize the map 
            checkSizeWindow(window);
            maps.event.addDomListener(window, 'resize', function(e) {
                checkSizeWindow(e.currentTarget)
            });

            function checkSizeWindow(objWindow){
                if(objWindow.innerWidth < 475) {
                    divMapElement.style.height = 'calc(100vh - 89px)';
                } else {
                    divMapElement.style.height = '91vh';
                }
            }

            //force update        
            this.forceUpdate();
        } else {
            console.log('Sorry no mappy')
            let mapContainerElemt = document.querySelector('.map-container');
            mapContainerElemt.innerHTML = '<div class="error-msg">Sorry no mappy </div>'
        }
    }

    render() {
        const style = {
            width: '100vw',
            height: '100vh'
          }

        const { onChangeMarker } = this.props;

        return (
            <div ref='map' style={style} className="map-container" >
                Loading map...
                {constants.locations.map( (location, index) => (
                    <Marker   key={index} 
                        google={this.props.google}
                        map={this.map}
                        title={location.title}
                        position={location.location} 
                        bounds={this.bounds}
                        largeInfowindow={this.largeInfowindow}
                        onChangeMarker={onChangeMarker} 
                        />
                ))}
            </div>
        )
    }
}

export default Map;