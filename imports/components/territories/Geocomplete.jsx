import React, {Component} from 'react'
import Geosuggest from 'react-geosuggest'

export default class Geocomplete extends Component {
    state = {
        
    }

    handleAddressSelect = (address) => {
        console.log('address', address)
        if(this.props.onSelect){
            this.props.onSelect({
                address: address.description,
                coordinates: address.location
            })
        }
        this._geoSuggest.clear()
    }

    render(){
        return(
            <Geosuggest
                ref={el=>this._geoSuggest=el}
                placeholder="Entrez une adresse"
                onSuggestSelect={this.handleAddressSelect}
            />
        )
    }
}