import {Meteor} from 'meteor/meteor'
import {AlternativesAlerts} from '../alternatives_alerts'
import {Alternatives} from '/imports/api/alternatives/alternatives'

Meteor.methods({
'alternatives_alerts.insert'(alternative_id){
    if(!this.userId){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
    const existing_alert = AlternativesAlerts.findOne({user: this.userId, alternative: alternative_id})
    if(existing_alert){
        throw new Meteor.Error('403', "Vous avez déjà signalé cette alternative.")
    }
    const alternative = Alternatives.findOne({_id: alternative_id})
    if(!alternative){
        throw new Meteor.Error('403', "L'alternative spécifiée ne semble pas exister")
    }
    const alternative_alert = {
        user: this.userId,
        alternative: alternative_id,
        created_at: new Date(),
        alternative_consult: alternative.consult
    }
    AlternativesAlerts.insert(alternative_alert)
    }
},
'alternatives_alerts.remove'(alternative_alert_id){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
        throw new Meteor.Error('403', 'Vous devez vous connecter')
    }else{
        AlternativesAlerts.remove({_id: alternative_alert_id})
    }
}
})