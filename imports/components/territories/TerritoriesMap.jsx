import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, InfoWindow } from "react-google-maps"
import { withRouter } from 'react-router-dom'
import {Link} from 'react-router-dom'
import { Header, Button, Grid, Image } from 'semantic-ui-react'
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

class TerritoriesMap extends Component {

    state = {
      info_windows: {}
    }

    componentDidMount(){
        new WOW().init()
    }

    go = (territory) => {
        this.props.history.push('/territory/' + territory.shorten_url + '/consults')
    }

    componentWillReceiveProps(){
      const info_windows = {}
      this.props.consults.map(consult => {
        info_windows[consult._id] = false
      })
      this.setState({info_windows})
    }

    toggleInfoWindow = (consult_id) => {
      let {info_windows} = this.state
      info_windows[consult_id] = !info_windows[consult_id]
      this.setState({info_windows})
    }

    render() {
        const {territories, consults} = this.props
        const {info_windows} = this.state
        const {navbar_color} = Session.get('global_configuration')

        const custom_style = [
                {
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#f5f5f5"
                    }
                  ]
                },
                {
                  "elementType": "labels.icon",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#616161"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#f5f5f5"
                    }
                  ]
                },
                {
                  "featureType": "administrative",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#bdbdbd"
                    }
                  ]
                },
                {
                  "featureType": "administrative.neighborhood",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#eeeeee"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#757575"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#e5e5e5"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "labels",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "labels.icon",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road.arterial",
                  "elementType": "labels",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road.arterial",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#757575"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#dadada"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "labels",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#616161"
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                },
                {
                  "featureType": "transit",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "transit.line",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#e5e5e5"
                    }
                  ]
                },
                {
                  "featureType": "transit.station",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#eeeeee"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#c9c9c9"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                }
              ]

        return (
            <GoogleMap
                defaultZoom={12}
                defaultOptions={{styles: custom_style}}
                defaultCenter={{ lat: 43.6007584, lng: 1.4329006 }}
            >
                {this.props.isMarkerShown && <Marker position={{ lat: 43.6007584, lng: 1.4329006 }} />}
                {territories && territories.map(territory => {
                    console.log('territory', territory)
                    if(territory.coordinates){
                        const coordinates = JSON.parse(territory.coordinates).map((coord) => { return {lng: coord[0], lat: coord[1]}} )
                        console.log('coordinates', territory.name, coordinates)
                        return (
                            <Polygon 
                                className="wow fadeIn"
                                paths={coordinates} 
                                onClick={() => this.go(territory)}
                                options={{
                                    strokeWeight: 0,
                                    strokeColor: territory.color,
                                    fillColor: territory.color,
                                    fillOpacity: 0.5
                                }}
                            />
                        )
                    }
                }) }

                 {/* Markers generation */}

                 {territories && territories.map(territory => {
                      if(territory.reference && territory.center_coordinates){
                          const coordinates = JSON.parse(territory.center_coordinates)
                          return (
                            <MarkerWithLabel
                              position={coordinates}
                              labelAnchor={new google.maps.Point(0, 0)}
                              icon={{
                                url: "/images/myopencity-logo",
                                scale: {height: "5px", width: "5px"}
                              }}
                              labelStyle={{color: "#111111", fontSize: "20px"}}
                              labelClass="territory-label"
                            ><div style={{fontSize: "10px"}}>{territory.reference}</div>
                            </MarkerWithLabel>
                              
                          )
                      }
                  }) }

                  <MarkerClusterer
                    averageCenter
                    enableRetinaIcons
                    gridSize={60}
                  >
                    {consults && consults.map(consult => {
                        if(consult.coordinates){
                            return (
                              <Marker
                                key={consult._id}
                                position={consult.coordinates}
                                onClick={() => this.toggleInfoWindow(consult._id)}
                              >
                                {info_windows[consult._id] &&
                                  <InfoWindow onCloseClick={() => this.toggleInfoWindow(consult._id)}>
                                    <div>
                                        <Image size="medium" src={consult.image_url} />
                                        <Header as='h4'>{consult.title}</Header>
                                        <p>{consult.description}</p>
                                        <Link to={"/consults/" + consult.url_shorten}>
                                          <Button>Consulter</Button>
                                        </Link>
                                    </div>
                                  </InfoWindow>
                                }
                              </Marker>
                                
                            )
                        }
                    }) }
                  </MarkerClusterer>

            </GoogleMap>
        )
    }
}


export default withRouter(withScriptjs(withGoogleMap(TerritoriesMap)));