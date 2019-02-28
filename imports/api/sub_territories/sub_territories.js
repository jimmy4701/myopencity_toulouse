import {Mongo} from 'meteor/mongo'

export const SubTerritories = new Mongo.Collection('sub_territories')

const SubTerritoriesSchema = new SimpleSchema({
    name: {
        type: String
    },
    active: {
        type: Boolean,
        defaultValue: true
    },
    coordinates: {
        type: String,
        optional: true
    },
    parent_territory: {
        type: String,
        optional: true
    },
    color: {
        type: String,
        optional: true
    },
    center_coordinates: {
        type: String,
        optional: true
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
        optional: true
    }
})

SubTerritories.attachSchema(SubTerritoriesSchema);