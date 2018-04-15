import {Mongo} from 'meteor/mongo'

export const Configuration = new Mongo.Collection('configuration')

const ConfigurationSchema = new SimpleSchema({
  initial_configuration: {
    type: Boolean,
    defaultValue: true
  },
  fill_profile_explain: {
    type: String,
    defaultValue: "<p>En remplissant votre profil, vous permettez à votre ville de prendre de meilleures décisions.</p>"
  },
  seo_active: {
    type: Boolean,
    defaultValue: false
  },
  navbar_color: {
    type: String,
    defaultValue: "#1abc9c"
  },
  navbar_consults: {
    type: Boolean,
    defaultValue: true
  },
  navbar_projects: {
    type: Boolean,
    defaultValue: true
  },
  navbar_territories: {
    type: Boolean,
    defaultValue: true
  },
  navbar_participation: {
    type: Boolean,
    defaultValue: false
  },
  navbar_consults_term: {
    type: String,
    defaultValue: "Consultations"
  },
  navbar_projects_term: {
    type: String,
    defaultValue: "Propositions"
  },
  navbar_territories_term: {
    type: String,
    defaultValue: "Quartiers"
  },
  main_title: {
    type: String,
    defaultValue: "Ma ville",
    optional: true
  },
  main_description: {
    type: String,
    defaultValue: "Plateforme de démocratie",
    optional: true
  },
  landing_main_title: {
    type: String,
    defaultValue: "Votre espace",
    optional: true
  },
  landing_main_title_color: {
    type: String,
    defaultValue: "#FFFFFF"
  },
  landing_header_background_url: {
    type: String,
    defaultValue: "http://4vector.com/i/free-vector-modern-city_093317_bluecity.jpg"
  },
  landing_header_description: {
    type: String,
    defaultValue: "Participez activement à la démocratie locale",
    optional: true
  },
  landing_header_description_color: {
    type: String,
    defaultValue: "#FFFFFF"
  },
  landing_header_height: {
    type: String,
    defaultValue: "100%"
  },
  landing_header_min_height: {
    type: String,
    defaultValue: "100vh"
  },
  landing_consults_background_color: {
    type: String,
    defaultValue: '#FFFFFF'
  },
  landing_projects_background_color: {
    type: String,
    defaultValue: '#FFFFFF'
  },
  landing_explain_text: {
    type: String,
    defaultValue: "<h1>Myopencity est une plateforme de démocratie en ligne</h1><p>Sur Myopencity, les administrations (mairies / quartiers / départements...) peuvent consulter rapidement les citoyens, et chaque citoyen peut participer aux projets locaux du territoire, et proposer ses propres idées.</p>"
  },
  landing_explain_title: {
    type: String,
    defaultValue: "Qu'est-ce que c'est ?",
    optional: true
  },
  landing_explain_backtext: {
    type: String,
    defaultValue: "Myopencity",
    optional: true
  },
  consult_term: {
    type: String,
    defaultValue: "consultation"
  },
  consults_term: {
    type: String,
    defaultValue: "consultations"
  },
  consult_header_height: {
    type: String,
    defaultValue: '20em'
  },
  consult_header_color: {
    type: String,
    defaultValue: "#FFFFFF"
  },
  consult_description_background_color: {
    type: String,
    defaultValue: "#ecf0f1"
  },
  consult_description_color: {
    type: String,
    defaultValue: "#000000"
  },
  consult_description_font_size: {
    type: String,
    defaultValue: "1.2em"
  },
  consult_territory_icon: {
    type: String,
    defaultValue: "marker"
  },
  consult_territory_prefix: {
    type: String,
    defaultValue: "Consultation lancée sur"
  },
  consults_all_territories: {
    type: String,
    defaultValue: "Tous les quartiers"
  },
  consults_title: {
    type: String,
    defaultValue: "Consultations en cours"
  },
  ended_consults_title: {
    type: String,
    defaultValue: "Consultations terminées"
  },
  consults_no_consults: {
    type: String,
    defaultValue: "Aucune consultation en cours"
  },
  consult_yet_voted_term: {
    type: String,
    defaultValue: "Vous avez déjà voté"
  },
  consult_vote_button_term: {
    type: String,
    defaultValue: "Voter"
  },
  consult_alternative_button_term: {
    type: String,
    defaultValue: "Proposer une alternative"
  },
  consult_alternative_validation_term: {
    type: String,
    defaultValue: "Créer l'alternative"
  },
  alternative_like_icon_color: {
    type: String,
    defaultValue: "#3498db"
  },
  alternative_likes_term: {
    type: String,
    defaultValue: "soutiens"
  },
  alternative_term: {
    type: String,
    defaultValue: "alternative"
  },
  alternatives_term: {
    type: String,
    defaultValue: "alternatives"
  },
  alternative_descriptive_term: {
    type: String,
    defaultValue: "l'alternative"
  },
  project_territory_prefix: {
    type: String,
    defaultValue: "Projet proposé sur le quartier"
  },
  projects_page_header_title: {
    type: String,
    defaultValue: "Projets proposés"
  },
  project_header_height: {
    type: String,
    defaultValue: '20em'
  },
  project_header_color: {
    type: String,
    defaultValue: "#FFFFFF"
  },
  project_description_background_color: {
    type: String,
    defaultValue: "#ecf0f1"
  },
  project_description_color: {
    type: String,
    defaultValue: "#000000"
  },
  project_description_font_size: {
    type: String,
    defaultValue: "1.2em"
  },
  project_create_button_color: {
    type: String,
    optional: true
  },
  project_create_button_text: {
    type: String,
    defaultValue: "Proposer un projet"
  },
  no_projects: {
    type: String,
    defaultValue: "Aucun projet proposé pour l'instant"
  },
  project_term: {
    type: String,
    defaultValue: "proposition"
  },
  project_descriptive_term: {
    type: String,
    defaultValue: "une proposition"
  },
  amazon_connected: {
    type: Boolean,
    defaultValue: false
  },
  google_connected: {
    type: Boolean,
    defaultValue: false
  },
  facebook_connected: {
    type: Boolean,
    defaultValue: false
  },
  email_smtp_connected: {
    type: Boolean,
    defaultValue: false
  },
  projects_anonymous_choice: {
    type: Boolean,
    defaultValue: true
  },
  projects_anonymous_default: {
    type: Boolean,
    defaultValue: false
  },
  alternatives_anonymous_choice: {
    type: Boolean,
    defaultValue: true
  },
  alternatives_anonymous_default: {
    type: Boolean,
    defaultValue: false
  },
  alternatives_anonymous_profile_term: {
    type: String,
    defaultValue: "Quelqu'un"
  },
  global_image_url: {
    type: String,
    defaultValue: "/images/myopencity-logo.png"
  },
  global_logo_url: {
    type: String,
    defaultValue: "/images/myopencity-favicon.png"
  },
  footer_display: {
    type: Boolean,
    defaultValue: true
  },
  footer_height: {
    type: String,
    defaultValue: "10em"
  },
  footer_color: {
    type: String,
    defaultValue: 'white'
  },
  footer_background_color: {
    type: String,
    defaultValue: '#1abc9c'
  },
  footer_cgu_display: {
    type: Boolean,
    defaultValue: false
  },
  footer_about_display: {
    type: Boolean,
    defaultValue: false
  },
  footer_legal_notice_display: {
    type: Boolean,
    defaultValue: false
  },
  footer_content: {
    type: String,
    defaultValue: "Développé avec Myopencity, plateforme de Démocratie Open-Source"
  },
  cgu_term: {
    type: String,
    defaultValue: "Conditions d'utilisation"
  },
  about_term: {
    type: String,
    defaultValue: "Conditions d'utilisation"
  },
  about: {
    type: String,
    defaultValue: "<p>Cet Opencity a été développé et publié grâce à Myopencity, plateforme de démocratie Opensource, disponible sur myopencity.io</p>"
  },
  cgu: {
    type: String,
    defaultValue: "<p>Cet Opencity a été développé et publié grâce à Myopencity, plateforme de démocratie Opensource, disponible sur myopencity.io</p>"
  },
  cgu_acceptance: {
    type: Boolean,
    defaultValue: false
  },
  legal_notice_term: {
    type: String,
    defaultValue: "Mentions légales"
  },
  legal_notice: {
    type: String,
    defaultValue: "<p>Cet Opencity a été développé et publié grâce à Myopencity, plateforme de démocratie Opensource, disponible sur myopencity.io</p>",
    optional: true
  },
  legal_notice_acceptance: {
    type: Boolean,
    defaultValue: false
  },
  cnil_signup_text: {
    type: String,
    optional: true
  },
  participation_page_content: {
    type: String,
    defaultValue: "<p>Remplissez ici le contenu de la page de participation</p>"
  },
  navbar_participation_term: {
    type: String,
    defaultValue: "Participation"
  },
  territories_title: {
    type: String,
    defaultValue: "Quartiers"
  },
  buttons_validation_background_color: {
    type: String,
    defaultValue: "green"
  },
  buttons_validation_text_color: {
    type: String,
    defaultValue: "white"
  }
})

Configuration.attachSchema(ConfigurationSchema);
