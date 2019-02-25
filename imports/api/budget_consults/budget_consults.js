import {Mongo} from 'meteor/mongo'

export const BudgetConsults = new Mongo.Collection('budget_consults')

const BudgetConsultsSchema = new SimpleSchema({
    
})

BudgetConsults.attachSchema(BudgetConsultsSchema);