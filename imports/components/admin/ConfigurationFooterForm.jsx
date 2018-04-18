import React, { Component } from 'react'
import { Grid, Form, Input, Checkbox, Divider, Button, Card, Image, Header, Item } from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'
import { SketchPicker } from 'react-color'
import { withTracker } from 'meteor/react-meteor-data'
import { Configuration } from '/imports/api/configuration/configuration'

class ConfigurationFooterForm extends Component {

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
            const {configuration} = this.props
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

    handleColorChange = (attr, color, e) => {
        let { configuration } = this.state
        configuration[attr] = color.hex
        this.setState({ configuration })
    }

    toggleConfiguration = (attr) => {
        let { configuration } = this.state
        configuration[attr] = !configuration[attr]
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
                        <Form.Checkbox
                            checked={configuration.footer_display}
                            onClick={() => this.toggleConfiguration('footer_display')}
                            label="Afficher le footer"
                        />
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Termes du footer</Divider>
                        <Form.Group widths="equal">
                            <Form.Input
                                label="Contenu du footer"
                                placeholder="Développé par Myopencity"
                                name="footer_content"
                                value={configuration.footer_content}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                label="Terme pour 'conditions d'utilisation' "
                                placeholder="ex: Conditions générales / Mentions légales"
                                name="cgu_term"
                                value={configuration.cgu_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                label="Terme pour 'mentions légales' "
                                placeholder="ex: Conditions générales / Mentions légales"
                                name="legal_notice_term"
                                value={configuration.legal_notice_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                label="Terme pour 'A propos' "
                                placeholder="ex: A propos de nous"
                                name="about_term"
                                value={configuration.about_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                label="Hauteur du footer"
                                placeholder="ex: 10em"
                                name="footer_height"
                                value={configuration.footer_height}
                                onChange={this.handleConfigurationChange}
                            />
                        </Form.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>COULEURS</Divider>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Couleur de l'écriture du footer</label>
                                <SketchPicker color={configuration.footer_color} onChangeComplete={(e) => { this.handleColorChange('footer_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur de fond du footer</label>
                                <SketchPicker color={configuration.footer_background_color} onChangeComplete={(e) => { this.handleColorChange('footer_background_color', e) }} />
                            </Form.Field>
                        </Form.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>PROFILS UTILISATEURS</Divider>
                        <Form.Field width={16}>
                            <label>Explication pour remplir le profil utilisateur</label>
                            <TinyMCE
                                content={configuration.fill_profile_explain}
                                config={{
                                    plugins: 'image autoresize media code link',
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                    images_upload_handler: this.handleUploadImage
                                }}
                                onChange={(e) => this.handleRichContent(e, 'fill_profile_explain')}
                                name="fill_profile_explain"
                            />
                        </Form.Field>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>CONDITIONS D'UTILISATION / MENTIONS LÉGALES</Divider>
                        <Form.Group widths='equal'>
                            <Form.Checkbox
                                checked={configuration.footer_cgu_display}
                                onClick={() => this.toggleConfiguration('footer_cgu_display')}
                                label="Afficher le bouton des conditions dans le footer"
                            />
                            <Form.Checkbox
                                checked={configuration.cgu_acceptance}
                                onClick={() => this.toggleConfiguration('cgu_acceptance')}
                                label="Acceptation des conditions obligatoire à l'inscription"
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Checkbox
                                checked={configuration.footer_legal_notice_display}
                                onClick={() => this.toggleConfiguration('footer_legal_notice_display')}
                                label="Afficher le bouton des mentions légales dans le footer"
                            />
                            <Form.Checkbox
                                checked={configuration.legal_notice_acceptance}
                                onClick={() => this.toggleConfiguration('legal_notice_acceptance')}
                                label="Acceptation des mentions légales obligatoire à l'inscription"
                            />
                        </Form.Group>
                        <Form.Checkbox
                                checked={configuration.footer_about_display}
                                onClick={() => this.toggleConfiguration('footer_about_display')}
                                label="Afficher le bouton à propos dans le footer"
                            />
                        <Form.Field width={16}>
                            <label>Conditions générales d'utilisation</label>
                            <TinyMCE
                                content={configuration.cgu}
                                config={{
                                    plugins: 'image autoresize media code link',
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                    images_upload_handler: this.handleUploadImage
                                }}
                                onChange={(e) => this.handleRichContent(e, 'cgu')}
                                name="cgu"
                            />
                        </Form.Field>
                        <Form.Field width={16}>
                            <label>Texte CNIL Formulaire inscription (laisser vide pour cacher)</label>
                            <TinyMCE
                                content={configuration.cnil_signup_text}
                                config={{
                                    plugins: 'image autoresize media code link',
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                    images_upload_handler: this.handleUploadImage
                                }}
                                onChange={(e) => this.handleRichContent(e, 'cnil_signup_text')}
                                name="cnil_signup_text"
                            />
                        </Form.Field>
                        <Form.Field width={16}>
                            <label>Mentions légales</label>
                            <TinyMCE
                                content={configuration.legal_notice}
                                config={{
                                    plugins: 'image autoresize media code link',
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                    images_upload_handler: this.handleUploadImage
                                }}
                                onChange={(e) => this.handleRichContent(e, 'legal_notice')}
                                name="legal_notice"
                            />
                        </Form.Field>
                        <Form.Field width={16}>
                            <label>A propos</label>
                            <TinyMCE
                                content={configuration.about}
                                config={{
                                    plugins: 'image autoresize media code link',
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                    images_upload_handler: this.handleUploadImage
                                }}
                                onChange={(e) => this.handleRichContent(e, 'about')}
                                name="about"
                            />
                        </Form.Field>
                        <Button color="green" content="Valider les modifications" />
                    </Form>
                </Grid.Column>
            </Grid>

        )
    }
}

export default ConfigurationFooterFormContainer = withTracker(() => {
    const configurationPublication = Meteor.subscribe('configuration.complete')
    const loading = !configurationPublication.ready()
    const configuration = Configuration.findOne()
    return {
        loading,
        configuration
    }
})(ConfigurationFooterForm)