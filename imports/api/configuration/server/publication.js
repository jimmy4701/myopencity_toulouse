import {Meteor} from 'meteor/meteor'
import {Configuration} from '../configuration'

Meteor.publish('global_configuration', function(){
  return Configuration.find({}, {fields : {cgu: 0, legal_notice: 0}})
})

Meteor.publish('configuration.with_cgu', function(){
  return Configuration.find({}, {fields : {legal_notice: 0}})
})

Meteor.publish('configuration.with_legal_notice', function(){
  return Configuration.find({}, {fields : {cgu: 0}})
})

