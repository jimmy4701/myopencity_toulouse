import {Mongo} from 'meteor/mongo'

export const BudgetConsults = new Mongo.Collection('budget_consults')

const FilesSchema = new SimpleSchema({
    title: {
      type: String
    },
    url: {
      type: String
    }
})


const BudgetConsultsSchema = new SimpleSchema({
    author: {
        type: String
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
        optional: true
    },
    title: {
        type: String,
        label: "Le titre"
    },
    description: {
        type: String,
        label: "La description"
    },
    visible: {
        type: Boolean,
        defaultValue: false
    },
    step: {
        type: String,
        defaultValue: "propositions",
        allowedValues: ['propositions', 'votes', 'results']
    },
    image_url: {
        type: String,
        defaultValue: "https://image.freepik.com/free-vector/business-people-with-speech-bubbles_1325-25.jpg",
        label: "L'url de l'image"
    },
    image_url_mini: {
        type: String,
        defaultValue: "https://image.freepik.com/free-vector/business-people-with-speech-bubbles_1325-25.jpg",
        label: "L'url de l'image réduite"
    },
    url_shorten: {
        type: String,
        unique: true,
        label: "L'identifiant d'url"
    },
    landing_display: {
        type: Boolean,
        defaultValue: false
    },
    attached_files: {
        type: [FilesSchema],
        defaultValue: []
    },
    sub_territories: {
        type: [String],
        defaultValue: []
    }
})

BudgetConsults.attachSchema(BudgetConsultsSchema);