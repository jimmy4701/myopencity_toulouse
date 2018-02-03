import { Meteor } from 'meteor/meteor'
import { Territories } from '../territories'
import _ from 'lodash'

const generate_url_shorten = (title) => {
    return _.random(100,9999) + '-' + _.kebabCase(title)
  }

Meteor.methods({
    'territories.insert'(territory) {
        if (!Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        } else {
            territory.shorten_url = generate_url_shorten(territory.name)
            territory.created_at = new Date()
            Territories.insert(territory)
        }
    },
    'territories.update'(territory) {
        if (!Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        } else {
            const found_territory = Territories.findOne({ _id: territory._id })
            if (found_territory) {
                territory.updated_at = new Date()
                Territories.update({ _id: territory._id }, { $set: territory })
            }
        }
    },
    'territories.remove'(territory_id) {
        if (!Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        } else {
            Territories.remove({ _id: territory_id })
        }
    }
})