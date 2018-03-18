import React, {Component} from 'react'
import TinyMCE from 'react-tinymce'
import {Grid, Header, Form, Input, Button, Icon} from 'semantic-ui-react'

export default class AlternativeForm extends Component{

  /*
    required props:
      - none

    facultative props:
      - alternative: Object (enable the edit mode)
      - onCreate: Function
      - onEdit: Function
  */

  constructor(props){
    super(props);
    this.state = {
      alternative: {
        anonymous: Session.get('global_configuration').alternatives_anonymous_default
      }
    }
  }

  componentWillMount(){
    if(this.props.alternative){
      this.setState({alternative: this.props.alternative})
    }
  }

  componentWillReceiveProps(new_props){
    if(new_props.alternative){
      this.setState({alternative: new_props.alternative})
    }
  }

  handleAlternativeChange(attr, e){
    let {alternative} = this.state
    alternative[attr] = e.target.value
    this.setState({alternative})
  }

  handleContentChange(e){
    let {alternative} = this.state
    alternative.content = e.target.getContent()
    this.setState({alternative})
  }

  isValid(){
    const {title, content} = this.state.alternative
    return title && content
  }

  toggleAlternative(attr, e){
    e.preventDefault()
    let {alternative} = this.state
    alternative[attr] = !alternative[attr]
    this.setState({alternative})
  }

  submit_form(e){
    e.preventDefault()
    const {alternative, onCreate, onEdit} = this.props
    if(alternative){
      onEdit(this.state.alternative)
    }else{
      onCreate(this.state.alternative)
    }
  }

  render(){

    const {alternative} = this.state
    const {alternatives_anonymous_choice, consult_alternative_validation_term, alternative_term} = Session.get('global_configuration')

    return(
       <Grid stackable>
         <Grid.Column width={16}>
           <Form>
             <Form.Field>
               <label>Titre</label>
               <Input value={alternative.title} type="text" onChange={(e) => {this.handleAlternativeChange('title', e)}} />
             </Form.Field>
             <Form.Field>
               <label>Votre {alternative_term}</label>
               <TinyMCE
                 content={alternative.content}
                 config={{
                   plugins: 'image',
                   toolbar: false,
                   menubar: false,
                   branding: false,
                   statusbar: false
                 }}
                 onChange={this.handleContentChange.bind(this)}
                />
             </Form.Field>
             <Form.Field>
               {alternatives_anonymous_choice ?
                 <Button onClick={(e) => {this.toggleAlternative('anonymous', e)}} icon="spy" content={alternative.anonymous ?
                     "Votre nom ne sera pas affiché"
                     : 'Votre nom sera affiché'} />
               : ''} 
               <Button disabled={!this.isValid()} positive onClick={(e) => {this.submit_form(e)}}>{consult_alternative_validation_term}</Button>
             </Form.Field>
           </Form>
         </Grid.Column>
       </Grid>
    )
  }
}
