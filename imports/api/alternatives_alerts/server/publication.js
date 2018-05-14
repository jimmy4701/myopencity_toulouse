import {Meteor} from 'meteor/meteor'
import {AlternativesAlerts} from '../alternatives_alerts'

Meteor.publish('alternatives_alerts.to_treat', function(){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
        throw new Meteor.Error('403', 
    )}
    return AlternativesAlerts.find({treated: false}, {limit: 100000, sort: {}})
})

Meteor.publish('alternatives_alerts.treated', function(){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
        throw new Meteor.Error('403', 
    )}
    return AlternativesAlerts.find({treated: true}, {limit: 100000, sort: {}})
})