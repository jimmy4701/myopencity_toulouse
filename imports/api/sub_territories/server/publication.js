import {Meteor} from 'meteor/meteor'
import {SubTerritories} from '../sub_territories'

Meteor.publish('sub_territories.all', function(){
    if(!Roles.userIsInRole(this.userId, 'admin')){
        throw new Meteor.Error('403', 
)
    }else{
        return SubTerritories.find({}, {limit: 100000, sort: {}})
    }
})

Meteor.publish('sub_territories.by_ids', function(ids){
    return SubTerritories.find({_id: {$in: ids}}, {limit: 100000, sort: {}})
})