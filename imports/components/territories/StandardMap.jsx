import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { withRouter } from 'react-router-dom'
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

class StandardMap extends Component {

    render() {
        const {marker} = this.props

        return (
            <GoogleMap
                defaultZoom={12}
                defaultCenter={{ lat: 43.6007584, lng: 1.4329006 }}
            >
            {marker && 
                <Marker position={marker} />
            }

            </GoogleMap>
        )
    }
}


export default withRouter(withScriptjs(withGoogleMap(StandardMap)));