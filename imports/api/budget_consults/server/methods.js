import {Meteor} from 'meteor/meteor'
import {BudgetConsults} from '../budget_consults'

Meteor.methods({
'budget_consults.insert'(budget_consult){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
    budget_consult.user = this.userId
    BudgetConsults.insert(budget_consult)
    }
},
'budget_consults.update'(budget_consult){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        BudgetConsults.update({_id: budget_consult._id}, {$set: budget_consult})
    }
},
'budget_consults.remove'(budget_consult_id){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        BudgetConsults.remove({_id: budget_consult_id})
    }
}
})