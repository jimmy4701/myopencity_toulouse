import {Mongo} from 'meteor/mongo'

export const BudgetBallots = new Mongo.Collection('budget_ballots')

const VoteSchema = new SimpleSchema({
    budget_proposition: {
        type: String
    },
    vote_count: {
        type: Number
    }
})

const BudgetBallotsSchema = new SimpleSchema({
    votes: {
        type: [VoteSchema]
    },
    budget_consult: {
        type: String
    }
})

BudgetBallots.attachSchema(BudgetBallotsSchema);