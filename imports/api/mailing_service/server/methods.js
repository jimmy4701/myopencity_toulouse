import {Meteor} from 'meteor/meteor'
import { Random } from 'meteor/random'
import React from "react"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import {
  EmailNewAlternative,
  EmailAccountValidation,
  EmailContact,
  EmailNewBudgetProposition
} from '/imports/components/emails'
const mailer = require('mailer')
import { Alternatives } from '/imports/api/alternatives/alternatives'
import { ExternalApisConfiguration } from '/imports/api/external_apis_configuration/external_apis_configuration'
import { Consults } from '/imports/api/consults/consults'
import { Territories } from '/imports/api/territories/territories'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { BudgetPropositions } from '/imports/api/budget_propositions/budget_propositions'

Meteor.methods({
'mailing_service.alternative_notification'(alternative_id){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        const external_configuration = ExternalApisConfiguration.findOne()
        const alternative = Alternatives.findOne({_id: alternative_id})
        const consult = Consults.findOne({_id: alternative.consult})
        const territories = Territories.find({_id: {$in: consult.territories }})
        territories_ids = territories.map(territory => territory._id)
        let users = []
        if(consult.moderators.length > 0){
          users = Meteor.users.find({_id: {$in: consult.moderators}}).fetch()
        }else{
          users = Meteor.users.find({$and: [{roles: 'alternative_moderator'}, {roles: {$in: territories_ids}}]}).fetch()
        }
        // Send alternative notification
        const sheet = new ServerStyleSheet()

        const html = renderToString(
          sheet.collectStyles(
            <EmailNewAlternative  alternative={alternative} url={external_configuration.email_smtp_from_domain + "/admin/alternatives"} />
          )
        )

        users.map(user => {
            
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
              }, (error, result) => {
                if(error){
                  console.log('--- MAIL SERVICE ERROR ---')
                  console.log(error)
                }else{
                  console.log('MAIL SERVICE : Alternative notification email sent to ', user.emails[0].address)
                }
              })
            } catch (error) {
              console.log("Error during send of email", error)
            }
        })

    }
},
'mailing_service.validation_email'(user_id){
    const user = Meteor.users.findOne({_id: user_id})
    const external_configuration = ExternalApisConfiguration.findOne()

    // Send validation email
    const sheet = new ServerStyleSheet()

    const html = renderToString(
      sheet.collectStyles(
        <EmailAccountValidation  username={user.username} url={external_configuration.email_smtp_from_domain + "/account_validation/" + user.validation_token} />
      )
    )

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
        subject: "Validation de votre compte",
        html: html
      })
    } catch (error) {
      console.log("Error during send of email", error)
    }
},
'mailing_service.contact_email'({subject, sender_email, message}){
  const external_configuration = ExternalApisConfiguration.findOne()

  // Send validation email
  const sheet = new ServerStyleSheet()

  const html = renderToString(
    sheet.collectStyles(
      <EmailContact message={message} subject={subject} sender_email={sender_email} />
    )
  )

  try {
    mailer.send({
      host: external_configuration.email_smtp_server,
      port: external_configuration.email_smtp_port,
      domain: external_configuration.email_smtp_from_domain,
      authentication: "login",
      username: external_configuration.email_smtp_username,
      password: external_configuration.email_smtp_password,
      to: "jeparticipe@mairie-toulouse.fr",
      from: external_configuration.email_smtp_from,
      subject: "Message d'un citoyen - " + subject,
      html: html
    })
  } catch (error) {
    console.log("Error during send of email", error)
  }
},
'mailing_service.budget_proposition_notification'(proposition_id){
  if(!this.userId){
      throw new Meteor.Error('403', 'Vous devez vous connecter')
  }else{

      const external_configuration = ExternalApisConfiguration.findOne({}, {fields: {email_smtp_from_domain: 1}})
      const budget_proposition = BudgetPropositions.findOne({_id: proposition_id}, {fields: {content: 1, budget_consult: 1}})
      const budget_consult = BudgetConsults.findOne({_id: budget_proposition.budget_consult}, {fields: {title: 1, moderators_emails: 1}})
      // Send alternative notification
      const sheet = new ServerStyleSheet()

      const html = renderToString(
        sheet.collectStyles(
          <EmailNewBudgetProposition  budget_consult={budget_consult} budget_proposition={budget_proposition} url={`${external_configuration.email_smtp_from_domain}/admin/budget_propositions/${budget_proposition.budget_consult}`} />
        )
      )

      budget_consult.moderators_emails.map(email => {
          
          try {
            mailer.send({
              host: external_configuration.email_smtp_server,
              port: external_configuration.email_smtp_port,
              domain: external_configuration.email_smtp_from_domain,
              authentication: "login",
              username: external_configuration.email_smtp_username,
              password: external_configuration.email_smtp_password,
              to: email,
              from: external_configuration.email_smtp_from,
              subject: "Nouvelle idée proposée pour le budget participatif",
              html: html
            }, (error, result) => {
              if(error){
                console.log('--- MAIL SERVICE ERROR ---')
                console.log(error)
              }else{
                console.log('MAIL SERVICE : Budget proposition email sent to ', email)
              }
            })
          } catch (error) {
            console.log("Error during send of email", error)
          }
      })

  }
},
})