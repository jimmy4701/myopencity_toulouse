import {Meteor} from 'meteor/meteor'
import {BudgetConsults} from '../budget_consults'
import {BudgetPropositions} from '/imports/api/budget_propositions/budget_propositions'
import _ from 'lodash'

const generate_url_shorten = (title) => {
    return _.random(100,9999) + '-' + _.kebabCase(title)
}

Meteor.methods({
'budget_consults.insert'(budget_consult){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
    budget_consult.author = this.userId
    budget_consult.url_shorten = generate_url_shorten(budget_consult.title)
    budget_consult.created_at = new Date()
    BudgetConsults.insert(budget_consult)
}
},
'budget_consults.update'(budget_consult){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        budget_consult.updated_at = new Date()
        BudgetConsults.update({_id: budget_consult._id}, {$set: budget_consult})
    }
},
'budget_consults.toggle'({id, attribute}){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        const budget_consult = BudgetConsults.findOne({_id: id})
        if(attribute == 'landing_display' || attribute == 'active'){
            const query = {}
            query[attribute] = false
            BudgetConsults.update({_id: {$ne: id}}, {$set: query}, {multiple: true})
        }
        const final_query = {}
        final_query[attribute] = !budget_consult[attribute]
        BudgetConsults.update({_id: id}, {$set: final_query})
    }
},
'budget_consults.remove'(budget_consult_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        BudgetConsults.remove({_id: budget_consult_id})
    }
},
'budget_consults.has_proposed'(url_shorten){
    console.log(url_shorten)
    const budget_consult = BudgetConsults.findOne({url_shorten: url_shorten}, {fields: {_id: 1, url_shorten: 1, propositions_max: 1}})
    const propositions_count = BudgetPropositions.find({budget_consult: budget_consult._id, user: this.userId}).count()
    console.log(`propositions count ${propositions_count}, max: ${budget_consult.propositions_max}`)
    return propositions_count >= budget_consult.propositions_max
}
})