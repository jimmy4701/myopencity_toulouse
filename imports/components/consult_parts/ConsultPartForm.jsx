import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import TinyMCE from 'react-tinymce'
import {Grid, Form, Button, Input, Header, Checkbox, Label, Select} from 'semantic-ui-react'

export default class ConsultPartForm extends TrackerReact(Component){

  /*
    required props:
      - consult_id: String
    facultative props:
      - consult_part: Object (enable edit mode)
      - onCreateSubmit: Function (called when form is submitted)
      - onEditSubmit: Function (called when form is submitted)
  */

  state = {
      consult_part: {
        vote_values: [],
        priority: 0
      }
  }

  componentWillMount(){
    if(this.props.consult_part){
      this.setState({consult_part: this.props.consult_part})
    }
  }

  componentWillReceiveProps(new_props){
    if(new_props.consult_part){
      this.setState({consult_part: new_props.consult_part})
    }
  }

  handleContentChange(e){
    let {consult_part} = this.state
    consult_part.content = e.target.getContent()
    this.setState({consult_part})
  }

  handleConsultPartChange = (e) => {
    let {consult_part} = this.state
    consult_part[e.target.name] = e.target.value
    this.setState({consult_part})
  }

  submit_form(e){
    e.preventDefault()
    if(this.props.consult_part){
      this.props.onEditSubmit(this.state.consult_part)
    }else{
      this.setState({consult_part: {}})
      this.props.onCreateSubmit(this.state.consult_part)
    }
  }

  toggleConsultPart(attr, e){
    let {consult_part} = this.state
    consult_part[attr] = !consult_part[attr]
    this.setState({consult_part})
  }

  handleChange = (e) => this.setState({[e.target.name]: e.target.value})

  addVote(e){
    e.preventDefault()
    let {consult_part, editing_vote} = this.state
    consult_part.vote_values.push({vote_value: editing_vote})
    editing_vote = ""
    this.setState({consult_part, editing_vote})
  }

  removeVote(index, e){
    e.preventDefault()
    let {consult_part} = this.state
    consult_part.vote_values.splice(index, 1)
    this.setState({consult_part})
  }

  handleResultsFormatChange(event, data){
    let {consult_part} = this.state
    consult_part.results_format = data.value
    this.setState({consult_part})
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

  render(){
    const {consult_part, editing_vote} = this.state
    const results_formats = [
      {key: 'bar', value: 'bar', text: 'Graphique en barres'},
      {key: 'pie', value: 'pie', text: 'Graphique camembert'},
      {key: 'doughnut', value: 'doughnut', text: 'Graphique beignet'},
      {key: 'line', value: 'line', text: 'Graphique en lignes'},
      {key: 'radar', value: 'radar', text: 'Graphique radar'},
    ]
    const {consult_vote_button_term} = Meteor.isClient && Session.get('global_configuration')

    return(
       <Grid stackable>
         <Grid.Column width={16}>
             <Form>
               <Grid stackable>
                 <Grid.Column width={8}>
                   <Form.Field inline={true} as="div">
                     <Checkbox checked={consult_part.active} onClick={(e) => {this.toggleConsultPart('active', e)}}/>
                     <label>Visibilité ({consult_part.active ? "Actuellement visible" : "Actuellement caché"})</label>
                   </Form.Field>
                   <Form.Field inline={true} as="div">
                     <Checkbox checked={consult_part.votes_activated} onClick={(e) => {this.toggleConsultPart('votes_activated', e)}}/>
                     <label>Votes ({consult_part.votes_activated ? "Actuellement activé" : "Actuellement désactivé"})</label>
                   </Form.Field>
                   <Form.Field inline={true} as="div">
                     <Checkbox checked={consult_part.alternatives_activated} onClick={(e) => {this.toggleConsultPart('alternatives_activated', e)}}/>
                     <label>Avis ({consult_part.alternatives_activated ? "Actuellement activé" : "Actuellement désactivé"})</label>
                   </Form.Field>
                   <Form.Field inline={true} as="div">
                     <Checkbox checked={consult_part.display_alternatives} onClick={(e) => {this.toggleConsultPart('display_alternatives', e)}}/>
                     <label>Afficher les avis après fermeture ({consult_part.display_alternatives ? "Actuellement activé" : "Actuellement désactivé"})</label>
                   </Form.Field>
                 </Grid.Column>
                 {consult_part.votes_activated ?
                   <Grid.Column width={8}>
                     <Form>
                       <Form.Field as="div">
                         <label>Format des résultats</label>
                         <Select onChange={this.handleResultsFormatChange.bind(this)} value={consult_part.results_format} options={results_formats} />
                       </Form.Field>
                       <Form.Field>
                         <label>Texte du bouton de vote</label>
                         <Input value={consult_part.vote_label} placeholder="Voter" type="text" onChange={this.handleConsultPartChange} name="vote_label" />
                       </Form.Field>
                       <Form.Field as="div">
                         <label>Question de vote</label>
                         <Input fluid value={consult_part.question} placeholder="ex: Quel revêtement pour le rond-point ?" onChange={this.handleConsultPartChange} name="question"/>
                       </Form.Field>
                       <Form.Field>
                         <label>Valeur de vote</label>
                         <Input value={editing_vote} type="text" onChange={this.handleChange} name="editing_vote" />
                       </Form.Field>
                       <Form.Field>
                         <Button onClick={(e) => {this.addVote(e)}}>Ajouter</Button>
                       </Form.Field>
                     </Form>
                     <Header as="h3">Valeurs de vote</Header>
                     {consult_part.vote_values.map((vote_value, index) => {
                       return <Label style={{cursor: "pointer"}} content={vote_value.vote_value} icon='remove' onClick={(e) => {this.removeVote(index, e)}} />
                     })}
                   </Grid.Column>
                 : ''}
               </Grid>
                <Form.Field required as="div">
                   <label>Position</label>
                   <Input value={consult_part.priority} type="number" min={0} onChange={this.handleConsultPartChange} name="priority"/>
                 </Form.Field>
                 <Form.Field required as="div">
                   <label>Titre</label>
                   <Input value={consult_part.title} onChange={this.handleConsultPartChange} name="title"/>
                 </Form.Field>
                 <Form.Field required>
                  <label>Contenu</label>
                  <TinyMCE
                    content={consult_part.content}
                    config={{
                      plugins: 'image autoresize media code link paste',
                      paste_as_text: true,
                      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                      images_upload_handler: this.handleUploadImage
                    }}
                    onChange={this.handleContentChange.bind(this)}
                    />
                 </Form.Field>
               <Form.Field>
                 <Button positive onClick={(e) => {this.submit_form(e)}}>{this.props.consult_part ? 'Modifier' : 'Créer'}</Button>
               </Form.Field>
               <p><span style={{color: "red"}}>*</span> Champs obligatoires</p>
             </Form>

         </Grid.Column>
       </Grid>
    )
  }
}
