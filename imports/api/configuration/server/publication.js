import {Meteor} from 'meteor/meteor'
import {Configuration} from '../configuration'

Meteor.publish('global_configuration', function(){
  return Configuration.find({}, {fields : {cgu: 0, legal_notice: 0, about: 0}, limit: 1, sort: {}})
})

Meteor.publish('configuration.with_cgu', function(){
  return Configuration.find({}, {fields : {legal_notice: 0, about: 0}, limit: 1, sort: {}})
})

Meteor.publish('configuration.with_legal_notice', function(){
  return Configuration.find({}, {fields : {cgu: 0, about: 0}, limit: 1, sort: {}})
})

Meteor.publish('configuration.with_about', function(){
  return Configuration.find({}, {fields : {cgu: 0, legal_notice: 0}, limit: 1, sort: {}})
})

Meteor.publish('configuration.complete', function(){
  return Configuration.find({}, {limit: 1, sort: {}})
})

