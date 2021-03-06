import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Form, Input, Checkbox, Divider, Button, Card, Image, Header, Item } from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'
import { SketchPicker } from 'react-color'
import ImageCropper from '/imports/components/general/ImageCropper'

export default class ConfigurationConsultsForm extends Component {

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

    handleDefaultImage = (cropped_image) => {
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
                configuration.consults_default_image_url = downloadUrl
                this.setState({configuration})
            }
          })
      }

    render() {
        const { configuration } = this.state
        const { amazon_connected } = Session.get('global_configuration')

        return (
            <Grid stackable {...this.props} >
                <Grid.Column width={16}>
                    <Form onSubmit={this.submit_form}>
                        <Form.Input
                                width={5}
                                label="Terme générique pour une consultation"
                                placeholder="consultation"
                                name="consult_term"
                                value={configuration.consult_term}
                                onChange={this.handleConfigurationChange}
                            />
                        <Form.Input
                                width={5}
                                label="Terme générique pour des consultations"
                                placeholder="consultations"
                                name="consults_term"
                                value={configuration.consults_term}
                                onChange={this.handleConfigurationChange}
                            />
                        <Item.Group divided>
                            <Item>
                                <Item.Image size='tiny' src={configuration.consults_default_image_url} />
                                <Item.Content verticalAlign='middle'>
                                    <Header as='h3'>Image par défaut</Header>
                                    <Form.Input
                                        label="URL de l'image par défaut des consultations"
                                        placeholder="https://..."
                                        name="consults_default_image_url"
                                        value={configuration.consults_default_image_url}
                                        onChange={this.handleConfigurationChange}
                                    />
                                    {amazon_connected && <ImageCropper onCrop={this.handleDefaultImage} />}
                                </Item.Content>
                            </Item>
                        </Item.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Termes et hauteurs</Divider>
                        <Form.Group>
                            <Form.Input
                                width={5}
                                label="Titre de la page de consultations pour tous les territoires"
                                placeholder="ex: Tous les quartiers de la métropole"
                                name="consults_all_territories"
                                value={configuration.consults_all_territories}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Explication de la page de consultations en cours"
                                placeholder="ex: Consultations en cours"
                                name="consults_title"
                                value={configuration.consults_title}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Titre de la page de consultations terminées"
                                placeholder="ex: Consultations terminées"
                                name="consults_all_territories_ended"
                                value={configuration.consults_all_territories_ended}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Explication de la page de consultations terminées"
                                placeholder="ex: Consultations en cours"
                                name="ended_consults_title"
                                value={configuration.ended_consults_title}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Message si pas de consultations"
                                placeholder="Aucune consultation"
                                name="consults_no_consults"
                                value={configuration.consults_no_consults}
                                onChange={this.handleConfigurationChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Input
                                width={5}
                                label="Hauteur de la bannière de consultation"
                                placeholder="10em"
                                name="consult_header_height"
                                value={configuration.consult_header_height}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Taille du texte de description"
                                placeholder="1.2em"
                                name="consult_description_font_size"
                                value={configuration.consult_description_font_size}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Préfixe du territoire"
                                placeholder="ex: Consultation lancée sur"
                                name="consult_territory_prefix"
                                value={configuration.consult_territory_prefix}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Icone du territoire"
                                icon={configuration.consult_territory_icon}
                                placeholder="ex: marker"
                                name="consult_territory_icon"
                                value={configuration.consult_territory_icon}
                                onChange={this.handleConfigurationChange}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                width={5}
                                label="Terme 'a déjà voté'"
                                icon={configuration.consult_yet_voted_term}
                                placeholder="Vous avez déjà voté"
                                name="consult_yet_voted_term"
                                value={configuration.consult_yet_voted_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Contenu du bouton de vote"
                                icon={configuration.consult_vote_button_term}
                                placeholder="Voter"
                                name="consult_vote_button_term"
                                value={configuration.consult_vote_button_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Terme pour les 'soutiens' d'alternative"
                                placeholder="ex: likes"
                                name="alternative_likes_term"
                                value={configuration.alternative_likes_term}
                                onChange={this.handleConfigurationChange}
                            />
                        </Form.Group>

                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>ALTERNATIVES</Divider>
                        <Form.Group widths='equal'>
                            <Form.Input
                                width={5}
                                label="Terme générique pour 'alternative'"
                                icon={configuration.alternative_term}
                                placeholder="alternative"
                                name="alternative_term"
                                value={configuration.alternative_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Terme générique pour 'alternatives' (pluriel)"
                                icon={configuration.alternatives_term}
                                placeholder="alternatives"
                                name="alternatives_term"
                                value={configuration.alternatives_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Terme descriptif pour une alternative"
                                icon={configuration.alternative_descriptive_term}
                                placeholder="l'alternative"
                                name="alternative_descriptive_term"
                                value={configuration.alternative_descriptive_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Contenu du bouton de validation d'alternative"
                                icon={configuration.consult_alternative_validation_term}
                                placeholder="Voter"
                                name="consult_alternative_validation_term"
                                value={configuration.consult_alternative_validation_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Contenu du bouton d'alternative"
                                icon={configuration.consult_alternative_button_term}
                                placeholder="Voter"
                                name="consult_alternative_button_term"
                                value={configuration.consult_alternative_button_term}
                                onChange={this.handleConfigurationChange}
                            />
                            <Form.Input
                                width={5}
                                label="Terme de profil anonyme"
                                icon={configuration.alternatives_anonymous_profile_term}
                                placeholder="Quelqu'un"
                                name="alternatives_anonymous_profile_term"
                                value={configuration.alternatives_anonymous_profile_term}
                                onChange={this.handleConfigurationChange}
                            />
                            
                            
                        </Form.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>COULEURS</Divider>
                        <Form.Group>
                            <Form.Field>
                                <label>Couleur des titres de consultation</label>
                                <SketchPicker color={configuration.consult_header_color} onChangeComplete={(e) => { this.handleColorChange('consult_header_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur de fond de la description</label>
                                <SketchPicker color={configuration.consult_description_background_color} onChangeComplete={(e) => { this.handleColorChange('consult_description_background_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur du texte de description</label>
                                <SketchPicker color={configuration.consult_description_color} onChangeComplete={(e) => { this.handleColorChange('consult_description_color', e) }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur de l'icone de soutien avis</label>
                                <SketchPicker color={configuration.alternative_like_icon_color} onChangeComplete={(e) => { this.handleColorChange('alternative_like_icon_color', e) }} />
                            </Form.Field>
                        </Form.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Anonymat</Divider>
                        <Form.Group>
                            <Form.Checkbox
                                checked={configuration.alternatives_anonymous_choice}
                                onClick={() => this.toggleConfiguration('alternatives_anonymous_choice')}
                                label={"Les citoyens peuvent choisir l'anonymat des avis"}
                            />
                            <Form.Checkbox
                                checked={configuration.alternatives_anonymous_default}
                                onClick={() => this.toggleConfiguration('alternatives_anonymous_default')}
                                label={"Avis anonymes par défaut"}
                            />
                        </Form.Group>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Explication de la page consultations</Divider>
                        <Form.Checkbox
                            checked={configuration.consults_display_explain}
                            onClick={() => this.toggleConfiguration('consults_display_explain')}
                            label={"Afficher l'explication"}
                        />
                        <Form.Field width={16}>
                            <label>Explication de la page consultations</label>
                            <TinyMCE
                                content={configuration.consults_explain}
                                config={{
                                    plugins: 'image autoresize media code link',
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                    images_upload_handler: this.handleUploadImage
                                }}
                                onChange={(e) => this.handleRichContent(e, 'consults_explain')}
                                name="consults_explain"
                            />
                        </Form.Field>
                        <Divider className="opencity-divider" style={{ color: configuration.navbar_color }} section>Explication de la page consultations terminées</Divider>
                        <Form.Checkbox
                            checked={configuration.ended_consults_display_explain}
                            onClick={() => this.toggleConfiguration('ended_consults_display_explain')}
                            label={"Afficher l'explication"}
                        />
                        <Form.Field width={16}>
                            <label>Explication de la page consultations terminées</label>
                            <TinyMCE
                                content={configuration.ended_consults_explain}
                                config={{
                                    plugins: 'image autoresize media code link',
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                    images_upload_handler: this.handleUploadImage
                                }}
                                onChange={(e) => this.handleRichContent(e, 'ended_consults_explain')}
                                name="ended_consults_explain"
                            />
                        </Form.Field>
                        <Button color="green" content="Valider les modifications" />
                    </Form>
                </Grid.Column>
            </Grid>

        )
    }
}