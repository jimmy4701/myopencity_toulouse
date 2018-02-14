import {Mongo} from 'meteor/mongo'

export const Territories = new Mongo.Collection('territories')

const TerritoryCoordinates = new SimpleSchema({
    lat: {
        type: String
    },
    lng: {
        type: String
    }
})
const TerritoriesSchema = new SimpleSchema({
    name: {
        type: String
    },
    shorten_url: {
        type: String
    },
    coordinates: {
        type: String,
        optional: true
    },
    active: {
        type: Boolean,
        defaultValue: false
    },
    description: {
        type: String,
        optional: true
    },
    official_user_name: {
        type: String,
        optional: true
    },
    official_user_description: {
        type: String,
        optional: true
    },
    image_url: {
        type: String,
        optional: true
    },
    created_at: {
        type: Date
    },
    color: {
        type: String,
        optional: true
    }
})
Territories.attachSchema(TerritoriesSchema);