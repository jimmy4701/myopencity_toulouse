import {Meteor} from 'meteor/meteor'
import React from "react"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import EmailNewAlternative from '/imports/components/emails/EmailNewAlternative'
const mailer = require('mailer')
import { Alternatives } from '/imports/api/alternatives/alternatives'
import { ExternalApisConfiguration } from '/imports/api/external_apis_configuration/external_apis_configuration'

Meteor.methods({
'mailing_service.alternative_notification'(alternative_id){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        const external_configuration = ExternalApisConfiguration.findOne()
        const alternative = Alternatives.findOne({_id: alternative_id})
        console.log('MAIL SERVICE ALTERNATIVE', alternative)
        const users = Meteor.users.find({roles: 'alternative_moderator'}).fetch()

        // Send alternative notification
        const sheet = new ServerStyleSheet()

        const html = renderToString(
          sheet.collectStyles(
            <EmailNewAlternative  alternative={alternative} url={external_configuration.email_smtp_from_domain + "/admin/alternatives"} />
          )
        )

        users.map(user => {
            console.log('ENVOI ALTERNATIVE NOTIF', user.emails[0].address)
            try {
              mailer.send({
                host: external_configuration.email_smtp_server,
                port: external_configuration.email_smtp_port,
                domain: external_configuration.email_smtp_from_domain,
                authentication: "login",
                username: external_configuration.email_smtp_username,
                password: external_configuration.email_smtp_password,
                to: user.emails[0].address,
                from: external_configuration.email_smtp_from,
                subject: "Nouvelle alternative citoyenne",
                html: html
              })
            } catch (error) {
              console.log("Error during send of email", error)
            }
        })

    }
}
})