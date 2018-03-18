import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { withRouter } from 'react-router-dom'
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

class TerritoriesMap extends Component {

    componentDidMount(){
        new WOW().init()
    }

    go = (territory) => {
        this.props.history.push('/territory/' + territory.shorten_url + '/consults')
    }

    render() {
        const {territories} = this.props
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
                                    strokeWeight: 1,
                                    strokeColor: territory.color,
                                    fillColor: territory.color 
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
                                scale: {height: "10px", width: "10px"}
                              }}
                              labelStyle={{color: "#9e9e9e", fontSize: "20px"}}
                              labelClass="territory-label"
                            ><div>{territory.reference}</div>
                            </MarkerWithLabel>
                              
                          )
                      }
                  }) }

            </GoogleMap>
        )
    }
}


export default withRouter(withScriptjs(withGoogleMap(TerritoriesMap)));