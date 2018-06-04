import {Mongo} from 'meteor/mongo'

export const ApiAuthorizations = new Mongo.Collection('apiauthorizations')

const ApiAuthorizationsSchema = new SimpleSchema({
  name: {
    type: String,
    unique: true,
    label: "Le nom"
  },
  private_key: {
    type: String,
    label: "La clé privée"
  },
  url: {
    type: String,
    label: "L'url"
  },
  can_get_consults: {
    type: Boolean,
    defaultValue: true
  },
  can_post_votes: {
    type: Boolean,
    defaultValue: true
  }
})

ApiAuthorizations.attachSchema(ApiAuthorizationsSchema);
