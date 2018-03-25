import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Form, Input, Checkbox, Divider, Button, Item, Image, Header } from 'semantic-ui-react'
import { SketchPicker } from 'react-color'

export default class ConfigurationGeneralForm extends Component {

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

    handleColorChange = (attr, color, e) => {
        let { configuration } = this.state
        configuration[attr] = color.hex
        this.setState({ configuration })
    }

    handleConfigurationChange = (e) => {
        let { configuration } = this.state
        configuration[e.target.name] = e.target.value
        this.setState({ configuration })
    }

    toggleConfiguration = (attr) => {
        let { configuration } = this.state
        configuration[attr] = !configuration[attr]
        this.setState({ configuration })
    }

    render() {
        const { configuration } = this.state
        const {amazon_connected} = Meteor.isClient && Session.get('global_configuration')

        return (
            <Grid stackable {...this.props}>
                <Grid.Column width={16}>
                    <Form onSubmit={this.submit_form}>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Termes généraux</Divider>
                        <Form.Group widths="equal">
                            <Form.Input
                                label="Nom de la plateforme"
                                placeholder="ex: Ma ville"
                                name="main_title"
                                value={configuration.main_title}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                label="Description générale"
                                placeholder="ex: Participez à la démocratie de votre ville"
                                name="main_description"
                                value={configuration.main_description}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Checkbox
                                checked={configuration.seo_active}
                                onClick={() => this.toggleConfiguration('seo_active')}
                                label={"Référencement sur les réseaux sociaux"}
                            />
                            <Form.Input
                                label="Titre de la page Quartiers"
                                placeholder="ex: Quartiers"
                                name="territories_title"
                                value={configuration.territories_title}
                                onChange={this.handleConfigurationChange}
                            />
                        </Form.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Images et icônes</Divider>
                        <Item.Group divided>
                            <Item>
                                <Item.Image size='tiny' src={configuration.global_image_url} />
                                <Item.Content verticalAlign='middle'>
                                    <Header as='h3'>Image principale</Header>
                                    <Form.Input
                                        label="URL de l'image principale"
                                        placeholder="https://..."
                                        name="global_image_url"
                                        value={configuration.global_image_url}
                                        onChange={this.handleConfigurationChange}
                                    />
                                    {amazon_connected && <Input onChange={(e) => { this.handleFileImport('global_image_url', e) }} type="file" />}
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='tiny' src={configuration.global_logo_url} />
                                <Item.Content verticalAlign='middle'>
                                    <Header as='h3'>Logo de la plateforme</Header>
                                    <Form.Input
                                        label="URL du logo principal"
                                        placeholder="https://..."
                                        name="global_logo_url"
                                        value={configuration.global_logo_url}
                                        onChange={this.handleConfigurationChange}
                                    />
                                    {amazon_connected && <Input onChange={(e) => { this.handleFileImport('global_logo_url', e) }} type="file" />}
                                </Item.Content>
                            </Item>
                        </Item.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Boutons et couleurs</Divider>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Couleur de fond des boutons de validation</label>
                                <SketchPicker color={configuration.buttons_validation_background_color} onChangeComplete={(e) => { this.handleColorChange('buttons_validation_background_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur du texte des boutons de validation</label>
                                <SketchPicker color={configuration.buttons_validation_text_color} onChangeComplete={(e) => { this.handleColorChange('buttons_validation_text_color', e) }} />
                            </Form.Field>
                        </Form.Group>
                        <Button color="green" content="Valider les modifications" />
                    </Form>
                </Grid.Column>
            </Grid>

        )
    }
}