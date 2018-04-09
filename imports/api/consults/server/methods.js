import {Meteor} from 'meteor/meteor'
import {Consults} from '../consults'
import _ from 'lodash'
import {Random} from 'meteor/random'
import {ConsultParts} from '/imports/api/consult_parts/consult_parts'
import {ConsultPartVotes} from '/imports/api/consult_part_votes/consult_part_votes'
import {Alternatives} from '/imports/api/alternatives/alternatives'
import htmlToText from 'html-to-text'

const generate_url_shorten = (title) => {
  return _.random(100,9999) + '-' + _.kebabCase(title)
}

Meteor.methods({
  'consults.insert'({consult, consult_parts}){
    if(!this.userId || !Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous devez être administrateur")
    }else{
      consult.author = this.userId
      consult.url_shorten = generate_url_shorten(consult.title)
      const new_consult_id = Consults.insert(consult)
      _.each(consult_parts, function(part){
        Meteor.call('consult_parts.insert', {consult_part: part, consult_id: new_consult_id })
      })
    }
  },
  'consults.update'({consult, consult_parts}){
    if(!this.userId || !Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous devez être administrateur")
    }else{
      consult.updated_at = new Date()
      const consult_id = consult._id
      Consults.update({_id: consult._id}, {$set: consult})
      _.each(consult_parts, (consult_part) => {
        if(consult_part._id){
          Meteor.call('consult_parts.update', {consult_part})
        }else{
          Meteor.call('consult_parts.insert', {consult_part: consult_part, consult_id: consult_id })
        }
      })
    }
  },
  'consults.remove'(consult_id){
    if(!this.userId || !Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous devez être administrateur")
    }else{
      ConsultParts.remove({consult: consult_id})
      ConsultPartVotes.remove({consult: consult_id})
      Alternatives.remove({consult: consult_id})
      Consults.remove({_id: consult_id})
    }
  },
  'consults.get_by_id'(consult_id){
    if(Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      return Consults.findOne({_id: consult_id})
    }
  },
  'consults.export_alternatives'(consult_id){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Not authorized")
    }else{
      const alternatives_cursor = Alternatives.find({consult: consult_id})
      let lines = []
      if(alternatives_cursor.count()){
        const alternatives = alternatives_cursor.fetch()
        lines = alternatives.map((alternative, index) => {
          const consult_part = ConsultParts.findOne({_id: alternative.consult_part})
          const author = Meteor.users.findOne({_id: alternative.user})
          const content = htmlToText.fromString(alternative.content, {
            wordwrap: null
          });
          return {alternative: alternative.title, author: author ? author.username : '', email: author.emails[0].address ? author.emails[0].address : '', content, consult_part: consult_part.title}
        })
        return lines
      }else{
        throw new Meteor.Error('403', "Aucun produit trouvé")
      }
    }
  },
})
