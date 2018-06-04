import {Mongo} from 'meteor/mongo'

export const Projects = new Mongo.Collection('projects')

const ProjectSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Le titre"
  },
  description: {
    type: String,
    optional: true
  },
  content: {
    type: String,
    label: "Le contenu"
  },
  author: {
    type: String
  },
  anonymous: {
    type: Boolean,
    defaultValue: true
  },
  likes: {
    type: Number,
    defaultValue: 0
  },
  visible: {
    type: Boolean,
    defaultValue: true
  },
  validated: {
    type: Boolean,
    defaultValue: true
  },
  image_url: {
    type: String,
    defaultValue: "https://image.freepik.com/free-vector/business-people-with-speech-bubbles_1325-25.jpg",
    label: "L'url de l'image"
  },
  shorten_url: {
    type: String,
    unique: true
  },
  blocked: {
    type: Boolean,
    defaultValue: false
  },
  created_at: {
    type: Date,
    defaultValue: new Date()
  },
  updated_at: {
    type: Date,
    defaultValue: new Date()
  },
  parent: {
    type: String, // id of parent project
    optional: true
  },
  landing_display: {
    type: Boolean,
    defaultValue: false
  },
  territory: {
    type: String,
    optional: true
  }
})

Projects.attachSchema(ProjectSchema);
