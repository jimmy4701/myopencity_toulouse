import { Meteor } from 'meteor/meteor'
import { Territories } from '../territories'

Meteor.publish('territories.all', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
        return Territories.find({})
    }
})

Meteor.publish('territories.by_id', function (id) {
    if (Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
        return Territories.find({ _id: id })
    }
})

