import { Meteor } from 'meteor/meteor'
import { Territories } from '../territories'

Meteor.publish('territories.all', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
        return Territories.find({}, {limit: 1000, sort: {}})
    }
})

Meteor.publish('territories.by_id', function (id) {
    if (Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
        return Territories.find({ _id: id }, {limit: 1000, sort: {}})
    }
})

Meteor.publish('territories.active', function() {
    return Territories.find({active: true}, {limit: 1000, sort: {}})
})

Meteor.publish('territories.by_shorten_url', function(shorten_url) {
    return Territories.find({shorten_url}, {limit: 1000, sort: {}})
})

Meteor.publish('territories.authorized_for_me', function() {
    const user = Meteor.user()
    if(Roles.userIsInRole(this.userId, 'admin')){
        return Territories.find({}, {limit: 1000, sort: {}})
    }else{
        return Territories.find({shorten_url: {$in: user.roles }}, {limit: 1000, sort: {}})
    }
})

