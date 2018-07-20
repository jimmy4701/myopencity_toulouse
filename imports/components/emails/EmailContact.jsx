import React, { Component } from 'react';
import {Configuration} from '/imports/api/configuration/configuration'
import { createContainer } from 'meteor/react-meteor-data'
import { Alternatives } from '/imports/api/alternatives/alternatives'

export class EmailContact extends Component {
    render() {
        const { sender_email, message, configuration, loading, subject } = this.props

        if(!loading){
            return (
                <html>
                    <head>
                        <title>Message d'un citoyen</title>
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
                                    <h1>{subject}</h1>
                                    <h2>Message de contact envoyé par un citoyen</h2>
                                    <div dangerouslySetInnerHTML={{__html: message }} />
                                    <p>Pour répondre à ce contact, envoyez un email à {sender_email}</p>
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


export default EmailContactContainer = createContainer((props) => {
  const configurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const loading = Meteor.isClient && !configurationPublication.ready()
  const configuration = Configuration.findOne({})
  return {
    loading,
    configuration
  }
}, EmailContact)