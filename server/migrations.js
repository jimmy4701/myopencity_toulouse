import { Meteor } from 'meteor/meteor'
import { Consults } from '/imports/api/consults/consults'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { BudgetPropositions } from '/imports/api/budget_propositions/budget_propositions'
import { ConsultParts } from '/imports/api/consult_parts/consult_parts'
import { Configuration } from '/imports/api/configuration/configuration'
import { Territories } from '/imports/api/territories/territories'


Migrations.add({
  version: 15,
  name: "MIGRATION 15 : Add vote_counts to BudgetPropositions",
  up() {
    BudgetPropositions.update({}, {$set: {votes_count: 0}}, {multi: true})
  } 
})  
Migrations.add({
  version: 14,
  name: "MIGRATION 14 : Add voters array in budget consults",
  up() {
    BudgetConsults.update({}, {$set: {voters: []}}, {multi: true})
  } 
})  
 
Migrations.add({
  version: 13,
  name: "MIGRATION 13 : Add ended attribute to budget_consults",
  up() {
    BudgetConsults.update({}, {$set: {ended: false}}, {multi: true})
  } 
})  

Migrations.add({
  version: 12,
  name: "MIGRATION 12 : Add display votes configuration to consults",
  up() {
    Consults.update({}, {$set: {display_votes_configuration: "on_vote"}}, {multi: true})
  } 
}) 

Migrations.add({
  version: 11,
  name: "MIGRATION 11 : Add priority attribute to consult parts",
  up() {
    ConsultParts.update({}, {$set: {priority: 0}}, {multi: true})
  } 
}) 

Migrations.add({
  version: 10,
  name: "MIGRATION 10 : Add scheduler off attribute to consults",
  up() {
    Consults.update({}, {$set: {scheduler_off: false}}, {multi: true})
  } 
}) 

Migrations.add({
  version: 9,
  name: "MIGRATION 9 : Add moderators attribute to consults",
  up() {
    Consults.update({}, {$set: {moderators: []}}, {multi: true})
  } 
}) 

Migrations.add({
  version: 8,
  name: "MIGRATION 8 : Corrected territories roles on users",
  up() {
    Meteor.users.find({roles: {$exists: true}}).forEach(user => { 
      const roles = user.roles
      const new_roles = roles.map(role => {
        if(role == 'admin' || role == 'moderator'){
          return role
        }else{
          const territory = Territories.findOne({shorten_url: role})
          if(territory){
            return territory._id 
          } 
        }
      })
      Meteor.users.update({_id: user._id}, {$set: {roles: new_roles}})
    })
  }
}) 

Migrations.add({
  version: 7,
  name: "MIGRATION 7 : Activated projects_active on territories",
  up() {
    Territories.find({projects_active: {$exists: false}}).forEach(territory => { 
      Territories.update({_id: territory._id}, {$set: {projects_active: true}})
    })
  }
}) 

Migrations.add({
  version: 6,
  name: "MIGRATION 6 : Modifying consults to have multiple territories",
  up() {
    Consults.find({}).forEach(consult => { 
      const territory = consult.territory
      consult.territories = [territory]
      delete consult.territory
      Consults.update(consult._id, {$set: consult})
    })
  }
})

Migrations.add({
  version: 5,
  name: "MIGRATION 5 : Add new configuration fields",
  up() {
    Configuration.find({ main_description: { $exists: false } }).forEach(configuration => {
      Configuration.update(configuration._id, {
        $set: {
          main_description: "Plateforme de démocratie",
          navbar_consults: true,
          navbar_projects: true,
          ended_consults_title: "Consultations terminées",
          consults_title: "Consultations en cours",
          consults_no_consults: "Aucune consultation en cours",
          footer_display: true,
          footer_height: "10em",
          footer_color: "white",
          footer_background_color: '#1abc9c',
          footer_cgu_display: false,
          cgu_term: "Conditions d'utilisation",
          cgu: ""
        }
      })
    })
  } 
})

Migrations.add({
  version: 4,
  name: "MIGRATION 4 : Add logo and global image customization",
  up() {
    Configuration.find({ global_image_url: { $exists: false }, global_logo_url: { $exists: false } }).forEach(configuration => {
      Configuration.update(configuration._id, { $set: { global_image_url: "/images/myopencity-logo.png", global_logo_url: "/images/myopencity-favicon.png" } })
    })
  },
  down() {
    Configuration.update({}, { $unset: { global_image_url: true, global_logo_url: true } }, { multi: true })
  }
})

Migrations.add({
  version: 3,
  name: "MIGRATION 3 : Add configuration anonymous fields",
  up() {
    Configuration.find({ alternatives_anonymous_choice: { $exists: false } }).forEach(configuration => {
      Configuration.update(configuration._id, {
        $set: {
          projects_anonymous_choice: true,
          projects_anonymous_default: false,
          alternatives_anonymous_choice: true,
          alternatives_anonymous_default: false
        }
      })
    })
  },
  down() {
    Configuration.update({}, {
      $unset: {
        projects_anonymous_choice: true,
        projects_anonymous_default: true,
        alternatives_anonymous_choice: true,
        alternatives_anonymous_default: true
      }
    }, { multi: true })
  }
})

Migrations.add({
  version: 2,
  name: "MIGRATION 2 : Add blocked attribute to users",
  up() {
    Meteor.users.find({ blocked: { $exists: false } }).forEach(user => {
      Meteor.users.update(user._id, { $set: { blocked: false } })
    })
  },
  down() {
    Meteor.users.update({}, { $unset: { blocked: true } }, { multi: true })
  }
})

Migrations.add({
  version: 1,
  name: "MIGRATION 1 : Add attached_files attribute to Consults collection",
  up() {
    Consults.find({ attached_files: { $exists: false } }).forEach(consult => {
      Consults.update(consult._id, { $set: { attached_files: [] } })
    })
  },
  down() {
    Consults.update({}, { $unset: { attached_files: true } }, { multi: true })
  }
})
