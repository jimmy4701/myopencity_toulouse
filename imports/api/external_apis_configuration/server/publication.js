import { Meteor } from 'meteor/meteor'
import { ExternalApisConfiguration } from '../external_apis_configuration'

Meteor.publish('external_apis_configuration.admin', function () {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return ExternalApisConfiguration.find({}, {
      fields: {
        google_public_key: 1,
        amazon_public_key: 1,
        facebook_public_key: 1,
        email_smtp_user: 1,
        email_smtp_server: 1,
        email_smtp_port: 1,
        email_smtp_from: 1,
        email_smtp_from_domain: 1
      }
    })
  }
})
