import {Meteor} from 'meteor/meteor'
import {BudgetPropositions} from '../budget_propositions'
import {BudgetConsults} from '/imports/api/budget_consults/budget_consults'


Meteor.methods({
'budget_propositions.insert'({budget_consult_id, budget_proposition}){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        const budget_consult = BudgetConsults.findOne({_id: budget_consult_id}, {fields: {_id: 1, propositions_max: 1, moderators_emails: 1}})
        const existing_propositions_count = BudgetPropositions.find({budget_consult: budget_consult_id, user: this.userId}, {fields: {_id: 1}}).count()
        if(existing_propositions_count >= budget_consult.propositions_max){
            throw new Meteor.Error("403", "Vous avez déjà proposé des idées sur cette consultation")
        }
        budget_proposition.user = this.userId
        budget_proposition.budget_consult = budget_consult_id
        budget_proposition.created_at = new Date()

        const new_proposition_id = BudgetPropositions.insert(budget_proposition)

        if(budget_consult.moderators_emails.length > 0){
            Meteor.call('mailing_service.budget_proposition_notification', new_proposition_id)
        }

        return existing_propositions_count + 1 >= budget_consult.propositions_max
    }
},
'budget_propositions.update'(budget_proposition){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        BudgetPropositions.update({_id: budget_proposition._id}, {$set: budget_proposition})
    }
},
'budget_propositions.remove'(budget_proposition_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        BudgetPropositions.remove({_id: budget_proposition_id})
    }
},
'budget_propositions.verify'(budget_proposition_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        const budget_proposition = BudgetPropositions.findOne({_id: budget_proposition_id})
        budget_proposition.status = budget_proposition.status.filter(o => o != 'not_verified')
        budget_proposition.status.push('verified')
        BudgetPropositions.update({_id: budget_proposition_id}, {$set: {status: budget_proposition.status}})
    }
},
'budget_propositions.validate'(budget_proposition_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        const budget_proposition = BudgetPropositions.findOne({_id: budget_proposition_id})
        let status = budget_proposition.status

        if(status.includes('validated')){
            throw new Meteor.Error("403", "La proposition est déjà validée")
        } else {
            status = status.filter(o => o != 'invalid')
            status = status.filter(o => o != 'not_verified')
            status.push('validated')            
            if(!status.includes('verified')) status.push('verified')
        }
        BudgetPropositions.update({_id: budget_proposition_id}, {$set: {status: status}})
    }
},
'budget_propositions.unvalidate'(budget_proposition_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        const budget_proposition = BudgetPropositions.findOne({_id: budget_proposition_id})
        let status = budget_proposition.status

        if(status.includes('invalid')){
            throw new Meteor.Error('403', "La proposition est déjà invalidée")
        }else{
            status = status.filter(o => o != 'validated')
            status.push('invalid')
            status = status.filter(o => o != 'not_verified')
            if(!status.includes('verified')) status.push('verified')
        }
        BudgetPropositions.update({_id: budget_proposition_id}, {$set: {status: status}})
    }
},
'budget_propositions.get_total_pages'(budget_consult_id){
    const total = BudgetPropositions.find({budget_consult: budget_consult_id, status: "validated"}).count()
    return total / 10
},
'budget_propositions.make_votable'(budget_proposition_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        const budget_proposition = BudgetPropositions.findOne({_id: budget_proposition_id})
        let status = budget_proposition.status
        if(!status.includes('votable')){
            status.push('votable')
        }else{
            throw new Meteor.Error('403', "La proposition est déjà votable")
        }
        BudgetPropositions.update({_id: budget_proposition_id}, {$set: {status: status}})
    }
},
'budget_propositions.remove_votable'(budget_proposition_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', "Vous n'êtes pas autorisé")
    }else{
        const budget_proposition = BudgetPropositions.findOne({_id: budget_proposition_id})
        let status = budget_proposition.status
        status = status.filter(o => o != 'votable')
        BudgetPropositions.update({_id: budget_proposition_id}, {$set: {status: status}})
    }
}
})