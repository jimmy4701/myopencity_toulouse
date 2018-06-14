import {Meteor} from 'meteor/meteor'
import {Consults} from '../consults'
import _ from 'lodash'
import {Random} from 'meteor/random'
import {ConsultParts} from '/imports/api/consult_parts/consult_parts'
import {ConsultPartVotes} from '/imports/api/consult_part_votes/consult_part_votes'
import {Alternatives} from '/imports/api/alternatives/alternatives'
import htmlToText from 'html-to-text'
import {Territories} from '/imports/api/territories/territories'

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
      const filtered_votes = _.uniqBy(votes, function(vote){ return vote.user })
      const voters_ids = filtered_votes.map(vote => vote.user)
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
        const home_territory = voter.profile.home_territories
        if(home_territory){
          if(statistics.territories.home_territories[home_territory]){
            statistics.territories.home_territories[home_territory]++
          }else{
            statistics.territories.home_territories[home_territory] = 1
          }
        }
        const work_territory = voter.profile.work_territories
        if(work_territory){
          if(statistics.territories.work_territories[work_territory]){
            statistics.territories.work_territories[work_territory]++
          }else{
            statistics.territories.work_territories[work_territory] = 1
          }
        }

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
      const ages_options = [
        {
          key: "18",
          value: "18",
          text: "Moins de 18 ans"
        },
        {
          key: "24",
          value: "24",
          text: "Entre 18 et 24 ans"
        },
        {
          key: "39",
          value: "39",
          text: "Entre 25 et 39 ans"
        },
        {
          key: "65",
          value: "65",
          text: "Entre 40 et 65 ans"
        },
        {
          key: "80",
          value: "80",
          text: "Plus de 65 ans"
        }
      ]

      const genders_options = [
        {
          key: "man",
          text: "Homme"
        },
        {
          key: "woman",
          text: "Femme"
        },
        {
          key: "other",
          text: "Autre"
        }
      ]

      let lines = []
      if(alternatives_cursor.count()){
        const alternatives = alternatives_cursor.fetch()
        lines = alternatives.map((alternative, index) => {
          const consult_part = ConsultParts.findOne({_id: alternative.consult_part})
          const author = Meteor.users.findOne({_id: alternative.user})
          const content = htmlToText.fromString(alternative.content, {
            wordwrap: null
          });
          const date = moment(alternative.created_at).format('DD.MM.YYY à HH:mm')
          const home_territory = Territories.findOne({_id: author.profile.home_territories})
          const work_territory = Territories.findOne({_id: author.profile.work_territories})
          return {
            avis: alternative.title,
            date_publication: date,
            soutiens: alternative.likes,
            auteur: author.username,
            email: author.emails[0].address,
            contenu: content, 
            valide: alternative.validated ? "ACCEPTÉ" : "REFUSÉ",
            verified: alternative.verified ? "VÉRIFIÉ" : "NON VÉRIFIÉ",
            partie_consultation: consult_part.title,
            profile_age: (author && author.profile.age) ? _.find(ages_options, o => o.key == author.profile.age).text : "Non renseigné",
            profile_genre: (author && author.profile.gender) ? _.find(genders_options, o => o.key == author.profile.gender).text : "Non renseigné",
            profile_quartier_habitation: home_territory ? home_territory.name : author.profile.home_territories == "outside" ? "Hors Toulouse" : "Non renseigné",
            profile_quartier_travail: work_territory ? work_territory.name : author.profile.home_territories == "outside" ? "Hors Toulouse" : "Non renseigné"
          }
        })
        return lines
      }else{
        throw new Meteor.Error('403', "Aucun produit trouvé")
      }
    }
  },
})
