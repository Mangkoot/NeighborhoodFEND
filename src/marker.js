import { Component } from 'react';
import PropTypes from 'prop-types'

class Marker extends Component {


  componentDidUpdate(prevProps) {
 
    if ((this.props.map !== prevProps.map) ||
        (this.props.position !== prevProps.position)) {
        this.renderMarker();
    }
  }
  renderMarker() {
    if (this.marker) {
      this.marker.setMap(null);
    }

    let { map, google, position, bounds, largeInfowindow, onChangeMarker } = this.props;


      let defaultIcon = this.makeMarkerIcon('fff8dc');
      
      let pos = position;
      position = new google.maps.LatLng(pos.lat, pos.lng);

      const pref = {
        map: map,
        position: position,
        icon: defaultIcon
      };
      this.marker = new google.maps.Marker(pref);
      const marker = this.marker;

      // Create an onclick event to open a large info window at each marker.
      let self = this;
      marker.addListener('click', function() {
        self.populateInfoWindow(this, largeInfowindow);
      });

      onChangeMarker(this);

      bounds.extend(marker.position);
      map.fitBounds(bounds);
     
  }

  populateInfoWindow(marker, infowindow) {

    // Checks to make sure the info window is not already opened on this marker.
    if (infowindow.marker !== marker) {
      let { map, google, bounds, title } = this.props;
      //Animation when marker is clicked
      marker.setAnimation(google.maps.Animation.DROP);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 700);

        infowindow.setContent('Currently loading...');
        //Request for tips and photos via Foursquare API
        let venueId = null;
        let tipsList = null;
        fetch(`https://api.foursquare.com/v2/venues/search?ll=59.915378,10.739339&v=20180518&query=${title}&limit=1&client_id=DKV1IMMH0NBSRPVGXC4KXFCT0KCTAYAVB3DO10UENX24W3IZ&client_secret=VNSPYCNESTUXHXOTXUEUWF3VSYXL2MINBNT3ESH41BEC3CSI`)
            .then(response => response.json())
            .then(data => {
              venueId = data.response.venues[0].id;
              return fetch(`https://api.foursquare.com/v2/venues/${venueId}/tips?v=20180518&limit=4&client_id=DKV1IMMH0NBSRPVGXC4KXFCT0KCTAYAVB3DO10UENX24W3IZ&client_secret=VNSPYCNESTUXHXOTXUEUWF3VSYXL2MINBNT3ESH41BEC3CSI`);
            })
            .then(response => response.json())
            .then(dataTips => {
              tipsList = dataTips;
              return fetch(`https://api.foursquare.com/v2/venues/${venueId}/photos?v=20180518&limit=2&client_id=DKV1IMMH0NBSRPVGXC4KXFCT0KCTAYAVB3DO10UENX24W3IZ&client_secret=VNSPYCNESTUXHXOTXUEUWF3VSYXL2MINBNT3ESH41BEC3CSI`);
            })
            .then(response => response.json())
            .then(dataPhotos => addVenuesInfos(tipsList, dataPhotos))
            .catch(err => requestError(err, 'Foursquare'));

            //if sucess in Request
            function addVenuesInfos(tipsList, dataPhotos) {
              let htmlResult = '';
              
              if (tipsList && tipsList.response.tips.items) {
                const tipsData = tipsList.response.tips.items;
                const photosData = dataPhotos.response.photos.items;
                  htmlResult = '<div class="infowindow-content"><h4>' + title + '</h4><div class="split"></div>';
                  
                  //Photos
                  htmlResult += '<h5> Photos </h5> <div id="photos-places">';
                  for(let i = 0; i < photosData.length; i++) {
                    const photo = photosData[i];
                    htmlResult += `<img alt="${title}, photo ${i + 1} by a visitor" style="width: 30%; margin-right: 5px;" src="${photo.prefix}150x150${photo.suffix}" />`;
                  }

                  //Tips
                  htmlResult += '</div><h5> Sweet info </h5> <ul id="tips-places">';
                  tipsData.forEach( tip => {
                  htmlResult += '<li>' + tip.text + ' - 👍 ' + tip.likes.count + ' </li>';
                  })
                  htmlResult += '</ul> <p style="float: right; padding-right: 10px;"><i><small>provided by Foursquare</small></i></p> </div>';
              } else { //if unsuccessful
                  htmlResult = '<p class="network-warning">Unfortunately, no <i>Sweet info</i> was returned for your search.</p>';
              }
              infowindow.setContent(htmlResult);
            }
            //if Error in Request
            function requestError(err, part) {
              console.log(err);
              infowindow.setContent(`<p class="network-warning">Unfortuntely, there was an error making a request for the ${part}.</p>`);
            }            
      infowindow.marker = marker;
  
      // Makes sure the marker property is cleared when the info window is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
  
      // Open the info window on the correct marker
      infowindow.open(map, marker);
      map.fitBounds(bounds);
      map.panTo(marker.getPosition());
    }
  }

  makeMarkerIcon(markerColor) {
    var markerImage = new this.props.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|180|'+ markerColor +
      '|40|_|%E2%80%A2',
      new this.props.google.maps.Size(35, 50),
      new this.props.google.maps.Point(0, 0),
      new this.props.google.maps.Point(10, 34),
      new this.props.google.maps.Size(35,50));
    return markerImage;
  }

  render() {
    return null;
   
  }
}

export default Marker;

Marker.propTypes = {
    map: PropTypes.object
}