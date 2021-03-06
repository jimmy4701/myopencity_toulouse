import {Mongo} from 'meteor/mongo'

export const BudgetPropositions = new Mongo.Collection('budget_propositions')

const DocumentSchema = new SimpleSchema({
    title: {
        type: String
    },
    url: {
        type: String
    }
})

const BudgetPropositionsSchema = new SimpleSchema({
    title: {
        type: String
    },
    address: {
        type: String,
        optional: true
    },
    coordinates: {
        type: Object,
        blackbox: true,
        optional: true
      },
    geolocation_address: {
        type: String,
        optional: true
    },
    user_type: {
        type: String,
        allowedValues: ['individual', 'collective', 'association'],
        defaultValue: 'individual'
    },
    user_age: {
        type: String,
        defaultValue: "adult",
        allowedValues: ['adult', 'minor']
    },
    documents: {
        type: [DocumentSchema],
        defaultValue: []
    },
    content: {
        type: String
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
        optional: true
    },
    user: {
        type: String
    },
    budget_consult: {
        type: String
    },
    validated: {
        type: Boolean,
        defaultValue: false
    },
    status: {
        type: [String],
        defaultValue: ['not_verified'] // not_verified, verified, validated, unvalidated, votable, voted
    },
    sub_territories: {
        type: [String],
        defaultValue: []
    },
    estimation: {
        type: Number,
        decimal: true,
        optional: true
    },
    votes_count: {
        type: Number,
        defaultValue: 0
    }
})

BudgetPropositions.attachSchema(BudgetPropositionsSchema);