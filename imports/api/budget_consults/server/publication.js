import {Meteor} from 'meteor/meteor'
import {BudgetConsults} from '../budget_consults'

Meteor.publish('budget_consults.all', function(){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 
)
    }else{
        return BudgetConsults.find({}, {limit: 100000, sort: {}})
    }
})

Meteor.publish('budget_consults.by_id', function(id){
    if(Roles.userIsInRole(this.userId, 'admin')){
        return BudgetConsults.find({_id: id}, {limit: 1, sort: {}})
    }else{
        return BudgetConsults.find({_id: id, active: true}, {limit: 1, sort: {}})
    }
})

Meteor.publish('budget_consults.landing', function(){
    return BudgetConsults.find({active: true, landing_display: true}, {limit: 1, sort: {}, fields: {title: 1, url_shorten: 1, step: 1, active: 1, landing_display: 1, sub_territories: 1, image_url_mini: 1, image_url: 1}})
})

Meteor.publish('budget_consults.by_url_shorten', function(url_shorten){
    if(Roles.userIsInRole(this.userId, 'admin')){
        return BudgetConsults.find({url_shorten}, {limit: 1, sort: {}, fields: {voters: 0}})
    }else{
        return BudgetConsults.find({url_shorten, active: true, visible: true}, {limit: 1, sort: {}, fields: {voters: 0}})
    }
})

Meteor.publish('budget_consults.visible', function(){
    return BudgetConsults.find({visible: true, active: true}, {limit: 1000, sort: {}})
})

Meteor.publish('budget_consults.by_territory', function(territory_id){
    return BudgetConsults.find({visible: true, active: true, territories: territory_id}, {limit: 1000, sort: {}})
})