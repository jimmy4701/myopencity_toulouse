import {Meteor} from 'meteor/meteor'
import {Alternatives} from '../alternatives'
import {ConsultParts} from '/imports/api/consult_parts/consult_parts'
import {AlternativeLikes} from '/imports/api/alternative_likes/alternative_likes'
import {Consults} from '/imports/api/consults/consults'
import {Configuration} from '/imports/api/configuration/configuration'
import {AlternativesAlerts} from '/imports/api/alternatives_alerts/alternatives_alerts'

Meteor.methods({
  'alternatives.insert'({alternative, consult_part_id}){
    if(!this.userId){
      throw new Meteor.Error('403', "Vous devez vous connecter")
    }else if(!Roles.userIsInRole(this.userId, 'verified')){
      throw new Meteor.Error('403', "Vous devez d'abord valider votre adresse email")
    }else{
      const consult_part = ConsultParts.findOne({_id: consult_part_id})
      const consult = Consults.findOne({_id: consult_part.consult})
      const configuration = Configuration.findOne({})
      // if(!configuration.alternatives_anonymous_choice){
      //   alternative.anonymous = configuration.alternatives_anonymous_default
      // } 
      if(consult_part.alternatives_activated){
        alternative.user = this.userId
        alternative.consult_part = consult_part_id
        alternative.consult = consult_part.consult
        alternative.anonymous = false
        alternative.created_at = new Date()
        if(consult.alternatives_validation){
          alternative.validated = false
        }
        const alternative_id = Alternatives.insert(alternative)
        if(configuration.email_smtp_connected){
          Meteor.call('mailing_service.alternative_notification', alternative_id)
        }
      }else{
        throw new Meteor.Error('403', "Les alternatives sont désactivées sur cette partie")
      }
    }
  },
  'alternatives.update'(alternative){
    if(!this.userId){
      throw new Meteor.Error('403', "Vous devez vous connecter")
    }else{
      Alternatives.update({_id: alternative._id}, {$set: alternative})
    }
  },
  'alternatives.remove'(alternative_id){
    if(!this.userId){
      throw new Meteor.Error('403', "Vous devez vous connecter")
    }else{
      const alternative = Alternatives.findOne(alternative_id)
      if(alternative.user == this.userId || Roles.userIsInRole(this.userId, ['admin'])){
        AlternativesAlerts.remove({alternative: alternative_id})
        Alternatives.remove({_id: alternative_id})
      }else{
        throw new Meteor.Error('403', "Vous n'êtes pas le propriétaire de cette alternative")
      }
    }
  },
  'alternatives.toggle_like'(alternative_id){
    if(!this.userId){
      throw new Meteor.Error('403', "Vous devez vous connecter pour soutenir une alternative")
    }else{
      const alternative = Alternatives.findOne({_id: alternative_id})
      const alternative_like = AlternativeLikes.findOne({user: this.userId, alternative: alternative_id})
      if(!alternative_like){
        console.log("CREATION");

        Meteor.call('alternative_likes.insert', {user: this.userId, alternative: alternative_id})
        alternative.likes++
        Meteor.call('alternatives.update', alternative)
      }else{
        console.log("SUPPRESSION");
        AlternativeLikes.remove({user: this.userId, alternative: alternative_id})
        alternative.likes--
        Meteor.call('alternatives.update', alternative)
      }
    }
  },
  'alternatives.toggle_validity'(alternative_id){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous devez être administrateur")
    }else{
      let alternative = Alternatives.findOne({_id: alternative_id})
      alternative.validated = !alternative.validated
      Alternatives.update({_id: alternative_id}, {$set: alternative})
      AlternativesAlerts.remove({alternative: alternative._id})
    }
  },
  'alternatives.toggle_verified'(alternative_id){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous devez être administrateur")
    }else{
      let alternative = Alternatives.findOne({_id: alternative_id})
      alternative.verified = !alternative.verified
      Alternatives.update({_id: alternative_id}, {$set: alternative})
      AlternativesAlerts.remove({alternative: alternative._id})
    }
  },
  'alternatives.get_signaled'({page}){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous devez être administrateur")
    }
    let user_alerts = AlternativesAlerts.find({treated: false}, {sort: {created_at: -1}, limit: 10, skip: 10 * page}).fetch()
    const alternatives_ids = user_alerts.map(alert => alert.alternative)
    const alternatives = Alternatives.find({_id: {$in: alternatives_ids}}).fetch()
    const nb_results = alternatives.length
    const total_pages = nb_results / 10
    return {
      alternatives,
      total_pages,
      nb_results
    }
  },
  'alternatives.cancel_signalement'(alternative_id){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous devez être administrateur")
    }
    console.log('cancel signalement', alternative_id)
    AlternativesAlerts.update({alternative: alternative_id}, {$set: {treated: true}})
  }
})
