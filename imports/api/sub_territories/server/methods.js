import {Meteor} from 'meteor/meteor'
import {SubTerritories} from '../sub_territories'

Meteor.methods({
    'sub_territories.insert'(sub_territory){
        if(!Roles.userIsInRole(this.userId, 'admin')){
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        }else{
            sub_territory.user = this.userId
            sub_territory.created_at = new Date()
            SubTerritories.insert(sub_territory)
        }
    },
    'sub_territories.update'(sub_territory){
        if(!Roles.userIsInRole(this.userId, 'admin')){
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        }else{
            sub_territory.updated_at = new Date()
            SubTerritories.update({_id: sub_territory._id}, {$set: sub_territory})
        }
    },
    'sub_territories.remove'(sub_territory_id){
        if(!Roles.userIsInRole(this.userId, 'admin')){
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        }else{
            SubTerritories.remove({_id: sub_territory_id})
        }
    },
    'sub_territories.get_by_ids'({ids, fields}){
        return SubTerritories.find({_id: {$in: ids}, active: true}, {fields}).fetch()
    }
})