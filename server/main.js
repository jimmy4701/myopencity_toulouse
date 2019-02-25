import { Meteor } from 'meteor/meteor'
import {Configuration} from '/imports/api/configuration/configuration'
import {Consults} from '/imports/api/consults/consults'
import moment from 'moment'
import {ExternalApisConfiguration} from '/imports/api/external_apis_configuration/external_apis_configuration'

import './server_imports'

Meteor.startup(() => {

  // Migrations
  Migrations.migrateTo('latest')


  // Initialization of global configuration singleton
  const configuration = Configuration.findOne({})
  if(!configuration){
    console.log("SERVER : Created global configuration singleton")
    Configuration.insert({})
  }
  const external_configuration = ExternalApisConfiguration.findOne({})
  if(!external_configuration){
    console.log("SERVER : Created external apis configuration singleton")
    ExternalApisConfiguration.insert({})
  }

  // Handle blocked user
  Accounts.validateLoginAttempt(function(attempt) {
    if(attempt.user && attempt.user.blocked) {
      attempt.allowed = false
      throw new Meteor.Error(500, "Votre compte a été désactivé, contactez un administrateur")
    }
    return true
  })
  

  // Handling external services login
  Accounts.onCreateUser(function (options, user) {

      if (user.services.facebook) {
          user.username = user.services.facebook.name
          user.emails = [{address: user.services.facebook.email}]
          // Handle avatar_url
          user.profile = {
            avatar_url: user.services.facebook.picture ? user.services.facebook.picture : '/images/avatar-logo.png'
          }
          return user
      }else if (user.services.google) {
          user.username = user.services.google.given_name
          user.emails = [{address: user.services.google.email}]
          // Handle avatar_url
          user.profile = {
            avatar_url: user.services.google.picture ? user.services.google.picture : '/images/avatar-logo.png'
          }
          return user
      }else{

        user.profile = {
          avatar_url: '/images/avatar-logo.png'
        }
        return user
      }
  })

  // SimpleSchema configuration
  SimpleSchema.messages({
    required: "[label] est requis",
    minString: "[label] doit comporter ai moins [min] caractères",
    maxString: "[label] ne peut pas dépasser [max] caractères",
    minNumber: "[label] doit être au moins [min]",
    maxNumber: "[label] ne peut pas dépasser [max]",
    minDate: "[label] doit être au moins [min]",
    maxDate: "[label] doit être après [max]",
    badDate: "[label] n'est pas une date valide",
    noDecimal: "[label] n'est pas un chiffre",
    notAllowed: "[value] n'est pas une valeur autorisée",
    expectedString: "[label] doit être une phrase",
    expectedNumber: "[label] doit être un nombre",
    expectedBoolean: "[label] doit être un booleen",
    expectedArray: "[label] doit être un tableau",
    expectedObject: "[label] doit être un objet",
    expectedConstructor: "[label] doit être un [type]",
    keyNotInSchema: "[key] n'est pas autorisé dans le schema"
  });

  // Launch synced cron for bots
  SyncedCron.config({
    log: false 
  })

  SyncedCron.add({
    name: "Consults automated launch",
    schedule: function(parser){
      return parser.text('at 12:01 am')
    },
    job: function(){
      // Launch consults which the launch date is past
      const today = moment().toISOString()
      const launch_consults = Consults.find({start_date: {$lte: new Date(today)}, visible: false, scheduler_off: false}).fetch()
      launch_consults.forEach(consult => {
        Consults.update({_id: consult._id}, {$set: {visible: true, votable: true}})
      })
      // Stop consults which the stop date is past
      const end_consults = Consults.find({end_date: {$lte: new Date(today)}, visible: true, scheduler_off: false}).fetch() 
      end_consults.forEach(consult => {
        Consults.update({_id: consult._id}, {$set: {visible: false, votable: false, ended: true, results_visible: true}})
      })
    }
  })

  SyncedCron.start();


})
