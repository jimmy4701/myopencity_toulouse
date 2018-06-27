import React, {Component} from 'react'
import { Modal, Button, Icon, Header } from 'semantic-ui-react'

export default class AccountValidationModal extends Component {
    state = {
        email_sent: false
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
            this.setState({email_sent: true})
          }
        })
      }

    render(){
        const {email_sent} = this.state
        const {open} = this.props
        const {navbar_color, buttons_validation_background_color, buttons_validation_text_color} = Meteor.isClient && Session.get('global_configuration')
        return(
            <Modal className="animated fadeInUp" size="tiny" {...this.props}>
                <Modal.Header style={{backgroundColor: navbar_color, color: 'white'}}>Votre adresse email n'est pas encore validée</Modal.Header>
                <Modal.Content>
                    {!email_sent ?
                        <Modal.Description style={{textAlign: "center"}}>
                            <p>Afin de participer sur la plateforme, vous devez valider votre adresse email en cliquant sur le lien qui vous a été envoyé à celle-ci.</p>
                            <p>Vous n'avez pas reçu l'email ? Vérifiez d'abord vos spams, ou cliquez sur le bouton ci-dessous pour recevoir un nouvel email de validation.</p>
                            <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={this.send_validation_email} icon="envelope" content="Renvoyer l'email de validation"/>
                        </Modal.Description>
                    :
                        <Modal.Description style={{textAlign: "center"}}>
                            <Icon name="envelope" size="huge" className="animated fadeInUp"/>
                            <Header as="h3" className="animated fadeInDown">Un email de validation vous a été renvoyé</Header>
                        </Modal.Description>
                    }
                </Modal.Content>
            </Modal>
        )
    }
}