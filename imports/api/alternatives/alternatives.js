import {Mongo} from 'meteor/mongo'

export const Alternatives = new Mongo.Collection('alternatives')

const AlternativeSchema = new SimpleSchema({
    title: {
      type: String,
      label: "Le titre"
    },
    content: {
      type: String,
      label: "Un contenu"
    },
    anonymous: {
      type: Boolean,
      defaultValue: true
    },
    user: {
      type: String
    },
    consult_part: {
      type: String
    },
    consult: {
      type: String
    },
    likes: {
      type: Number,
      defaultValue: 0
    },
    validated: {
      type: Boolean,
      defaultValue: true
    },
    verified: {
      type: Boolean,
      defaultValue: false
    },
    created_at: {
      type: Date,
      defaultValue: new Date()
    }
})

Alternatives.attachSchema(AlternativeSchema);
