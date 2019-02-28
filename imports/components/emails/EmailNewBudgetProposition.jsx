import React, { Component } from 'react';
import {Configuration} from '/imports/api/configuration/configuration'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetProposi } from '/imports/api/alternatives/alternatives'

class EmailNewBudgetProposition extends Component {
    render() {
        const { username, url, configuration, loading, budget_proposition, budget_consult } = this.props

        if(!loading){
            return (
                <html>
                    <head>
                        <title>Nouvelle idée de budget participatif</title>
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
                                    <h2>Une nouvelle idée a été proposée sur le budget participatif "{budget_consult.title}"</h2>
                                    <p>Voici, ci-dessous, son contenu :</p><br/><br/>
                                    <div dangerouslySetInnerHTML={{__html: budget_proposition.content }} />
                                    <p>Pour valider ou invalider cette idée, merci de cliquer sur le lien ci-dessous.</p>
                                    <a href={url} style={{borderRadius: "5px", padding: "1em", color: "white", backgroundColor: "#345fff"}} target="_blank">Modérer les idées</a>
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

export default EmailNewBudgetPropositionContainer = withTracker((props) => {
    const configurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
    const loading = Meteor.isClient && !configurationPublication.ready()
    const configuration = Configuration.findOne({})
    return {
        loading,
        configuration
    }
})(EmailNewBudgetProposition)
