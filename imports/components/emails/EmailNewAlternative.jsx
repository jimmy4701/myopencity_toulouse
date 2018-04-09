import React, { Component } from 'react';
import {Configuration} from '/imports/api/configuration/configuration'
import { createContainer } from 'meteor/react-meteor-data'
import { Alternatives } from '/imports/api/alternatives/alternatives'

export class EmailResetPassword extends Component {
    render() {
        const { username, url, configuration, loading, alternative } = this.props

        if(!loading){
            return (
                <html>
                    <head>
                        <title>Nouvelle alternative</title>
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
                                    <h2>Une nouvelle alternative a été créée sur une consultation</h2>
                                    <p>Voici, ci-dessous, son contenu :</p><br/><br/>
                                    <div dangerouslySetInnerHTML={{__html: alternative.content }} />
                                    <p>Pour valider ou invalider cette alternative, merci de cliquer sur le lien ci-dessous.</p>
                                    <a href={url} style={{borderRadius: "5px", padding: "1em", color: "white", backgroundColor: "#345fff"}} target="_blank">Modérer les alternatives</a>
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


export default EmailResetPasswordContainer = createContainer((props) => {
  const configurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const loading = Meteor.isClient && !configurationPublication.ready()
  const configuration = Configuration.findOne({})
  return {
    loading,
    configuration
  }
}, EmailResetPassword)