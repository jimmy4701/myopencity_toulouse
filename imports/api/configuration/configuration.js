import {Mongo} from 'meteor/mongo'

export const Configuration = new Mongo.Collection('configuration')

const ConfigurationSchema = new SimpleSchema({
  initial_configuration: {
    type: Boolean,
    defaultValue: true
  },
  fill_profile_explain: {
    type: String,
    defaultValue: "<p>En remplissant votre profil, vous permettez à votre ville de prendre de meilleures décisions.</p>",
    label: "Le texte d'explication pour remplir le profil",
    optional: true
  },
  seo_active: {
    type: Boolean,
    defaultValue: false
  },
  navbar_color: {
    type: String,
    defaultValue: "#1abc9c",
    label: "La couleur de navbar"
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
    defaultValue: "Consultations",
    label: "Le terme pour les consultations dans la navbar"
  },
  navbar_projects_term: {
    type: String,
    defaultValue: "Propositions",
    label: "Le terme pour les propositions dans la navbar"
  },
  navbar_territories_term: {
    type: String,
    defaultValue: "Quartiers",
    label: "Le terme pour les quartiers dans la navbar"
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
    defaultValue: "#FFFFFF",
    label: "La couleur pour le titre principal"
  },
  landing_header_background_url: {
    type: String,
    defaultValue: "http://4vector.com/i/free-vector-modern-city_093317_bluecity.jpg",
    label: "L'url de l'image principale de la page d'accueil"
  },
  landing_header_description: {
    type: String,
    defaultValue: "Participez activement à la démocratie locale",
    optional: true
  },
  landing_header_description_color: {
    type: String,
    defaultValue: "#FFFFFF",
    label: "La couleur de la description de la page d'accueil"
  },
  landing_header_height: {
    type: String,
    defaultValue: "100%",
    label: "La hauteur pour le titre de la page d'accueil"
  },
  landing_header_min_height: {
    type: String,
    defaultValue: "100vh",
    label: "La hauteur minimale pour le titre de la page d'accueil"
  },
  landing_consults_background_color: {
    type: String,
    defaultValue: '#FFFFFF',
    label: "La couleur de fond pour les consultations de la page d'accueil"
  },
  landing_projects_background_color: {
    type: String,
    defaultValue: '#FFFFFF',
    label: "La couleur de fond pour les projets de la page d'accueil"
  },
  landing_explain_text: {
    type: String,
    defaultValue: "<h1>Myopencity est une plateforme de démocratie en ligne</h1><p>Sur Myopencity, les administrations (mairies / quartiers / départements...) peuvent consulter rapidement les citoyens, et chaque citoyen peut participer aux projets locaux du territoire, et proposer ses propres idées.</p>",
    label: "La description de la page d'accueil"
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
    defaultValue: "consultation",
    label: "Le terme pour consultation"
  },
  consults_term: {
    type: String,
    defaultValue: "consultations",
    label: "Le terme pour consultations"
  },
  consult_header_height: {
    type: String,
    defaultValue: '20em',
    label: "La hauteur pour le titre de consultation"
  },
  consult_header_color: {
    type: String,
    defaultValue: "#FFFFFF",
    label: "La couleur pour le titre de consultation"
  },
  consult_description_background_color: {
    type: String,
    defaultValue: "#ecf0f1",
    label: "La couleur de fond pour la description de consultation"
  },
  consult_description_color: {
    type: String,
    defaultValue: "#000000",
    label: "La couleur pour le texte de description de consultation"
  },
  consult_description_font_size: {
    type: String,
    defaultValue: "1.2em",
    label: "La taille de texte pour la description de consultation"
  },
  consult_territory_icon: {
    type: String,
    defaultValue: "marker",
    label: "Le type de marker pour une consultation sur la Google Map"
  },
  consult_territory_prefix: {
    type: String,
    defaultValue: "Consultation lancée sur",
    label: "Le préfixe pour les quartiers d'une consultation"
  },
  consults_all_territories: {
    type: String,
    defaultValue: "Tous les quartiers",
    label: "Le terme pour Tous les quartiers"
  },
  consults_title: {
    type: String,
    defaultValue: "Consultations en cours",
    optional: true
  },
  ended_consults_title: {
    type: String,
    defaultValue: "Consultations terminées",
    label: "Le terme pour les Consultations terminées"
  },
  consults_no_consults: {
    type: String,
    defaultValue: "Aucune consultation en cours",
    label: "Le terme pour Aucune consultation"
  },
  consult_yet_voted_term: {
    type: String,
    defaultValue: "Vous avez déjà voté",
    label: "Le terme pour Vous avez déjà voté"
  },
  consult_vote_button_term: {
    type: String,
    defaultValue: "Voter",
    label: "Le terme pour le bouton Voter d'une consultation"
  },
  consult_alternative_button_term: {
    type: String,
    defaultValue: "Proposer une alternative",
    label: "Le terme pour Proposer une alternative"
  },
  consult_alternative_validation_term: {
    type: String,
    defaultValue: "Créer l'alternative",
    label: "Le terme pour Créer une alternative"
  },
  alternative_like_icon_color: {
    type: String,
    defaultValue: "#3498db",
    label: "La couleur du bouton de soutien d'alternative"
  },
  alternative_likes_term: {
    type: String,
    defaultValue: "soutiens",
    label: "Le terme pour Soutiens d'alternative"
  },
  alternative_term: {
    type: String,
    defaultValue: "alternative",
    label: "Le terme pour Alternative"
  },
  alternatives_term: {
    type: String,
    defaultValue: "alternatives",
    label: "Le terme pour Alternatives"
  },
  alternative_descriptive_term: {
    type: String,
    defaultValue: "l'alternative",
    label: "Le terme description pour Alternative"
  },
  project_territory_prefix: {
    type: String,
    defaultValue: "Projet proposé sur le quartier",
    label: "Le préfixe pour Projet proposé sur le quartier"
  },
  projects_page_header_title: {
    type: String,
    defaultValue: "Projets proposés",
    label: "Le terme pour Projets proposés"
  },
  project_header_height: {
    type: String,
    defaultValue: '20em',
    label: "La taille du titre de projet"
  },
  project_header_color: {
    type: String,
    defaultValue: "#FFFFFF",
    label: "La couleur pour le titre de projet"
  },
  project_description_background_color: {
    type: String,
    defaultValue: "#ecf0f1",
    label: "La couleur de fond pour une description de projet"
  },
  project_description_color: {
    type: String,
    defaultValue: "#000000",
    label: "La couleur de texte pour une description de projet"
  },
  project_description_font_size: {
    type: String,
    defaultValue: "1.2em",
    label: "La taille de police pour une description de projet"
  },
  project_create_button_color: {
    type: String,
    optional: true
  },
  project_create_button_text: {
    type: String,
    defaultValue: "Proposer un projet",
    label: "Le terme pour Proposer un projet"
  },
  no_projects: {
    type: String,
    defaultValue: "Aucun projet proposé pour l'instant",
    label: "Le terme pour Aucun projet"
  },
  project_term: {
    type: String,
    defaultValue: "proposition",
    label: "Le terme pour Proposition"
  },
  project_descriptive_term: {
    type: String,
    defaultValue: "une proposition",
    label: "Le terme pour Une proposition"
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
    defaultValue: "Quelqu'un",
    label: "Le terme pour un auteur d'alternative anonyme"
  },
  global_image_url: {
    type: String,
    defaultValue: "/images/myopencity-logo.png",
    label: "L'url d'image globale"
  },
  global_logo_url: {
    type: String,
    defaultValue: "/images/myopencity-favicon.png",
    label: "L'url pour le logo général"
  },
  footer_display: {
    type: Boolean,
    defaultValue: true
  },
  footer_height: {
    type: String,
    defaultValue: "10em",
    label: "La taille du footer"
  },
  footer_color: {
    type: String,
    defaultValue: 'white',
    label: "La couleur de texte du footer"
  },
  footer_background_color: {
    type: String,
    defaultValue: '#1abc9c',
    label: "La couleur de fond du footer"
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
    defaultValue: "Développé avec Myopencity, plateforme de Démocratie Open-Source",
    label: "Le texte du footer"
  },
  cgu_term: {
    type: String,
    defaultValue: "Conditions d'utilisation",
    label: "Le terme pour les Conditions générales d'utilisation"
  },
  about_term: {
    type: String,
    defaultValue: "Conditions d'utilisation",
    label: "Le terme pour la page à propos"
  },
  about: {
    type: String,
    defaultValue: "<p>Cet Opencity a été développé et publié grâce à Myopencity, plateforme de démocratie Opensource, disponible sur myopencity.io</p>",
    label: "Le contenu de la page à propos"
  },
  cgu: {
    type: String,
    defaultValue: "<p>Cet Opencity a été développé et publié grâce à Myopencity, plateforme de démocratie Opensource, disponible sur myopencity.io</p>",
    label: "Le contenu pour la page de CGU"
  },
  cgu_acceptance: {
    type: Boolean,
    defaultValue: false
  },
  legal_notice_term: {
    type: String,
    defaultValue: "Mentions légales",
    label: "Le terme pour Mentions légales"
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
    defaultValue: "<p>Remplissez ici le contenu de la page de participation</p>",
    label: "Le contenu de page Participation citoyenne"
  },
  navbar_home_term: {
    type: String,
    defaultValue: "Accueil",
    label: "Le terme pour Accueil dans la barre de navigation"
  },
  navbar_participation_term: {
    type: String,
    defaultValue: "Participation",
    label: "Le terme pour Participation dans la barre de navigation"
  },
  territories_title: {
    type: String,
    defaultValue: "Quartiers",
    label: "Le terme pour Quartiers"
  },
  buttons_validation_background_color: {
    type: String,
    defaultValue: "green",
    label: "La couleur des boutons de validation"
  },
  buttons_validation_text_color: {
    type: String,
    defaultValue: "white",
    label: "La couleur de texte pour les boutons de validation"
  },
  consults_explain: {
    type: String,
    defaultValue: "<p>Les consultations vous sont proposées afin de connaitre votre avis de citoyen</p>",
    label: "Le texte d'explication pour la page de consultations"
  },
  territories_explain: {
    type: String,
    defaultValue: "<p>Choisissez un quartier pour voir ses consultations en cours</p>",
    label: "Le texte d'explication pour la page de quartiers"
  },
  consults_display_explain: {
    type: Boolean,
    defaultValue: false
  },
  territories_display_explain: {
    type: Boolean,
    defaultValue: false
  },
  consults_default_image_url: {
    type: String,
    defaultValue: "https://image.freepik.com/free-vector/business-people-with-speech-bubbles_1325-25.jpg",
    label: "L'url par défaut de l'image de consultation"
  },
  landing_map_explain: {
    type: String,
    optional: true
  },
  connect_explain: {
    type: String,
    optional: true
  }
})

Configuration.attachSchema(ConfigurationSchema);
