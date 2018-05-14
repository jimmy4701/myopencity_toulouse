import {Mongo} from 'meteor/mongo'

export const AlternativesAlerts = new Mongo.Collection('alternatives_alerts')

const AlternativesAlertsSchema = new SimpleSchema({
    alternative: {
        type: String
    },
    user: {
        type: String
    },
    alternative_consult: {
        type: String
    },
    created_at: {
        type: Date
    },
    treated: {
        type: Boolean,
        defaultValue: false
    }
})

AlternativesAlerts.attachSchema(AlternativesAlertsSchema);