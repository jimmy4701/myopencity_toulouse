import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { SketchPicker } from 'react-color'
import { withTracker } from 'meteor/react-meteor-data'
import TinyMCE from 'react-tinymce'
import { Territories } from '/imports/api/territories/territories'
import { toast } from 'react-toastify'

class SubTerritoryForm extends Component {

    state = {
        sub_territory: {}
    }

    componentWillMount() {
        if (this.props.sub_territory) {
            this.setState({ sub_territory: this.props.sub_territory })
        }
    }

    componentWillReceiveProps(new_props) {
        if (new_props.sub_territory) {
            this.setState({ sub_territory: new_props.sub_territory })
        }
    }

    handleSubTerritoryChange = (e) => {
        let { sub_territory } = this.state
        sub_territory[e.target.name] = e.target.value
        this.setState({ sub_territory })
    }

    handleContentChange = (e) => {
        let { sub_territory } = this.state
        sub_territory.content = e.target.getContent()
        this.setState({ sub_territory })
    }

    toggleSubTerritory = (attr) => {
        let { sub_territory } = this.state
        sub_territory[attr] = !sub_territory[attr]
        this.setState({ sub_territory })
    }

    handleColorChange = (color) => {
        let { sub_territory } = this.state
        sub_territory.color = color.hex
        this.setState({ sub_territory })
    }


    handleRichContent = (e, attr) => {
        let { sub_territory } = this.state
        sub_territory[attr] = e.target.getContent()
        this.setState({ sub_territory })
    }

    submit_form = (e) => {
        e.preventDefault()
        const {sub_territory} = this.state
        Meteor.call(this.props.sub_territory ? 'sub_territories.update' : 'sub_territories.insert', sub_territory , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                toast.success(this.props.sub_territory ? "Sous territoire modifié" : "Sous territoire créé")
                if(this.props.onFormSubmit) this.props.onFormSubmit()
            }
        })
    }

    render() {

        const { sub_territory } = this.state
        const { loading, territories } = this.props

        if(!loading){

            const territories_options = territories.map(territory => {
                return {key: territory._id, value: territory._id, text: territory.name }
            })
            territories_options.push({key: null, value: null, text: "Aucun parent"})

            return (
                <Form onSubmit={this.submit_form}>
                        <Form.Input
                            onChange={this.handleSubTerritoryChange}
                            type='text'
                            label="Nom du sous-territoire"
                            value={sub_territory.name}
                            required
                            name="name"
                        />
                        <Form.Select
                            options={territories_options}
                            onChange={this.handleTerritorySelect}
                            value={sub_territory.parent_territory}
                            label="Territoire parent (Quartier)"
                        />
                        <Form.Input
                            label="Coordonnées (format JSON)"
                            value={sub_territory.coordinates}
                            name="coordinates"
                            onChange={this.handleSubTerritoryChange}
                        />
                        <Form.Input
                            label="Coordonnées du centre(format JSON)"
                            value={sub_territory.center_coordinates}
                            name="center_coordinates"
                            onChange={this.handleSubTerritoryChange}
                        />
                        <Form.Field>
                            <label>Couleur du sous-territoire sur la carte</label>
                            <SketchPicker color={sub_territory.color} onChangeComplete={this.handleColorChange} />
                        </Form.Field>
                        <Form.Checkbox
                            checked={sub_territory.active}
                            label="Sous-territoire actif"
                            onClick={() => this.toggleSubTerritory('active')}
                        />
                        <Button color="green">{this.props.sub_territory ? "Modifier" : "Créer"}</Button>
                    </Form>
            )
        }else{
            return <div>Chargement</div>
        }

    }
}

export default SubTerritoryFormContainer = withTracker(() => {
    const territoriesPublication = Meteor.subscribe('territories.all')
    const loading = !territoriesPublication.ready()
    const territories = Territories.find({}).fetch()
    return {
       loading,
        territories
      }
})(SubTerritoryForm)