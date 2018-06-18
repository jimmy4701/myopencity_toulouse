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
        type: String,
        label: "Le nom"
    },
    reference: {
        type: String,
        optional: true,
        label: "La référence"
    },
    shorten_url: {
        type: String,
        label: "L'url courte"
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
    image_url_mini: {
        type: String,
        optional: true
    },
    created_at: {
        type: Date
    },
    color: {
        type: String,
        optional: true
    },
    center_coordinates: {
        type: String,
        optional: true
    },
    priority: {
        type: Number,
        defaultValue: 1
    },
    projects_active: {
        type: Boolean,
        defaultValue: true
    }
})
Territories.attachSchema(TerritoriesSchema);