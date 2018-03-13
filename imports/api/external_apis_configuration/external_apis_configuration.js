import {Mongo} from 'meteor/mongo'

export const ExternalApisConfiguration = new Mongo.Collection('externalapisconfiguration')

const ExternalApisConfigurationSchema = new SimpleSchema({

  amazon_private_key: {
    type: String,
    optional: true
  },
  amazon_public_key: {
    type: String,
    optional: true
  },
  amazon_bucket_name: {
    type: String,
    optional: true
  },
  amazon_region: {
    type: String,
    optional: true
  },
  google_private_key: {
    type: String,
    optional: true
  },
  google_public_key: {
    type: String,
    optional: true
  },
  facebook_private_key: {
    type: String,
    optional: true
  },
  facebook_public_key: {
    type: String,
    optional: true
  },
  email_smtp_user: {
    type: String,
    optional: true
  },
  email_smtp_server: {
    type: String,
    optional: true
  },
  email_smtp_port: {
    type: Number,
    optional: true
  },
  email_smtp_password: {
    type: String,
    optional: true
  },
  email_smtp_from: {
    type: String,
    optional: true
  },
  email_smtp_from_domain: {
    type: String,
    optional: true
  }
})

ExternalApisConfiguration.attachSchema(ExternalApisConfigurationSchema);
