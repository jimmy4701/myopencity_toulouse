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

const BudgetVotes = new SimpleSchema({
    user: {
        type: String
    },
    created_at: {
        type: Date
    }
})


const BudgetConsultsSchema = new SimpleSchema({
    author: {
        type: String
    },
    created_at: {
        type: Date
    },
    propositions_start_date: {
        type: Date,
        optional: true
    },
    propositions_end_date : {
        type: Date,
        optional: true
    },
    agora_start_date: {
        type: Date,
        optional: true
    },
    agora_end_date : {
        type: Date,
        optional: true
    },
    analysis_start_date: {
        type: Date,
        optional: true
    },
    analysis_end_date : {
        type: Date,
        optional: true
    },
    votes_start_date: {
        type: Date,
        optional: true
    },
    votes_end_date : {
        type: Date,
        optional: true
    },
    results_start_date: {
        type: Date,
        optional: true
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
        allowedValues: ['propositions', 'agora', 'analysis', 'votes', 'results']
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
    territories: {
        type: [String],
        defaultValue: []
    },
    sub_territories: {
        type: [String],
        defaultValue: []
    },
    propositions_active: {
        type: Boolean,
        defaultValue: true
    },
    propositions_content: {
        type: String,
        optional: true
    },
    propositions_max: {
        type: Number,
        defaultValue: 1
    },
    votes_content: {
        type: String,
        optional: true
    },
    results_content: {
        type: String,
        optional: true
    },
    propositions_step_name: {
        type: String,
        defaultValue: "Propositions"
    },
    agora_step_name: {
        type: String,
        defaultValue: "Agora"
    },
    agora_content: {
        type: String,
        optional: true
    },
    analysis_step_name: {
        type: String,
        defaultValue: "Analyse technique"
    },
    analysis_content: {
        type: String,
        optional: true
    },
    votes_step_name: {
        type: String,
        defaultValue: "Votes"
    },
    votes_modal_title: {
        type: String,
        defaultValue: "Votez pour vos projets préférés"
    },
    votes_modal_explain: {
        type: String,
        defaultValue: "Classez vos projets préférés par ordre de préférence"
    },
    results_step_name: {
        type: String,
        defaultValue: "Résultats"
    },
    available_votes: {
        type: Number,
        defaultValue: 6
    },
    active: {
        type: Boolean,
        defaultValue: false
    },
    ended: {
        type: Boolean,
        defaultValue: false
    },
    parental_link: {
        type: String,
        optional: true
    },
    parental_text: {
        type: String,
        optional: true
    },
    moderators_emails: {
        type: [String],
        defaultValue: []
    },
    voters: {
        type: [BudgetVotes],
        defaultValue: []
    }
})

BudgetConsults.attachSchema(BudgetConsultsSchema);