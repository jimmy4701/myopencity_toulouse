import React, { Component } from 'react';
import {Configuration} from '/imports/api/configuration/configuration'
import { withTracker } from 'meteor/react-meteor-data'

export class EmailAccountValidation extends Component {
    render() {
        const { username, url, configuration, loading } = this.props

        if(!loading){
            return (
                <html>
                    <head>
                        <title>Validation de votre inscription</title>
                    </head>
                    <body style={{fontFamily: 'Arial'}}>
                        <table width="100%" cellpadding="0" cellspacing="0" align="center">
                            <tr style={{height: "20em !important"}}>
                                <td width="600" style={{backgroundColor: '#f7f3f3', textAlign: "center", padding: "2em 0"}}>
                                    <img src={configuration.global_image_url} style={{height: "10em"}}/>
                                    <h1 style={{fontSize: "3em"}}>{configuration.main_title}</h1>
                                </td>
                            </tr>
                            <tr style={{padding: "5em 0"}}>
                                <td width="600" height="300" style={{textAlign: "center"}}>
                                    <h2>Vous venez de vous inscrire à {configuration.main_title}, et nous vous en remercions !</h2>
                                    <p>Afin de valider votre inscription, vous devez cliquer sur le lien de validation ci-dessous :</p><br/><br/>
                                    <a href={url} style={{borderRadius: "5px", padding: "1em", color: "white", backgroundColor: "#345fff"}} target="_blank">Valider mon inscription</a>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>
            );
        }else{
            return <div></div>
        }
    }
}


export default EmailAccountValidationContainer = withTracker((props) => {
  const configurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const loading = Meteor.isClient && !configurationPublication.ready()
  const configuration = Configuration.findOne({})
  return {
    loading,
    configuration
  }
})(EmailAccountValidation)