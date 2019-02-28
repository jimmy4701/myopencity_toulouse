import {Meteor} from 'meteor/meteor'
import {BudgetPropositions} from '../budget_propositions'

Meteor.publish('budget_propositions.all', function(){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 
)
    }else{
        return BudgetPropositions.find({}, {limit: 100000, sort: {}})
    }
})