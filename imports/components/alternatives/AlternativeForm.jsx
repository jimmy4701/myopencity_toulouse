import React, {Component} from 'react'
import TinyMCE from 'react-tinymce'
import {Grid, Header, Form, Input, Button, Icon, Checkbox} from 'semantic-ui-react'

export default class AlternativeForm extends Component{

  /*
    required props:
      - none

    facultative props:
      - alternative: Object (enable the edit mode)
      - onCreate: Function
      - onEdit: Function
  */

  state = {
    alternative: {}
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

  submit_form = (e) => {
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
    const {alternatives_anonymous_choice, consult_alternative_validation_term, alternative_term, buttons_validation_background_color, buttons_validation_text_color} = Session.get('global_configuration')

    return(
       <Grid stackable>
         <Grid.Column width={16}>
           <Form>
             <Form.Field required>
               <label>Titre</label>
               <Input value={alternative.title} type="text" onChange={(e) => {this.handleAlternativeChange('title', e)}} />
             </Form.Field>
             <Form.Field required>
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
               <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} positive onClick={this.submit_form}>{consult_alternative_validation_term}</Button>
             </Form.Field>
           </Form>
           <p style={{marginTop: "1em"}}><span style={{color: "red"}}>*</span> Champs obligatoires</p>
         </Grid.Column>
       </Grid>
    )
  }
}
