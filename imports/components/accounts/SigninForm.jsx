import React, {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {Form, Input, Button, Grid, Divider} from 'semantic-ui-react'

class SigninForm extends Component{

  /*
    required props:
      - none
    facultative props:
      - onSignin: Function
      - onSignupClick: Function
  */

  constructor(props){
    super(props)
    this.state = {}
  }

  handleChange(attr, e){
    let state = this.state
    state[attr] = e.target.value
    this.setState(state)
  }

  go(route, e){
    e.preventDefault()
    this.props.history.push(route)
    if(this.props.onSignupClick){
      this.props.onSignupClick()
    }
  }

  signin(e){
    e.preventDefault()
    Meteor.loginWithPassword(this.state.email, this.state.password, (error, result) => {
      if(error){
        console.log("Signin error", error)
        Bert.alert({
          title: "Erreur lors de la connexion",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        Bert.alert({
          title: "Vous êtes connecté",
          type: 'success',
          style: 'growl-bottom-left',
        })
        if(this.props.onSignin){
          this.props.onSignin(result)
        }
      }
    })
  }

  connect_facebook(e){
    e.preventDefault()
    Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, (error) => {
      if(error){
        console.log("Error during facebook login", error)
      }else{
        const return_route = Session.get('return_route')
        if(return_route){
          this.props.history.push(return_route)
        }else{
          this.props.history.push('/consults')
        }
      }
    })
  }

  connect_google(e){
    e.preventDefault()
    Meteor.loginWithGoogle({}, (error) => {
      if(error){
        console.log("Error during google login", error)
      }else{
        const return_route = Session.get('return_route')
        if(return_route){
          this.props.history.push(return_route)
        }else{
          this.props.history.push('/consults')
        }
      }
    })
  }

  render(){
    const {facebook_connected, google_connected, email_smtp_connected} = Meteor.isClient && Session.get('global_configuration')

    return(
       <Form onSubmit={(e) => {this.signin(e)}} className="center-align">
         <Form.Field>
           <label>Email</label>
           <Input type="email" onChange={(e) => {this.handleChange('email', e)}} />
         </Form.Field>
         <Form.Field>
           <label>Mot de passe</label>
           <Input type="password" onChange={(e) => {this.handleChange('password', e)}} />
         </Form.Field>
         <Button positive onClick={(e) => {this.signin(e)}}>Se connecter</Button>
         <Button onClick={(e) => {this.go('/sign_up', e)}}>Je n'ai pas encore de compte</Button>
         {facebook_connected || google_connected ?
           <Divider horizontal>OU</Divider>
         : ''}
         {facebook_connected ?
            <Button color="blue" icon="facebook" content="Se connecter avec Facebook" onClick={(e) => {this.connect_facebook(e)}}/>
         : ''}
         {google_connected ?
            <Button color="red" icon="google" content="Se connecter avec Google" onClick={(e) => {this.connect_google(e)}}/>
         : ''}
         {email_smtp_connected &&
          [
            <Divider/>,
            <a onClick={(e) => this.go('/forgot_password', e)} className="pointer">Mot de passe oublié ?</a>
          ]
        }
          
       </Form>
    )
  }
}

export default withRouter(SigninForm)
