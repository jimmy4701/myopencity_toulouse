import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import TinyMCE from 'react-tinymce'
import { Grid, Header, Form, Input, Button, Icon } from 'semantic-ui-react'
import { SketchPicker } from 'react-color'

export default class TerritoryForm extends TrackerReact(Component) {

    state = {
        territory: {}
    }

    componentWillMount() {
        if (this.props.territory) {
            this.setState({ territory: this.props.territory })
        }
    }

    componentWillReceiveProps(new_props) {
        if (new_props.territory) {
            this.setState({ territory: new_props.territory })
        }
    }

    handleTerritoryChange = (e) => {
        let { territory } = this.state
        territory[e.target.name] = e.target.value
        this.setState({ territory })
    }

    handleContentChange = (e) => {
        let { territory } = this.state
        territory.content = e.target.getContent()
        this.setState({ territory })
    }

    toggleTerritory = (attr) => {
        let { territory } = this.state
        territory[attr] = !territory[attr]
        this.setState({ territory })
    }

    handleColorChange = (color) => {
        let { territory } = this.state
        territory.color = color.hex
        this.setState({ territory })
    }

    submit_form = (e) => {
        e.preventDefault()
        if (this.props.territory) {
            Meteor.call('territories.update', this.state.territory, (error, result) => {
                if (error) {
                    console.log(error)
                    Bert.alert({
                        title: 'Erreur lors de la modification du territoire',
                        message: error.message,
                        type: 'danger',
                        style: 'growl-bottom-left'
                    })
                } else {
                    Bert.alert({
                        title: 'Le territoire a bien été modifié',
                        type: 'success',
                        style: 'growl-bottom-left'
                    })
                    if (this.props.onSubmitForm) {
                        this.props.onSubmitForm()
                    }
                }
            })
        } else {
            Meteor.call('territories.insert', this.state.territory, (error, result) => {
                if (error) {
                    console.log(error)
                    Bert.alert({
                        title: "Erreur lors de la création du territoire",
                        message: error.message,
                        type: 'danger',
                        style: 'growl-bottom-left'
                    })
                } else {
                    Bert.alert({
                        title: "Le territoire a bien été ajouté",
                        type: 'success',
                        style: 'growl-bottom-left'
                    })
                    if (this.props.onSubmitForm) {
                        this.props.onSubmitForm()
                    }
                }
            })
        }
    }

    handleRichContent = (e, attr) => {
        let { territory } = this.state
        territory[attr] = e.target.getContent()
        this.setState({ territory })
    }

    render() {

        const { territory } = this.state

        return (
            <Form onSubmit={this.submit_form}>
            <Form.Group widths='equal'>
                <Form.Input
                    onChange={this.handleTerritoryChange}
                    type='text'
                    label="Nom du territoire"
                    value={territory.name}
                    name="name"
                />
                <Form.Input
                    onChange={this.handleTerritoryChange}
                    type='text'
                    label="Numéro / Référence du territoire"
                    value={territory.reference}
                    name="reference"
                />
            </Form.Group>
                <Form.Input
                    onChange={this.handleTerritoryChange}
                    type='text'
                    label="Nom de l'élu"
                    value={territory.official_user_name}
                    name="official_user_name"
                />
                <Form.Field>
                    <label>Description de l'élu local</label>
                    <TinyMCE
                        content={territory.official_user_description}
                        config={{
                            plugins: 'image autoresize',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect'
                        }}
                        onChange={(e) => this.handleRichContent(e, 'official_user_description')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Description du territoire</label>
                    <TinyMCE
                        content={territory.description}
                        config={{
                            plugins: 'image autoresize',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect'
                        }}
                        onChange={(e) => this.handleRichContent(e, 'description')}
                    />
                </Form.Field>
                <Form.Input
                    onChange={this.handleTerritoryChange}
                    type='text'
                    label="URL d'image"
                    value={territory.image_url}
                    name="image_url"
                />
                <Form.Input
                    label="Coordonnées (format JSON)"
                    value={territory.coordinates}
                    name="coordinates"
                    onChange={this.handleTerritoryChange}
                />
                <Form.Input
                    label="Coordonnées du centre(format JSON)"
                    value={territory.center_coordinates}
                    name="center_coordinates"
                    onChange={this.handleTerritoryChange}
                />
                <Form.Field>
                    <label>Couleur du territoire sur la carte</label>
                    <SketchPicker color={territory.color} onChangeComplete={this.handleColorChange} />
                </Form.Field>
                <Form.Checkbox
                    checked={territory.active}
                    label="Territoire actif"
                    onClick={() => this.toggleTerritory('active')}
                />
                <Button color="green">{this.props.territory ? "Modifier" : "Créer"}</Button>
            </Form>
        )
    }
}
