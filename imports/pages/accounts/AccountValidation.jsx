import React, {Component} from 'react'
import { Grid, Loader, Header, Button, Icon } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

class AccountValidation extends Component {
    state = {
        account_validated: false,
        error: false
    }

    componentDidMount(){
        const {token} = this.props
        Meteor.call('accounts.validate_token', token , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                this.setState({account_validated: false, error: true})
            }else{
                Bert.alert({
                    title: 'Votre compte a bien été validé',
                    message: 'Vous pouvez maintenant utiliser pleinement la plateforme',
                    style: 'growl-bottom-left',
                    type: 'success'
                })
                this.setState({account_validated: true, error: false})
            }
        })
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
            this.setState({email_sent: true, error: false, account_validated: false})
          }
        })
      }

    render(){
        const {account_validated, error, email_sent} = this.state
        const {className} = this.props
        const {buttons_validation_background_color, buttons_validation_text_color} = Meteor.isClient && Session.get('global_configuration')

        return(
            <Grid className={className} stackable verticalAlign="middle">
                <Grid.Column width={16} >
                {!email_sent ?
                    !account_validated ?
                        !error ?
                            <Header as='h3'>Validation de votre compte en cours...<br/><Loader/></Header>
                        :
                            <div style={{textAlign: "center"}}>
                                <Header as='h3' className="animated fadeInUp">Nous n'avons pas pu vérifier votre compte</Header>
                                <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={this.send_validation_email} icon="envelope" content="Renvoyer l'email de validation"/>
                            </div>
                    :
                        <div style={{textAlign: "center"}}>
                            <Icon name="check" color="green" size="huge" className="animated fadeInUp"/>
                            <Header as='h2'>Votre compte a bien été validé</Header>
                            <Link className="animated fadeInDown" to="/consults">
                                <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} >Revenir aux consultations</Button>
                            </Link>
                        </div>
                :
                    <div style={{textAlign: "center"}}>
                        <Icon name="envelope" size="huge" className="animated fadeInUp"/>
                        <Header as="h3" className="animated fadeInDown">Un email de validation vous a été renvoyé</Header>
                    </div>
                }
                </Grid.Column>
            </Grid>
        )
    }
}

export default AccountValidationContainer = withTracker(({match}) => {
    const {token} = match.params
    return {
        token
    }
})(styled(AccountValidation)`
    height: 90vh;

    > div {
        display: flex !important;
        align-items: center;
        justify-content: center;
        
        >h3 .ui.loader{
            display: inline-block !important;
            margin-top: 2em;
        }
    }
`)