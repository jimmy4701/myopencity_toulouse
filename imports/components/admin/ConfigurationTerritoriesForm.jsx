import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Form, Input, Checkbox, Divider, Button, Card, Image, Header, Item } from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'
import { SketchPicker } from 'react-color'

export default class ConfigurationTerritoriesForm extends Component {

    /*
      facultative props:
        - configuration: Object
        - onSubmitForm: Function
    */

    state = {
        configuration: {}
    }

    componentWillMount() {
        if (Meteor.isClient) {
            const configuration = Session.get('global_configuration')
            this.setState({ configuration })
        }
    }

    submit_form = (e) => {
        e.preventDefault()
        Meteor.call('configuration.update', this.state.configuration, (error, result) => {
            if (error) {
                console.log("Configuration update error", error)
                Bert.alert({
                    title: "Erreur lors de la modification de la configuration",
                    message: error.reason,
                    type: 'danger',
                    style: 'growl-bottom-left',
                })
            } else {
                Bert.alert({
                    title: "La configuration a bien été modifiée",
                    type: 'success',
                    style: 'growl-bottom-left',
                })
            }
        })
    }

    handleConfigurationChange = (e) => {
        let { configuration } = this.state
        configuration[e.target.name] = e.target.value
        this.setState({ configuration })
    }

    toggleConfiguration = (attr) => {
        console.log('attr', attr)
        let { configuration } = this.state
        configuration[attr] = !configuration[attr]
        this.setState({ configuration })
    }

    handleColorChange = (attr, color, e) => {
        let { configuration } = this.state
        configuration[attr] = color.hex
        this.setState({ configuration })
    }

    handleRichContent = (e, attr) => {
        let { configuration } = this.state
        configuration[attr] = e.target.getContent()
        this.setState({ configuration })
    }

    handleUploadImage = (blobInfo, success, failure) => {
        var metaContext = {}
        var uploader = new Slingshot.Upload("ConsultImage", metaContext)
        uploader.send(blobInfo.blob(), (error, downloadUrl) => {
        if (error) {
            // Log service detailed response
            console.error('Error uploading', error)
            Bert.alert({
                title: "Une erreur est survenue durant l'envoi de l'image à Amazon",
                message: error.reason,
                type: 'danger',
                style: 'growl-bottom-left',
            })
            failure("Erreur lors de l'envoi de l'image : " + error)
        }
        else {
            success(downloadUrl)
        }
        })
        
    }

    render() {
        const { configuration } = this.state

        return (
            <Grid stackable {...this.props} >
                <Grid.Column width={16}>
                    <Form onSubmit={this.submit_form}>
                        <Form.Input
                            label="Titre de la page Quartiers"
                            placeholder="ex: Quartiers"
                            name="territories_title"
                            value={configuration.territories_title}
                            onChange={this.handleConfigurationChange}
                        />
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Explication de la page consultations</Divider>
                            <Form.Checkbox
                                checked={configuration.territories_display_explain}
                                onClick={() => this.toggleConfiguration('territories_display_explain')}
                                label={"Afficher l'explication"}
                            />
                            <Form.Field width={16}>
                                <label>Explication de la page quartiers</label>
                                <TinyMCE
                                    content={configuration.territories_explain}
                                    config={{
                                        plugins: 'image autoresize media code link',
                                        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                        images_upload_handler: this.handleUploadImage
                                    }}
                                    onChange={(e) => this.handleRichContent(e, 'territories_explain')}
                                    name="territories_explain"
                                />
                            </Form.Field>
                        <Button color="green" content="Valider les modifications" />
                    </Form>
                </Grid.Column>
            </Grid>

        )
    }
}