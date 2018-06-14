import {Meteor} from 'meteor/meteor'
import {Alternatives} from '/imports/api/alternatives/alternatives'
import {AlternativesAlerts} from '/imports/api/alternatives_alerts/alternatives_alerts'

Meteor.publish('alternatives.all', function(){
  if(Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    return Alternatives.find({})
  }
})

Meteor.publish('alternatives.by_consult_part',function(consult_part_id){
  return Alternatives.find({validated: true, consult_part: consult_part_id})
})

Meteor.publish('alternatives.paginated_by_consult_part',function({consult_part_id, page, results_size, search_term}){
  const skip_entities = page*results_size
  return Alternatives.find({validated: true, consult_part: consult_part_id, content: {$regex: search_term}}, {limit: results_size, skip: skip_entities, sort: {likes: -1}})
})

Meteor.publishComposite('alternatives.user', function(alternative_id){
  return {
    find: function(){
      return Alternatives.find({_id: alternative_id})
    },
    children: [
      {
        find: function(alternative){
          if(alternative.anonymous){
            return null
          }else{
            return Meteor.users.find({_id: alternative.user}, {username: 1, profile: 1})
          }
        }
      }
    ]
  }
})

Meteor.publish('alternative', function(alternative_id){
  return Alternatives.find({_id: alternative_id, validated: true})
})

Meteor.publish('alternatives.unvalidated', function(){
  if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    throw new Meteor.Error('403', "Vous devez être administrateur")
  }else{
    return Alternatives.find({validated: false})
  }
});

Meteor.publish('alternatives.unverified', function(){
  if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    throw new Meteor.Error('403', "Vous devez être administrateur")
  }else{
    return Alternatives.find({verified: false})
  }
});

Meteor.publish('alternatives.verified', function(){
  if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    throw new Meteor.Error('403', "Vous devez être administrateur")
  }else{
    return Alternatives.find({verified: true})
  }
});

Meteor.publish('alternatives.by_ids', function(alternatives_ids){
  if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    throw new Meteor.Error('403', "Vous devez être administrateur")
  }else{
    return Alternatives.find({_id: {$in: alternatives_ids}})
  }
})

Meteor.publish('alternatives.search', function(search_text){
  if(!Roles.userIsInRole(this.userId, ['admin', 'moderator'])){
    throw new Meteor.Error('403', "Vous devez être administrateur")
  }else{
    return Alternatives.find({$or: [{content: {$regex: search_text, $options: 'i'}}, {title: {$regex: search_text, $options: 'i'}}]}, {sort: {}, limit: 10000})
  }
})