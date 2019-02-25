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