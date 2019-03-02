import {Meteor} from 'meteor/meteor'
import {BudgetPropositions} from '../budget_propositions'

Meteor.publish('budget_propositions.all', function(){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        return BudgetPropositions.find({}, {limit: 100000, sort: {}})
    }
})

Meteor.publish('budget_propositions.by_status', function({budget_consult_id, status}){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        return BudgetPropositions.find({budget_consult: budget_consult_id, status}, {limit: 100000, sort: {}})
    }
})