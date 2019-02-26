import {Mongo} from 'meteor/mongo'

export const BudgetPropositions = new Mongo.Collection('budget_propositions')

const BudgetPropositionsSchema = new SimpleSchema({
    title: {
        type: String
    },
    address: {
        type: String,
        optional: true
    },
    content: {
        type: String
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
    user: {
        type: String
    },
    budget_consult: {
        type: String
    }
})

BudgetPropositions.attachSchema(BudgetPropositionsSchema);