import {Meteor} from 'meteor/meteor'
import {Consults} from '../consults'

Meteor.publish('consults.all', function(){
  if(Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    return Consults.find({}, {limit: 1000, sort: {}})
  }
})

Meteor.publish('consults.visible', function(){
  return Consults.find({visible: true}, {limit: 1000, sort: {title: 1}})
})

Meteor.publish('consult', function(urlShorten){
  return Consults.find({url_shorten: urlShorten, visible: true}, {limit: 1, sort: {}})
})

Meteor.publish('consult.admin_by_shorten_url', function(urlShorten){
  return Consults.find({url_shorten: urlShorten}, {limit: 1000, sort: {}})
})

Meteor.publish('consults.landing', function(){
  return Consults.find({landing_display: true}, {limit: 1000, sort: {title: 1}})
})

Meteor.publish('consults.by_territory', function(territory_id){
  return Consults.find({territories: territory_id, visible: true}, {limit: 1000, sort: {title: 1}})
})

