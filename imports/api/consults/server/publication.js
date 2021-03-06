import {Meteor} from 'meteor/meteor'
import {Consults} from '../consults'

Meteor.publish('consults.all', function(){
  if(Roles.userIsInRole(this.userId, 'admin')){
    return Consults.find({}, {limit: 1000, sort: {}})
  }else if(Roles.userIsInRole(this.userId, 'moderator')){
    const user = Meteor.users.findOne({_id: this.userId})
    return Consults.find({territories: {$in: user.roles}})
  }
})

Meteor.publish('consults.visible', function(){
  return Consults.find({visible: true}, {limit: 1000, sort: {title: 1}})
})

Meteor.publish('consult', function(urlShorten){
  if(Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    return Consults.find({url_shorten: urlShorten}, {limit: 1, sort: {}})
  }else{
    return Consults.find({url_shorten: urlShorten, visible: true}, {limit: 1, sort: {}})
  }
})

Meteor.publish('consult.admin_by_shorten_url', function(urlShorten){
  return Consults.find({url_shorten: urlShorten}, {limit: 1000, sort: {}})
})

Meteor.publish('consults.landing', function(){
  return Consults.find({$or: [{landing_display: true}, {coordinates: {$exists: true}, map_display: true}], visible: true}, {fields: {content: 0}, limit: 1000, sort: {title: 1}})
})

Meteor.publish('consults.by_territory', function(territory_id){
  return Consults.find({territories: territory_id, visible: true}, {limit: 1000, sort: {title: 1}})
})

