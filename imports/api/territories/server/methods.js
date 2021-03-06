import { Meteor } from 'meteor/meteor'
import { Territories } from '../territories'
import _ from 'lodash'

const generate_url_shorten = (title) => {
    return _.kebabCase(title)
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
    },
    'territories.add_moderator'({email, territory_id}) {
        if (!Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        } else {
            const user = Meteor.users.findOne({'emails.address': email})
            Roles.addUsersToRoles(user._id, territory_id)
        }
    },
    'territories.remove_moderator'({user_id, territory_id}) {
        if (!Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('403', 'Vous devez vous connecter')
        } else {
            const territory = Territories.findOne({_id: territory_id})
            let user = Meteor.users.findOne({_id: user_id})
            user.roles.splice(user.roles.indexOf(territory_id), 1)
            Meteor.users.update({_id: user_id}, {$set: {roles: user.roles}})
        }
    },
    'territories.set_moderator'({territories_ids, user_id}){
        if(!Roles.userIsInRole(this.userId, 'admin')){
            throw new Meteor.Error('403', "Action interdite")
        }
        console.log('toggle moderator', territories_ids, user_id)
        const user = Meteor.users.findOne({_id: user_id})
        roles = territories_ids
        if(Roles.userIsInRole(user_id, 'admin')){
            roles.push('admin')
        }
        if(Roles.userIsInRole(user_id, 'moderator')){
            roles.push('moderator')
        }
        Meteor.users.update({_id: user_id}, {$set: {roles}})
    }
})