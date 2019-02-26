import {Meteor} from 'meteor/meteor'
import {BudgetPropositions} from '../budget_propositions'
import {BudgetConsults} from '/imports/api/budget_consults/budget_consults'

Meteor.methods({
'budget_propositions.insert'({budget_consult_id, budget_proposition}){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        const budget_consult = BudgetConsults.findOne({_id: budget_consult_id}, {fields: {_id: 1, propositions_max: 1}})
        const existing_propositions_count = BudgetPropositions.find({budget_consult: budget_consult_id, user: this.userId}, {fields: {_id: 1}}).count()
        if(existing_propositions_count >= budget_consult.propositions_max){
            throw new Meteor.Error("403", "Vous avez déjà proposé des idées sur cette consultation")
        }
        budget_proposition.user = this.userId
        budget_proposition.budget_consult = budget_consult_id
        budget_proposition.created_at = new Date()

        BudgetPropositions.insert(budget_proposition)
        return existing_propositions_count + 1 >= budget_consult.propositions_max
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