import {Meteor} from 'meteor/meteor'
import {BudgetConsults} from '../budget_consults'
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
'budget_consults.remove'(budget_consult_id){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        BudgetConsults.remove({_id: budget_consult_id})
    }
}
})