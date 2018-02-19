import { Meteor } from 'meteor/meteor'
import { Territories } from '../territories'

Meteor.publish('territories.all', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
        return Territories.find({}, {limit: 1000, sort: {name: 1}})
    }
})

Meteor.publish('territories.by_id', function (id) {
    return Territories.find({ _id: id }, {limit: 1000, sort: {name: 1}})
})

Meteor.publish('territories.by_ids', function (ids) {
    return Territories.find({ _id: {$in: ids} }, {limit: 1000, sort: {name: 1}})
})

Meteor.publish('territories.active', function() {
    return Territories.find({active: true}, {limit: 1000, sort: {name: 1}})
})

Meteor.publish('territories.by_shorten_url', function(shorten_url) {
    return Territories.find({shorten_url}, {limit: 1000, sort: {name: 1}})
})

Meteor.publish('territories.authorized_for_me', function() {
    const user = Meteor.user()
    if(Roles.userIsInRole(this.userId, 'admin')){
        return Territories.find({}, {limit: 1000, sort: {name: 1}})
    }else{
        return Territories.find({shorten_url: {$in: user.roles }}, {limit: 1000, sort: {}})
    }
})

