import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Form, Input, Checkbox, Divider, Button, Card, Image, Header, Item } from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'
import { SketchPicker } from 'react-color'
import ImageCropper from '/imports/components/general/ImageCropper'

export default class ConfigurationLandingForm extends Component {

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

    handleRichContent = (e, attr) => {
        let { configuration } = this.state
        configuration[attr] = e.target.getContent()
        this.setState({ configuration })
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

    handleFileImport = (attr, e) => {
        e.preventDefault()
        var metaContext = {}
        var uploader = new Slingshot.Upload("ConsultImage", metaContext)
        console.log('UPLOAD', attr)
        uploader.send(e.target.files[0], (error, downloadUrl) => {
          if (error) {
            // Log service detailed response
            console.error('Error uploading', error)
            Bert.alert({
              title: "Une erreur est survenue durant l'envoi de l'image à Amazon",
              message: error.reason,
              type: 'danger',
              style: 'growl-bottom-left',
            })
          }
          else {
              let {configuration} = this.state
              configuration[attr] = downloadUrl
            this.setState({configuration})
          }
        })
      }

      handleBackgroundUrl = (cropped_image) => {
        var metaContext = {}
        var uploader = new Slingshot.Upload("ConsultImage", metaContext)
        console.log('CROPPED IMAGE', cropped_image)
        uploader.send(cropped_image, (error, downloadUrl) => {
            if (error) {
              // Log service detailed response
              console.error('Error uploading', error)
              Bert.alert({
                title: "Une erreur est survenue durant l'envoi de l'image à Amazon",
                message: error.reason,
                type: 'danger',
                style: 'growl-bottom-left',
              })
            }
            else {
                let {configuration} = this.state
                configuration.landing_header_background_url = downloadUrl
                this.setState({configuration})
            }
          })
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

    handleColorChange = (attr, color, e) => {
        let { configuration } = this.state
        configuration[attr] = color.hex
        this.setState({ configuration })
    }

    toggleState = (e) => this.setState({ [e.target.name]: !this.state[e.target.name] })

    render() {
        const { configuration } = this.state
        const { amazon_connected } = Session.get('global_configuration')

        return (
            <Grid stackable {...this.props} >
                <Grid.Column width={16}>
                    <Form onSubmit={this.submit_form}>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Termes de la page d'accueil</Divider>
                        <Form.Group widths="equal">
                            <Form.Input
                                label="Titre en page d'accueil"
                                placeholder="ex: Ma ville"
                                name="landing_main_title"
                                value={configuration.landing_main_title}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                label="Phrase d'accroche (sous le titre)"
                                placeholder="ex: Participez à la démocratie de votre ville"
                                name="landing_header_description"
                                value={configuration.landing_header_description}
                                onChange={this.handleConfigurationChange}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label="Titre de la partie explicative"
                                onChange={this.handleConfigurationChange}
                                placeholder="Qu'est-ce que c'est ?"
                                value={configuration.landing_explain_title}
                                name='landing_explain_title'
                            />
                            <Form.Input
                                label="Texte de fond du titre explicatif"
                                onChange={this.handleConfigurationChange}
                                placeholder="Myopencity"
                                value={configuration.landing_explain_backtext}
                                name='landing_explain_backtext'
                            />
                            <Form.Input
                                label="Titre de la carte"
                                onChange={this.handleConfigurationChange}
                                placeholder="Carte interractive de la Métropole"
                                value={configuration.landing_map_title}
                                name='landing_map_title'
                            />
                        </Form.Group>
                        <Form.Group widths="16">
                            <Form.Field width={16}>
                                <label>Texte d'explication de la page d'accueil</label>
                                <TinyMCE
                                    content={configuration.landing_explain_text}
                                    config={{
                                        plugins: 'image autoresize media code link',
                                        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                        images_upload_handler: this.handleUploadImage
                                    }}
                                    onChange={(e) => this.handleRichContent(e, 'landing_explain_text')}
                                    name="landing_explain_text"
                                />
                            </Form.Field>
                        </Form.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Images et icônes</Divider>
                        <Item.Group divided>
                            <Item>
                                <Item.Image size='tiny' src={configuration.landing_header_background_url} />
                                <Item.Content verticalAlign='middle'>
                                    <Header as='h3'>Image principale</Header>
                                    <Form.Input
                                        label="URL de l'image de fond du header"
                                        placeholder="https://..."
                                        name="landing_header_background_url"
                                        value={configuration.landing_header_background_url}
                                        onChange={this.handleConfigurationChange}
                                    />
                                    {amazon_connected && <ImageCropper onCrop={this.handleBackgroundUrl} />}
                                </Item.Content>
                            </Item>
                        </Item.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>DESIGN ET COULEURS</Divider>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Couleur du titre</label>
                                <SketchPicker color={configuration.landing_main_title_color} onChangeComplete={(e) => { this.handleColorChange('landing_main_title_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur de la phrase d'accroche</label>
                                <SketchPicker color={configuration.landing_header_description_color} onChangeComplete={(e) => { this.handleColorChange('landing_header_description_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur de fond des consultations mises en avant</label>
                                <SketchPicker color={configuration.landing_consults_background_color} onChangeComplete={(e) => { this.handleColorChange('landing_consults_background_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur de fond des propositions mises en avant</label>
                                <SketchPicker color={configuration.landing_projects_background_color} onChangeComplete={(e) => { this.handleColorChange('landing_projects_background_color', e) }} />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label="Hauteur du header (height)"
                                placeholder="ex: 100%"
                                name="landing_header_height"
                                value={configuration.landing_header_height}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                label="Hauteur minimum du header (min-height)"
                                placeholder="ex: 100vh"
                                name="landing_header_min_height"
                                value={configuration.landing_header_min_height}
                                onChange={this.handleConfigurationChange}
                            />
                        </Form.Group>
                        <Button color="green" content="Valider les modifications" />
                    </Form>
                </Grid.Column>
            </Grid>

        )
    }
}