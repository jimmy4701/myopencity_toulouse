import {Meteor} from 'meteor/meteor'
import {BudgetPropositions} from '../budget_propositions'

Meteor.methods({
'budget_propositions.insert'(budget_proposition){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
    budget_proposition.user = this.userId
    BudgetPropositions.insert(budget_proposition)
    }
},
'budget_propositions.update'(budget_proposition){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        BudgetPropositions.update({_id: budget_proposition._id}, {$set: budget_proposition})
    }
},
'budget_propositions.remove'(budget_proposition_id){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        BudgetPropositions.remove({_id: budget_proposition_id})
    }
}
})