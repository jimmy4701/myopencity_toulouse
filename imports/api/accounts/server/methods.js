import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import _ from 'lodash'
const mailer = require('mailer')
import { ExternalApisConfiguration } from '/imports/api/external_apis_configuration/external_apis_configuration'
import EmailResetPassword from '/imports/components/emails/EmailResetPassword'
import React from "react"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import { Accounts } from 'meteor/accounts-base'
import { Projects } from '/imports/api/projects/projects'
import { Alternatives } from '/imports/api/alternatives/alternatives'
import { ProjectLikes } from '/imports/api/project_likes/project_likes'
import { ConsultPartVotes } from '/imports/api/consult_part_votes/consult_part_votes'
import { AlternativeLikes } from '/imports/api/alternative_likes/alternative_likes'
import moment from 'moment'

Meteor.methods({
  'user.signup'({ email, password, username }) {
    const user_id = Accounts.createUser({
      username: username,
      email: email,
      password: password,
      profile: {
        avatar_url: '/images/avatar-logo.png',
        display_fill_message: true,
        public_profile: true
      }
    })
    const token = Random.id()
    Meteor.users.update({_id: user_id}, {$set: {validation_token: token, token_generated_at: new Date()}})
    Meteor.call('mailing_service.validation_email', user_id)
  },
  'user.init_creation'({ email, password, username }) {
    const users = Meteor.users.find().fetch()
    if (!users || users.length == 0) {
      const user = Accounts.createUser({
        username: username,
        email: email,
        password: password,
        profile: {
          avatar_url: '/images/avatar-logo.png',
          display_fill_message: true,
          public_profile: true
        }
      })

      Roles.addUsersToRoles(user, 'admin')
    } else {
      throw new Meteor.Error('403', "Initial user account already exists")
    }
  },
  'user.edit_profile'(profile) {
    if (!this.userId) {
      throw new Meteor.Error('403', "Vous devez vous connecter")
    } else {
      Meteor.users.update({ _id: this.userId }, { $set: { profile: profile } })
    }
  },
  'users.toggle_blocked'(user_id) {
    if (!Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
      throw new Meteor.Error('403', "Vous devez être administrateur")
    } else {
      if (Roles.userIsInRole(user_id, ['admin'])) {
        throw new Meteor.Error('403', "Vous ne pouvez pas bloquer un administrateur")
      } else {
        let user = Meteor.users.findOne({ _id: user_id })
        user.blocked = !user.blocked
        Meteor.users.update({ _id: user_id }, user)
        if (user.blocked) {
          var sessions = _.filter(Meteor.default_server.sessions, function (session) {
            return session.userId == user._id
          })
          _.each(sessions, function (session) {
            session.connectionHandle.close()
          })
        }
      }
    }
  },
  'users.toggle_moderator'(user_id) {
    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('403', "Vous devez être administrateur")
    } else {
      if (Roles.userIsInRole(user_id, 'moderator')) {
        let user = Meteor.users.findOne({ _id: user_id })
        user.roles.splice(user.roles.indexOf('moderator'), 1)
        Meteor.users.update({ _id: user_id }, user)
      } else {
        Roles.addUsersToRoles(user_id, 'moderator')
      }
    }
  },
  'users.count'() {
    if (!Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
      throw new Meteor.Error('403', "Vous devez être administrateur ou modérateur")
    } else {
      return Meteor.users.find({ _id: { $ne: this.userId } }).count()
    }
  },
  'users.reset_password_email'(email) {
    const user = Meteor.users.findOne({ 'emails.address': email })
    const external_configuration = ExternalApisConfiguration.findOne()
    if (user) {

      // Generate reset password token
      const token = Random.id()
      Meteor.users.update({ _id: user._id }, {
        $set: {
          "services.password.reset": {
            token: token,
            email: email,
            when: new Date()
          }
        }
      })

      const resetPasswordUrl = external_configuration.email_smtp_from_domain + "/reset-password/" + token;
      const sheet = new ServerStyleSheet()

      const html = renderToString(
        sheet.collectStyles(
          <EmailResetPassword username={user.username} url={resetPasswordUrl} />
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
          subject: "Demande de nouveau mot de passe",
          html: html
        })
      } catch (error) {
        console.log("Error during send of email")
      }
      // Accounts.sendResetPasswordEmail(user, user.emails[0].address)
    } else {
      throw new Meteor.Error('403', "Aucun compte n'a été trouvé pour cette adresse email")
    }
  },
  'users.reset_password'({token, password, password_confirmation}) {
    if(password !== password_confirmation){
      throw new Meteor.Error('403', "Le mot de passe et sa confirmation sont différents")
    }else{
      const user = Meteor.users.findOne({"services.password.reset.token": token})
      if(user){
        Accounts.setPassword(user._id, password)
        Meteor.users.update({_id: user._id}, {$set: {
          "services.password.reset": {
            token: null,
            email: null,
            when: null
          }
        }})
      }else{
        throw new Meteor.Error('403', "Aucun utilisateur correspondant")
      }
    }
  },
  'users.profile_stats'(user_id){
    const user = Meteor.users.findOne({_id: user_id})
    if(user){
      const projects = Projects.find({author: user_id}).count()
      const votes = ConsultPartVotes.find({user: user_id}).count()
      const project_likes = ProjectLikes.find({user: user_id}).count()
      const alternatives = Alternatives.find({user: user_id}).count()
      return {projects, votes, project_likes, alternatives}
    }else{
      throw new Meteor.Error('403', "Utilisateur introuvable")
    }
  },
  'current_user.remove_account'(){
    if(!this.userId){
      throw new Meteor.Error('403', "Action impossible")
    }
    // Remove all participations
    ConsultPartVotes.remove({user: this.userId})
    Alternatives.remove({user: this.userId})
    AlternativeLikes.remove({user: this.userId})
    ProjectLikes.remove({user: this.userId})
    Projects.remove({author: this.userId})

    Meteor.users.remove({_id: this.userId})
    return true
  },
  'admin.toggle_alternative_moderator'(user_id){
    if(Roles.userIsInRole(this.userId, 'admin')){
      const user = Meteor.users.findOne({_id: user_id})
      if(user){
       if(Roles.userIsInRole(user_id, 'alternative_moderator')){
        const index = user.roles.indexOf('alternative_moderator')
        user.roles.splice(index, 1)
        Meteor.users.update({_id: user_id}, {$set: {roles: user.roles}})
       }else{
        Roles.addUsersToRoles(user_id, 'alternative_moderator')
       }
      }else{
        throw new Meteor.Error('500', "User not found")
      }
    }else{
      throw new Meteor.Error('403', "Action non autorisée")
    }
  },
  'admin.remove_account'(user_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('403', "Action non autorisée")
    }
    // Account verifications to avoid remove of admin or moderator
    if(Roles.userIsInRole(user_id, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "L'utilisateur est administrateur ou modérateur, merci de lui enlever ses droits avant de le supprimer")
    }
    // Remove associated content
    const alternatives = Alternatives.find({user: user_id})
    const alternatives_ids = alternatives.map(alternative => alternative._id)
    AlternativeLikes.remove({alternative: {$in: alternatives_ids}})
    const projects = Projects.find({user: user_id})
    const projects_likes_ids = projects.map(project => project._id)
    ProjectLikes.remove({project: {$in: projects_likes_ids}})
    Alternatives.remove({user: user_id})
    AlternativeLikes.remove({user: user_id})
    Projects.remove({user: user_id})
    ProjectLikes.remove({user: user_id})
    ConsultPartVotes.remove({user: user_id})
    Meteor.users.remove({_id: user_id})
  },
  'accounts.validate_token'(validation_token){
    const user = Meteor.users.findOne({validation_token})
    if(!user){
      throw new Meteor.Error("Le token de validation n'est pas valide. Aucun utilisateur correspondant")
    }
    let roles = user.roles
    if(!user.roles){
      roles = ['verified']
    }else if(Roles.userIsInRole(user._id, 'verified')){
      throw new Meteor.Error("Ce compte a déjà été validé")
    }else{
      roles.push('verified')
    }
    console.log('Account verification for ' + user.emails[0].address + ' : ' + roles)
    Meteor.users.update({_id: user._id}, {$set: {validation_token: null, 'emails.0.verified': true, roles }})
  },
  'accounts.send_validation_email'(){
    if(!this.userId){
      throw new Meteor.Error("Vous devez vous connecter")
    }
    if(Roles.userIsInRole(this.userId, 'verified')){
      throw new Meteor.Error("Votre compte a déjà été vérifié")
    }
    const user = Meteor.users.findOne({_id: this.userId})
    const validation_token = Random.id()
    let roles = user.roles
    if(roles){
      const verified_index = roles.indexOf('verified')
      roles.splice(verified_index, 1)
    }else{
      roles = []
    }
    Meteor.users.update({_id: this.userId}, {$set: {roles, validation_token, token_generated_at: new Date()}})
    Meteor.call('mailing_service.validation_email', this.userId)
  },
  'accounts.send_contact_message'({message, subject, email}){
    if(!message || !subject){
      throw new Meteor.Error('403', "Votre message ne comporte pas toutes les données nécessaires")
    }else{
      let sender_email = ""
      if(!this.userId){
        if(!email){
          throw new Meteor.Error('403', "Il manque une adresse email")
        }
        sender_email = email
      }else{
        const user = Meteor.users.findOne({_id: this.userId})
        sender_email = user.emails[0].address
      }
      Meteor.call('mailing_service.contact_email', {message, subject, sender_email})
    }
  },
  'admin.get_users_statistics'(){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous n'êtes pas modérateur")
    }else{
      const users = Meteor.users.aggregate([
        { $project: {
            creation_date: {$dateToString: { format: "%d.%m.%Y", date: "$createdAt" }}
          }
        },
        {
          $group: {
          _id: "$creation_date",
          count: {$sum: 1}
        }}
      ])
      return users
      
    }
  }
})
