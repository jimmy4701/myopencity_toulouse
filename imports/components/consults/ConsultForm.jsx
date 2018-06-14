import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Grid, Header, Form, Button, Input, TextArea, Menu, Segment, Checkbox, Popup, Icon, Select } from 'semantic-ui-react'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import ConsultPartForm from '/imports/components/consult_parts/ConsultPartForm'
import Geocomplete from '/imports/components/territories/Geocomplete'
import StandardMap from '/imports/components/territories/StandardMap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import ImageCropper from '/imports/components/general/ImageCropper'


export default class ConsultForm extends TrackerReact(Component) {

  /*
    facultative props:
      - consult: Object (Consult to enable edit mode)
  */

  state = {
    consult: {
      api_votable: true,
      api_recoverable: true,
      alternatives_validation: false,
      attached_files: [],
      territories: [],
      image_url: Session.get('global_configuration').consults_default_image_url
    },
    step: 'global', // 'global' / 'design' / 'parts' / 'documents' / 'settings'
    editing_part: null,
    editing_part_index: null,
    consult_parts: [],
    display_part_form: false,
    removing_consult_parts: [],
    adding_file_name: ''
  }

  componentWillReceiveProps(new_props) {
    const { consult, consult_parts } = new_props
    if (consult && consult_parts) {
      consult.start_date = consult.start_date && moment(consult.start_date)
      consult.end_date = consult.end_date && moment(consult.end_date)
      this.setState({ consult, consult_parts })
    }
  }

  componentWillMount() {
    const { consult, consult_parts } = this.props
    if (consult && consult_parts) {
      this.setState({ consult, consult_parts })
    }
  }

  handleChange(attr, e) {
    let state = this.state
    state[attr] = e.target.value
    this.setState(state)
  }

  handleConsultChange(attr, e) {
    let { consult } = this.state
    consult[attr] = e.target.value
    this.setState({ consult })
  }

  remove_attached_file(index, e) {
    e.preventDefault()
    let { consult } = this.state
    consult.attached_files.splice(index, 1)
    this.setState({ consult })
  }

  submit_form(e) {
    e.preventDefault()
    const { consult, consult_parts, removing_consult_parts } = this.state

    if (this.props.consult) {
      Meteor.call('consults.update', { consult, consult_parts }, (error, result) => {
        if (error) {
          console.log(error)
          Bert.alert({
            title: "Erreur lors de la modification de la consultation",
            message: error.reason,
            type: 'danger',
            style: 'growl-bottom-left',
          })
        } else {
          Meteor.call('consult_parts.remove_multiple', removing_consult_parts, (error, result) => {
            if (error) {
              console.log(error)
              Bert.alert({
                title: "Erreur lors de la suppression des parties",
                message: error.reason,
                type: 'danger',
                style: 'growl-bottom-left',
              })
            }
          })
          if (this.props.onFormSubmit) {
            this.props.onFormSubmit(result)
          }
          Bert.alert({
            title: "Consultation modifiée",
            type: 'success',
            style: 'growl-bottom-left',
          })
        }
      });
    } else {
      Meteor.call('consults.insert', { consult, consult_parts }, (error, result) => {
        if (error) {
          console.log(error)
          Bert.alert({
            title: "Erreur lors de la création de la consultation",
            message: error.reason,
            type: 'danger',
            style: 'growl-bottom-left',
          })
        } else {
          if (this.props.onFormSubmit) {
            this.props.onFormSubmit(result)
          }
          Bert.alert({
            title: "Consultation créée !",
            type: 'success',
            style: 'growl-bottom-left',
          })
        }
      });
    }
  }

  changeStep(step, e) {
    e.preventDefault()
    this.setState({ step })
  }

  create_new_part(new_part) {
    let { consult_parts, display_part_form } = this.state
    consult_parts.push(new_part)
    display_part_form = false
    this.setState({ consult_parts, display_part_form })
  }

  edit_part(part) {
    let { consult_parts, editing_part_index } = this.state
    consult_parts[editing_part_index] = part
    this.setState({
      consult_parts,
      editing_part_index: null,
      editing_part: null,
      display_part_form: false
    })
  }

  toggle_edit_part(index, e) {
    e.preventDefault()
    let { consult_parts } = this.state
    const part = consult_parts[index]
    this.setState({ editing_part: part, editing_part_index: index, display_part_form: true })
  }

  handleStartDate = (date) => {
    let {consult} = this.state
    consult.start_date = date.toDate()
    this.setState({consult})
  }

  handleEndDate = (date) => {
    let {consult} = this.state
    consult.end_date = date.toDate()
    this.setState({consult})
  }

  remove_part(index, e) {
    e.preventDefault()
    let { consult_parts, removing_consult_parts } = this.state
    const consult_part = consult_parts[index]
    if (consult_part._id) {
      removing_consult_parts.push(consult_part._id)
    }
    consult_parts.splice(index, 1)
    this.setState({ consult_parts, removing_consult_parts })
  }

  togglePartForm(e) {
    let { display_part_form } = this.state
    display_part_form = !display_part_form
    if (!display_part_form) {
      this.setState({ display_part_form: display_part_form, editing_part: null, editing_part_index: null })
    } else {
      this.setState({ display_part_form })
    }
  }

  toggleState(attr, e) {
    let state = this.state
    state[attr] = !state[attr]
    this.setState(state)
  }

  toggleConsult(attr, e) {
    let { consult } = this.state
    consult[attr] = !consult[attr]
    this.setState({ consult })
  }

  handlePictureImport = (cropped_image) => {
    this.setState({ loading_consult_image: true })
    var metaContext = {}
    var uploader = new Slingshot.Upload("ConsultImage", metaContext)
    uploader.send(cropped_image, (error, downloadUrl) => {
      if (error) {
        // Log service detailed response
        console.error('Error uploading', error)
        this.setState({ loading_consult_image: false })
        Bert.alert({
          title: "Une erreur est survenue durant l'envoi de l'image à Amazon",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }
      else {
        // we use $set because the user can change their avatar so it overwrites the url :)
        const { consult } = this.state
        consult.image_url = downloadUrl
        this.setState({ consult, loading_consult_image: false })
      }
      // you will need this in the event the user hit the update button because it will remove the avatar url
    })
  }

  handleFileImport(e) {
    e.preventDefault()
    this.setState({ loading_consult_file: true })
    var metaContext = { title: this.state.adding_file_name }
    var uploader = new Slingshot.Upload("ConsultFile", metaContext)
    uploader.send(e.target.files[0], (error, downloadUrl) => {
      if (error) {
        // Log service detailed response
        console.error('Error uploading', error)
        this.setState({ loading_consult_file: false })
        Bert.alert({
          title: "Une erreur est survenue durant l'envoi du document à Amazon",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }
      else {
        // we use $set because the user can change their avatar so it overwrites the url :)
        const { consult, adding_file_name } = this.state
        const new_file = {
          title: adding_file_name,
          url: downloadUrl
        }
        consult.attached_files.push(new_file)
        this.setState({ consult, loading_consult_file: false, adding_file_name: '' })
      }
      // you will need this in the event the user hit the update button because it will remove the avatar url
    })
  }

  removeAddress = () => {
    let {consult} = this.state
    consult.address = null
    consult.coordinates = null
    this.setState({consult})
  }

  handleTerritoriesChange = (event, data) => {
    let {consult} = this.state
    consult.territories = data.value
    this.setState({consult})
  }

  handleAddressSelect = ({address, coordinates}) => {
    let {consult} = this.state
    consult.address = address
    consult.coordinates = coordinates
    this.setState({consult})
  }

  render() {
    const { consult, editing_part, consult_parts, display_part_form, step, loading_consult_image, loading_consult_file, adding_file_name } = this.state
    const { territories } = this.props
    const { amazon_connected } = Session.get('global_configuration')

    const territories_options = territories.map(territory => {
      return {key: territory._id, value: territory._id, text: territory.name}
    })

    return (
      <Grid stackable>
        <Grid.Column width={16} className="center-align">
          <Menu>
            <Menu.Item onClick={(e) => { this.changeStep('global', e) }} active={step == 'global'}>Informations générales</Menu.Item>
            <Menu.Item onClick={(e) => { this.changeStep('geolocation', e) }} active={step == 'geolocation'}>Géolocalisation</Menu.Item>
            <Menu.Item onClick={(e) => { this.changeStep('design', e) }} active={step == 'design'}>Apparence de la consultation</Menu.Item>
            <Menu.Item onClick={(e) => { this.changeStep('parts', e) }} active={step == 'parts'}>Parties / Contenu</Menu.Item>
            <Menu.Item onClick={(e) => { this.changeStep('documents', e) }} active={step == 'documents'}>Documents</Menu.Item>
            <Menu.Item onClick={(e) => { this.changeStep('settings', e) }} active={step == 'settings'}>Configuration</Menu.Item>
            <Menu color="green" floated='right'>
              <Menu.Item>
                <Button positive onClick={(e) => { this.submit_form(e) }}>{this.props.consult ? "Modifier la consultation" : "Créer la consultation"}</Button>
              </Menu.Item>
            </Menu>
          </Menu>
        </Grid.Column>
        <Grid.Column width={16}>
          {step == 'global' ?
            <Form onSubmit={(e) => { this.changeStep('design', e) }} className="wow fadeInUp">
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>Date de début de consultation</label>
                  <DatePicker
                      selected={moment(consult.start_date)}
                      dateFormat="DD/MM/YYYY"
                      onChange={this.handleStartDate}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Date de fin de consultation</label>
                  <DatePicker
                      selected={moment(consult.end_date)}
                      dateFormat="DD/MM/YYYY"
                      onChange={this.handleEndDate}
                  />
                </Form.Field>
              </Form.Group>
              {territories.length > 0 &&
                <Form.Field>
                  <label>Quartier concerné</label>
                  <Select value={consult.territories} multiple options={territories_options} onChange={this.handleTerritoriesChange} />
                </Form.Field>
              }
              <Form.Checkbox
                checked={consult.metropole}
                onClick={(e) => this.toggleConsult('metropole', e)}
                label="Afficher le logo de la Métropole sur l'aperçu"
              />
              <Form.Field required>
                <label>Titre de la consultation</label>
                <Input type="text" placeholder="ex: Choisissons ensemble les rues à piétoniser dans le centre ville" value={consult.title} onChange={(e) => { this.handleConsultChange('title', e) }} />
              </Form.Field>
              <Form.Field required>
                <label>Description courte de la consultation</label>
                <TextArea required placeholder="Ex: Dans le cadre de la réforme régionale, nous invitons les citoyens à donner leur avis sur..." value={consult.description} onChange={(e) => { this.handleConsultChange('description', e) }} />
              </Form.Field>
              <Form.Field>
                <Button size="big">Passer à l'apparence</Button>
              </Form.Field>
            </Form>
            : ''}
          {step == 'geolocation' &&
            <Grid stackable>
              <Grid.Column width={5}>
                <Form>
                  <Form.Checkbox
                    checked={consult.map_display}
                    onClick={(e) => this.toggleConsult('map_display', e)}
                    label="Afficher sur la Google Map"
                    />
                  <Geocomplete onSelect={this.handleAddressSelect} />
                  {consult.address ?
                    <div>
                      <p>Adresse actuelle : {consult.address}</p>
                      <Button onClick={this.removeAddress}>Supprimer l'adresse</Button>
                    </div>
                  :
                    <p>Actuellement aucune adresse sélectionnée</p>
                  }
                </Form>
              </Grid.Column>
              <Grid.Column width={11}>
                  <StandardMap 
                    marker={consult.coordinates}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCziAxTCEOc9etrIjh77P86s_LA9plQdG4&libraries=geometry"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100vh` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                     />
              </Grid.Column>
            </Grid>
          }
          {step == 'design' ?
            <Grid stackable className="wow fadeInUp">
              <Grid.Column width={16}>
                <Form onSubmit={(e) => { this.changeStep('parts', e) }}>
                  <Form.Field>
                    <label>URL de l'image de votre consultation</label>
                    <Input type="text" placeholder="http://...." value={consult.image_url} onChange={(e) => { this.handleConsultChange('image_url', e) }} />
                  </Form.Field>
                  {amazon_connected ?
                    <Form.Field>
                      <label>Envoyer une image depuis votre ordinateur</label>
                      <ImageCropper onCrop={this.handlePictureImport} />
                    </Form.Field>
                    :
                    <p>Envie d'envoyer des images depuis votre ordinateur ? Vous devez <a href="/admin/external_apis">configurer Amazon S3</a></p>
                  }
                  <Form.Field>
                    <Button size="big">Passer au contenu</Button>
                  </Form.Field>
                </Form>
              </Grid.Column>
              <Grid.Column width={16} className="center-align">
                <ConsultPartial hideButtons consult={this.state.consult} />
                <p>Voilà à quoi ressemble votre consultation</p>
              </Grid.Column>
            </Grid>
            : ''}
          {step == 'parts' ?
            <Grid stackable className="wow fadeInUp">
              <Grid.Column width={16} className="center-align">
                <Button positive={!display_part_form} onClick={(e) => { this.togglePartForm(e) }}>
                  {display_part_form ?
                    "Annuler"
                    :
                    "Ajouter une partie"
                  }
                </Button>
              </Grid.Column>
              <Grid.Column width={4}>
                {consult_parts.map((part, index) => {
                  return (
                    <Segment clearing key={index}>
                      <Header as="h4" floated='left'>{part.title}</Header>
                      <Button.Group stackable floated='right'>
                        <Button icon='edit' onClick={(e) => { this.toggle_edit_part(index, e) }} />
                        <Button icon='remove' onClick={(e) => { this.remove_part(index, e) }} />
                      </Button.Group>
                    </Segment>
                  )
                })}
              </Grid.Column>
              {display_part_form ?
                <Grid.Column width={12}>
                  <ConsultPartForm consult_part={editing_part} onCreateSubmit={this.create_new_part.bind(this)} onEditSubmit={this.edit_part.bind(this)} />
                </Grid.Column>
                : ''}
            </Grid>
            : ''}
          {step == 'documents' ?
            <Grid.Column width={16}>
              {amazon_connected ?
                <Form>
                  <Form.Field>
                    <label>Donnez un titre à votre document</label>
                    <Input onChange={(e) => { this.handleChange('adding_file_name', e) }} type="text" value={adding_file_name} />
                  </Form.Field>
                  <Form.Field>
                    <label>Envoyer un document depuis votre ordinateur {!adding_file_name ? "(Merci d'entrer un nom de document)" : ""}</label>
                    <Input disabled={!adding_file_name} loading={loading_consult_file} onChange={(e) => { this.handleFileImport(e) }} type="file" />
                  </Form.Field>
                </Form>
                :
                <p>Envie d'envoyer de lier des documents à vos consultations ? Vous devez <a href="/admin/external_apis">configurer Amazon S3</a></p>
              }
              {consult.attached_files.length > 0 ?
                <Grid stackable>
                  <Grid.Column width={16} style={{ marginTop: '2em' }}>
                    <Header as="h4">Documents attachés à votre consultation</Header>
                  </Grid.Column>
                  {consult.attached_files.map((attached_file, index) => {
                    return (
                      <Grid.Column width={16} className="">
                        <Segment>
                          <Icon name="file" />
                          <Header as="h4">{attached_file.title}</Header>
                          <Button color="red" icon="remove" text="Supprimer" onClick={(e) => { this.remove_attached_file(index, e) }} />
                        </Segment>
                      </Grid.Column>
                    )
                  })}

                </Grid>
                : ''}
            </Grid.Column>
            : ''}
          {step == 'settings' ?
            <Grid.Column width={16}>
              <Form>
                <Header as="h3">Configuration de l'API</Header>
                <Form.Field>
                  <label>Récupérable par API (actuellement {consult.api_recoverable ? "récupérable" : "non récupérable"})
                      <Popup
                      trigger={<Icon size="small" name="help" circular inverted />}
                      content="Les opencities autorisés par l'API pourront récupérer cette consultation pour la faire voter sur leur propre site"
                    />
                  </label>
                  <Checkbox checked={consult.api_recoverable} onClick={(e) => { this.toggleConsult('api_recoverable', e) }} toggle />
                </Form.Field>
                <Form.Field>
                  <label>Votable par API (actuellement {consult.api_votable ? "votable par api" : "non votable par api"})
                      <Popup
                      trigger={<Icon size="small" name="help" circular inverted />}
                      content="Les opencities autorisés par l'API pourront envoyer les votes effectués sur leur site, qui seront pris en compte sur le votre"
                    />
                  </label>
                  <Checkbox checked={consult.api_votable} onClick={(e) => { this.toggleConsult('api_votable', e) }} toggle />
                </Form.Field>
                <Form.Field>
                  <label>Validation manuelle des avis ({consult.alternatives_validation ? "Validation manuelle activée" : "Validation automatique"})
                      <Popup
                      trigger={<Icon size="small" name="help" circular inverted />}
                      content="En activant la validation manuelle des avis, chaque avis devra être validé par vos soins avant d'être visible sur la consultation"
                    />
                  </label>
                  <Checkbox checked={consult.alternatives_validation} onClick={(e) => { this.toggleConsult('alternatives_validation', e) }} toggle />
                </Form.Field>
              </Form>
            </Grid.Column>
            : ''}

        </Grid.Column>
      </Grid>
    )
  }
}
