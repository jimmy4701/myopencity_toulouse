import React, {Component} from 'react'
import {Form, Input, Button, Divider, Checkbox} from 'semantic-ui-react'
import {Meteor} from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import {Configuration} from '/imports/api/configuration/configuration'
import {Link, withRouter} from 'react-router-dom'

export class SignupForm extends Component{

  /*
    required params:
  */

  constructor(props){
    super(props);
    this.state = {
      user: {}
    }
  }

  handleChange(attr, e){
    let user = this.state.user
    user[attr] = e.target.value
    this.setState({user: user})
  }

  toggleState = (attr) => {
    this.setState({[attr]: !this.state[attr]})
  }

  create_account = (e) => {
    e.preventDefault()
    const {cgu_acceptance} = this.props
    const {user, accept_conditions} = this.state
    const isValid = user.email && user.password && user.username && user.password == user.confirm_password && (cgu_acceptance ? accept_conditions : true)

    if(isValid){
        Meteor.call('user.signup', user, (error, result) => {
          if(error){
            console.log("signup error", error)
            Bert.alert({
              title: "Erreur lors de l'inscription",
              message: error.reason,
              type: 'danger',
              style: 'growl-bottom-left',
            })
          }else{
            const {email, password} = user
            Meteor.loginWithPassword(email, password)
            const return_route = Session.get('return_route')
            if(return_route){
              this.props.history.push(return_route)
            }else{
              this.props.history.push('/consults')
            }
            Bert.alert({
              title: "Votre compte a bien été créé",
              type: 'success',
              style: 'growl-bottom-left',
            })
          }
        })
    }else{
      this.setState({error_message: true})
    }
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
    const {user, accept_conditions, error_message} = this.state
    const {global_configuration, loading} = this.props
    const {facebook_connected, google_connected, cgu_term, cgu_acceptance, cnil_signup_text} = global_configuration
    const isValid = user.email && user.password && user.username && user.password == user.confirm_password && (cgu_acceptance ? accept_conditions : true)

    if(!loading){
      return(
        <Form>
          <Form.Field required>
            <label>Nom ou pseudo</label>
            <Input fluid type="text" onChange={(e) => {this.handleChange('username', e)}} />
          </Form.Field>
          <Form.Field required>
            <label>Votre adresse email</label>
            <Input fluid type="email" onChange={(e) => {this.handleChange('email', e)}} />
          </Form.Field>
          <Form.Field required>
            <label>Mot de passe</label>
            <Input fluid type="password" onChange={(e) => {this.handleChange('password', e)}} />
          </Form.Field>
          <Form.Field required>
            <label>Confirmez votre mot de passe</label>
            <Input fluid type="password" onChange={(e) => {this.handleChange('confirm_password', e)}} />
            {this.state.confirm_password && (this.state.password != this.state.confirm_password) ?
              <p>Le mot de passe et la confirmation ne sont pas identiques</p>
            : ''}
          </Form.Field>
          {cgu_acceptance &&
            <Form.Field>
              <Checkbox
                checked={accept_conditions}
                onClick={() => this.toggleState('accept_conditions')}
                label={<label for="accept_conditions"  >J'accepte les conditions de la <a href="/conditions" target="_blank">charte d'utilisation</a></label>}
              />
            </Form.Field>
          }
          <Button onClick={this.create_account}>M'inscrire</Button>
          {(error_message && !isValid) && <div><label>Les données du formulaire ne sont pas valides</label></div> }
          <p style={{fontSize: "0.7em"}}><span style={{color: "red"}}>*</span>Champs obligatoires</p>
          {facebook_connected || google_connected ?
            <Divider horizontal>OU</Divider>
          : ''}
          {facebook_connected ?
            <Button color="blue" icon="facebook" content="Se connecter avec Facebook" onClick={(e) => {this.connect_facebook(e)}}/>
          : ''}
          {google_connected ?
            <Button color="red" icon="google" content="Se connecter avec Google" onClick={(e) => {this.connect_google(e)}}/>
          : ''}
          {cnil_signup_text &&
            <div>
              <Divider />
              <div className="cnil-signup-text" dangerouslySetInnerHTML={{__html: cnil_signup_text }} />
            </div>
          }
        </Form>
      )
    }else{
      return <div></div>
    }
  }
}

export default SignupFormContainer = createContainer(() => {
  const globalConfigurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const loading = Meteor.isClient && !globalConfigurationPublication.ready()
  const global_configuration = Configuration.findOne({})
  return {
    loading,
    global_configuration
  }
}, withRouter(SignupForm))
