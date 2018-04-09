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
  'consults.get_users_statistics'(consult_id){
    if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
      throw new Meteor.Error('403', "Vous ne pouvez pas faire cela")
    }else{
      const consult_parts = ConsultParts.find({consult: consult_id}).fetch()
      const consult_parts_ids = consult_parts.map(part => part._id)
      const votes = ConsultPartVotes.find({consult_part: {$in: consult_parts_ids}}).fetch()
      console.log('votes', votes)
      const filtered_votes = _.uniqBy(votes, function(vote){ return vote.user })
      const voters_ids = filtered_votes.map(vote => vote.user)
      console.log('voters ids', voters_ids)
      const voters = Meteor.users.find({_id: {$in: voters_ids}}).fetch()
      console.log('voters', voters)

      const statistics = {
        total_voters: voters_ids.length,
        ages: {
          '18': 0,
          '24': 0,
          '39': 0,
          '65': 0,
          '80': 0,
          'none': 0
        },
        genders: {
          'man': 0,
          'woman': 0,
          'other': 0,
          'none': 0
        },
        territories: {
          'home_territories': {},
          'work_territories': {},
          'interest_territories': {},
          'travel_territories': {}
        }
      }

      voters.map(voter => {
        // Age stat
        if(voter.profile.age){
          statistics.ages[voter.profile.age] += 1
        }else{
          statistics.ages['none'] += 1
        }
        //Gender stat
        if(voter.profile.gender){
          statistics.genders[voter.profile.gender] += 1
        }else{
          statistics.genders['none'] += 1
        }
        // Territories stat
        voter.profile.home_territories && voter.profile.home_territories.map(home => 
          {
            if(statistics.territories.home_territories[home]){
              statistics.territories.home_territories[home]++
            }else{
              statistics.territories.home_territories[home] = 1
            }

          }
        )
        voter.profile.work_territories && voter.profile.work_territories.map(work => 
          {
            if(statistics.territories.work_territories[work]){
              statistics.territories.work_territories[work]++
            }else{
              statistics.territories.work_territories[work] = 1
            }
          }
        )
        voter.profile.interest_territories && voter.profile.interest_territories.map(interest => 
          {
            if(statistics.territories.interest_territories[interest]){
              statistics.territories.interest_territories[interest]++
            }else{
              statistics.territories.interest_territories[interest] = 1
            }
          }
        )
        voter.profile.travel_territories && voter.profile.travel_territories.map(travel => 
          {
            if(statistics.territories.travel_territories[travel]){
              statistics.territories.travel_territories[travel]++
            }else{
              statistics.territories.travel_territories[travel] = 1
            }
          }
        )
      })

      console.log('STATISTICS', statistics)

      return statistics
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
