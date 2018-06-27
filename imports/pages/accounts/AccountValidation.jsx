import React, {Component} from 'react'
import { Grid, Loader, Header } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data'
import styled from 'styled-components'

class AccountValidation extends Component {
    state = {
        account_validated: false
    }

    componentDidMount(){
        const {token} = this.props
        Meteor.call('accounts.validate_token', token , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
            }else{
                Bert.alert({
                    title: 'Votre compte a bien été validé',
                    message: 'Vous pouvez maintenant utiliser pleinement la plateforme',
                    style: 'growl-bottom-left',
                    type: 'success'
                })
                this.setState({account_validated: true})
            }
        })
    }

    render(){
        const {account_validated} = this.state
        const {className} = this.props

        return(
            <Grid className={className} stackable verticalAlign="middle">
                <Grid.Column width={16} >
                    {!account_validated ?
                            <Header as='h3'>Validation de votre compte en cours...<br/><Loader/></Header>
                    :
                        <Header as='h2'>Votre compte a bien été validé</Header>
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