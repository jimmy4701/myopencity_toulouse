import React, {Component} from 'react'
import {Form, Input, Button, Divider, Checkbox, Header, Image, Icon} from 'semantic-ui-react'
import {Meteor} from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import {Configuration} from '/imports/api/configuration/configuration'
import {Link, withRouter} from 'react-router-dom'
import ReCAPTCHA from "react-google-recaptcha"
import styled from 'styled-components'
import { Territories } from '/imports/api/territories/territories'

export class SignupForm extends Component{

  /*
    required params:
  */

    state = {
      user: {},
      captcha: "",
      step: "account",
      profile: {}
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
    const {legal_notice_acceptance, cgu_acceptance} = this.props.global_configuration
    const {user, accept_conditions, accept_legal_notice} = this.state
    const isValid = user.email && user.password && user.username && user.password == user.confirm_password && (cgu_acceptance ? accept_conditions : true) && (legal_notice_acceptance ? accept_legal_notice : true)

    if(isValid){
        Meteor.call('user.signup', user, (error, result) => {
          if(error){
            console.log("signup error", error)
            const error_message = error.reason == "Username already exists." ? 
              "Le pseudonyme est déjà utilisé" 
              : error.reason == "Email already exists." ? "L'email est déjà utilisé" : error.reason
            Bert.alert({
              title: "Erreur lors de l'inscription",
              message: error_message,
              type: 'danger',
              style: 'growl-bottom-left',
            })
          }else{
            const {email, password} = user
            Meteor.loginWithPassword(email, password, () => {
              this.setState({step: "profile"})
            })
            
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
        this.setState({step: "profile"})
        Meteor.call('accounts.send_validation_email', (error, result) => {
          if(error){
            console.log('Erreur', error.message)
          }else{
            Bert.alert({
              title: "Un email de vérification a été envoyé à votre adresse email",
              message: "Merci de cliquer sur le lien qu'il contient pour activer votre compte",
              style: 'growl-bottom-left',
              type: 'success'
            })
          }
        })
      }
    })
  }

  connect_google(e){
    e.preventDefault()
    Meteor.loginWithGoogle({}, (error) => {
      if(error){
        console.log("Error during google login", error)
      }else{
        this.setState({step: "profile"})
        Meteor.call('accounts.send_validation_email', (error, result) => {
          if(error){
            console.log('Erreur', error.message)
          }else{
            Bert.alert({
              title: "Un email de vérification a été envoyé à votre adresse email",
              message: "Merci de cliquer sur le lien qu'il contient pour activer votre compte",
              style: 'growl-bottom-left',
              type: 'success'
            })
          }
        })
      }
    })
  }

  editProfile = (e) => {
    e.preventDefault()
    const {profile} = this.state
    if(!profile.home_territories || profile.home_territories.length <= 0){
      Bert.alert({
            title: "Vous devez renseigner un quartier d'habitation",
            style: 'growl-bottom-left',
            type: 'danger'
          })
    }else{
      Meteor.call('user.edit_profile', profile , (error, result) => {
        if(error){
          console.log('Erreur', error.message)
        }else{
          const return_route = Session.get('return_route')
          // if(return_route){
          //   this.props.history.push(return_route)
          // }else{
          //   this.props.history.push('/consults')
          // }
          // Bert.alert({
          //   title: 'Vous êtes maintenant inscrit',
          //   style: 'growl-bottom-left',
          //   type: 'success'
          // })
          this.setState({step: "validation"})
        }
      })
    }
  } 

  handleCaptcha = (captcha) => this.setState({captcha})

  handleHomeChange = (event, data) => {
    let {profile} = this.state
    profile.home_territories = data.value
    this.setState({profile})
  }

  handleWorkChange = (event, data) => {
    let {profile} = this.state
    profile.work_territories = data.value
    this.setState({profile})
  }

  handleInterestChange = (event, data) => {
    let {profile} = this.state
    profile.interest_territories = data.value
    this.setState({profile})
  }

  handleAge = (event, data) => {
    let {profile} = this.state
    profile.age = data.value
    this.setState({profile})
  }

  handleGender = (event, data) => {
    let {profile} = this.state
    profile.gender = data.value
    this.setState({profile})
  }

  validate = () => {
    const return_route = Session.get('return_route')
    if(return_route){
      this.props.history.push(return_route)
    }else{
      this.props.history.push('/consults')
    }
  }


  render(){
    const {user, accept_conditions, accept_legal_notice, error_message, step, profile} = this.state
    const {global_configuration, loading, className, territories} = this.props
    const {facebook_connected, google_connected, cgu_term, cgu_acceptance, legal_notice_term, legal_notice_acceptance, cnil_signup_text, navbar_color} = global_configuration
    const isValid = user.email && user.password && user.username && user.password == user.confirm_password && (cgu_acceptance ? accept_conditions : true) && (legal_notice_acceptance ? accept_legal_notice : true)

    if(!loading){

      const territories_options = territories.map(territory => {
        return {
          key: territory._id,
          value: territory._id,
          text: territory.name
        }
      })

      territories_options.push({
        key: "outside",
        value: "outside",
        text: "Hors Toulouse"
      })

      const age_options = [
        {
          key: "18",
          value: "18",
          text: "Moins de 18 ans"
        },
        {
          key: "24",
          value: "24",
          text: "Entre 18 et 24 ans"
        },
        {
          key: "39",
          value: "39",
          text: "Entre 25 et 39 ans"
        },
        {
          key: "65",
          value: "65",
          text: "Entre 40 et 65 ans"
        },
        {
          key: "80",
          value: "80",
          text: "Plus de 65 ans"
        }
      ]
        return(
          <Form className={className}>
            {step == "account" &&
              <div>
                <Header as="h1">Inscription <span style={{float: "right"}}>Étape 1/2</span></Header>
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
                      required
                      checked={accept_conditions}
                      onClick={() => this.toggleState('accept_conditions')}
                      label={<label for="accept_conditions"  >J'accepte les conditions de la <a href="/conditions" target="_blank">charte d'utilisation</a><span className="required-char"> *</span></label>}
                    />
                  </Form.Field>
                }
      
                {legal_notice_acceptance &&
                  <Form.Field>
                    <Checkbox
                      required
                      checked={accept_legal_notice}
                      onClick={() => this.toggleState('accept_legal_notice')}
                      label={<label for="accept_legal_notice"  >J'accepte les <a href="/mentions_legales" target="_blank">mentions légales</a><span className="required-char"> *</span></label>}
                    />
                  </Form.Field>
                }
                <Form.Field>
                  <ReCAPTCHA
                    ref="recaptcha"
                    sitekey="6Lf1g0wUAAAAAEvKqeT6sWNCvRgB4Cxbv2tqvhSo"
                    onChange={this.handleCaptcha}
                    size="invisible"
                    badge="inline"
                  />
                  </Form.Field>
                  <div className="submit-buttons">
                    <Button className="submit-button" style={{backgroundColor: navbar_color}} onClick={this.create_account}>Suivant ></Button>
                    {(error_message && !isValid) && <div><label>Les données du formulaire ne sont pas valides</label></div> }
                    <p style={{textAlign: "left"}}><span style={{color: "red"}}>*</span>Champs obligatoires</p>
                    {facebook_connected || google_connected ?
                      <Divider horizontal>OU</Divider>
                    : ''}
                    {facebook_connected ?
                      <Button color="blue" icon="facebook" content="Se connecter avec Facebook" onClick={(e) => {this.connect_facebook(e)}}/>
                    : ''}
                    {google_connected ?
                      <Button color="red" icon="google" content="Se connecter avec Google" onClick={(e) => {this.connect_google(e)}}/>
                    : ''}
                  </div>
              </div>
            }
            {step == "profile" &&
                <div>
                  <Header as="h1">Inscription <span style={{float: "right"}}>Étape 2/2</span></Header>
                  <Header as='h3'>Toulouse et Vous</Header>
                  <Header as='h4'>Aidez-nous à mieux vous connaître</Header>
                  <Form.Select
                    required
                    label='Dans quel quartier habitez-vous ?'
                    onChange={this.handleHomeChange}
                    value={profile.home_territories}
                    name='home_territories'
                    options={territories_options}
                  />
                  <Form.Select
                    label='Dans quel quartier travaillez-vous ?'
                    onChange={this.handleWorkChange}
                    value={profile.work_territories}
                    name='work_territories'
                    options={territories_options}
                  />
                  <Form.Select
                    label='Quels quartiers vous intéressent ?'
                    onChange={this.handleInterestChange}
                    value={profile.interest_territories}
                    name='interest_territories'
                    options={territories_options}
                    multiple
                  />
                  <Form.Group widths="equal">
                      <Form.Select
                        label="Votre âge"
                        options={age_options}
                        value={profile.age}
                        onChange={this.handleAge}
                        name="age"/>
                      <Form.Select
                        label="Votre genre"
                        options={[
                        {
                          key: "man",
                          value: "man",
                          text: "Un homme"
                        }, {
                          key: "woman",
                          value: "woman",
                          text: "Une femme"
                        }, {
                          key: "other",
                          value: "other",
                          text: "Autre"
                        }
                      ]}
                        value={profile.gender}
                        onChange={this.handleGender}
                        name="gender"/>
                  </Form.Group>
                  <div style={{textAlign: "center"}}>
                    <Button className="submit-button" style={{backgroundColor: navbar_color}} onClick={this.editProfile}>Finaliser mon inscription</Button>
                    <p style={{textAlign: "left"}}><span style={{color: "red"}}>*</span>Champs obligatoires</p>
                  </div>
                </div>
            }
            {cnil_signup_text && step != "validation" &&
              <div>
                <Divider />
                <div className="cnil-signup-text" dangerouslySetInnerHTML={{__html: cnil_signup_text }} />
              </div>
            }
            {step == "validation" &&
              <div width={16} className="validation-container" >
                <Icon name="envelope" className="animated fadeInUp" size="huge" />
                <Header className="animated fadeInDown" as='h2'>Un email de validation vous a été envoyé</Header>
                <Header className="animated fadeInDown" as='h3'>Cliquez sur le lien qu'il contient afin de pouvoir participer sur la plateforme</Header>
                <Button onClick={this.validate}>Revenir au site</Button>
              </div>
            }

            
          </Form>
        )

    }else{
      return <div></div>
    }
  }
}

export default SignupFormContainer = withTracker(() => {
  const globalConfigurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
  const loading = Meteor.isClient && (!globalConfigurationPublication.ready() || !territoriesPublication.ready())
  const global_configuration = Configuration.findOne({})
  const territories = Territories.find({active: true}).fetch()
  return {
    loading,
    global_configuration,
    territories
  }
})(withRouter(styled(SignupForm)`
  > div .submit-buttons{
    text-align: center;

    > .submit-button {
      padding: 1em 4em;
      color: white;
    }
  }
  > div .submit-button {
    padding: 1em 4em;
    color: white;
  }
  > .validation-container{
    text-align: center;
  }
`))
