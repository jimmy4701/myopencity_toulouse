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