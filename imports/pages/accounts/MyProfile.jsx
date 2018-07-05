import React, { Component } from 'react'
import { Grid, Image, Form, Input, Button, Header, Container, Divider } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data'
import EditProfileForm from '/imports/components/accounts/EditProfileForm'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

export class MyProfile extends Component {

  /*
    required props:
      - none
  */
  state = {

  }

  toggleState = (e) => this.setState({[e.target.name]: !this.state[e.target.name]})

  removeAccount = (e) => {
    this.props.history.push('/')
    Meteor.call('current_user.remove_account', (error, result) => {
      if(error){
        console.log('Error removing account', error.message)
        Bert.alert({
              title: "Erreur durant la suppression de votre compte",
              message: 'Merci de contacter un administrateur si le problème persiste',
              style: 'growl-bottom-left',
              type: 'error'
            })
      }else{
        Bert.alert({
          title: "Votre compte a bien été supprimé",
          style: 'growl-bottom-left',
          type: 'success'
        })
      }
    })
  }

  handleDescriptionChange(e) {
    let { user_profile } = this.state
    user_profile.description = e.target.getContent()
    this.setState({ user_profile })
  }

  handleProfileChange(attr, e) {
    let { user_profile } = this.state
    user_profile[attr] = e.target.value
    this.setState({ user_profile })
  }

  edit_profile(e) {
    e.preventDefault()
    const { user_profile } = this.state

    Meteor.call('user.edit_profile', user_profile, (error, result) => {
      if (error) {
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la modification de votre profil",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      } else {
        Bert.alert({
          title: "Votre profil a bien été modifié",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    });
  }

  send_validation_email = () => {
    Meteor.call('accounts.send_validation_email',(error, result) => {
      if(error){
        console.log('Erreur', error.message)
        Bert.alert({
          title: "L'email n'a pas été envoyé",
          message: error.message,
          style: 'growl-bottom-left',
          type: 'danger'
        })
      }else{
        Bert.alert({
          title: "Un email de validation vous a été renvoyé",
          message: "Merci de cliquer sur le lien qu'il contient pour valider votre compte",
          style: 'growl-bottom-left',
          type: 'success'
        })
      }
    })
  }

  render() {
    const { user, loading, className } = this.props
    const { removing } = this.state
    if (!loading) {
      return (
        <Grid stackable className={"main-container " + className} verticalAlign="middle">
          <Grid.Column width={16} className="wow fadeIn profile-form-container mobile-padding">
            <Container>
              <EditProfileForm />
              {Meteor.isClient && !Roles.userIsInRole(Meteor.userId(), 'verified') && [
                <Divider />,
                <Header as='h3'>Vérification de votre compte</Header>,
                <p>Votre adresse email n'a pas encore été vérifiée. Vous devez cliquer sur le lien dans l'email qui vous a été envoyé à votre inscription.<br/>
                Vous n'avez pas reçu cet email ? Nous pouvons vous le renvoyer.
                </p>,
                <Button onClick={this.send_validation_email}>Renvoyer l'email de validation</Button>
              ]
              }
              <Divider />
              <Header as='h3'>Suppression de compte</Header>
              <p>Vous pouvez supprimer votre compte à tout moment. La suppression de votre compte entraine la suppression intégrale
                immédiate et non réversible de tous les contenus que vous avez créés sur jeparticipe.toulouse.fr (soutiens, idées proposées, avis...).
              </p>
              {removing ?
                <div>
                  <Button onClick={this.removeAccount} color="red">Confirmer la suppression</Button>
                  <Button onClick={this.toggleState} name="removing">Annuler</Button>
                </div>
              :
                <Button onClick={this.toggleState} name="removing">Supprimer mon compte</Button>
            
              }
            </Container>
          </Grid.Column>
        </Grid>
      )
    } else {
      return <div></div>
    }
  }
}

export default MyProfileContainer = withTracker(() => {
  const user_id = Meteor.isClient ? Meteor.userId() : this.userId

  const currentUserPublication = Meteor.isClient && Meteor.subscribe('user.me')
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
  const loading = Meteor.isClient && (!territoriesPublication.ready() || !currentUserPublication.ready())
  const user = Meteor.users.findOne({ _id: user_id })
  return {
    loading,
    user
  }
})(withRouter(styled(MyProfile)`
  margin-top: 3em !important;
`))
