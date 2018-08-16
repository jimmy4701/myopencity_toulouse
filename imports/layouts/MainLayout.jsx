import React, { Component } from "react"

//packages
import { Switch, withRouter, Link } from 'react-router-dom'
import { Helmet } from "react-helmet"
import { createContainer } from 'meteor/react-meteor-data'
import { Loader, Grid, Sidebar, Button, Menu, Icon } from 'semantic-ui-react'

// Components
import Navbar from '/imports/components/navigation/Navbar'
import Footer from '/imports/components/footer/Footer'

// routes
import Public from '/imports/components/routes/Public'

// Collection
import { Configuration } from '/imports/api/configuration/configuration'

// Pages
import Landing from '/imports/pages/general/Landing'
import SignupPage from '/imports/pages/accounts/SignupPage'
import SigninPage from '/imports/pages/accounts/SigninPage'
import ConsultsPage from '/imports/pages/consults/ConsultsPage'
import ConsultPage from '/imports/pages/consults/ConsultPage'
import MyProfile from '/imports/pages/accounts/MyProfile'
import ProfilePage from '/imports/pages/accounts/ProfilePage'
import ProjectsPage from '/imports/pages/projects/ProjectsPage'
import ProjectPage from '/imports/pages/projects/ProjectPage'
import NewProjectPage from '/imports/pages/projects/NewProjectPage'
import EditProjectPage from '/imports/pages/projects/EditProjectPage'
import MyProjectsPage from '/imports/pages/projects/MyProjectsPage'
import SendPasswordEmail from '/imports/pages/accounts/SendPasswordEmail'
import ResetPassword from '/imports/pages/accounts/ResetPassword'
import NotFound from '/imports/pages/general/NotFound'
import TerritoryConsultsPage from '/imports/pages/consults/TerritoryConsultsPage'
import TerritoriesPage from '/imports/pages/territories/TerritoriesPage'
import TerritoryProjectsPage from '/imports/pages/projects/TerritoryProjectsPage'
import Conditions from '/imports/pages/general/Conditions'
import LegalNotice from '/imports/pages/general/LegalNotice'
import About from '/imports/pages/general/About'
import Participation from '/imports/pages/general/Participation'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import CookieConsent from "react-cookie-consent"
import AccountValidation from '/imports/pages/accounts/AccountValidation'
import Lexical from '/imports/pages/general/Lexical'

export class MainLayout extends TrackerReact(Component) {
  
  
  state = {
    loading: true
  }


  check_initial_config = () => {
    const {global_configuration} = this.props
    if (global_configuration.initial_configuration) {
      this.props.history.push('/initial/presentation')
    }
  }

  toggleSideBar = () => {
    Session.set('open_sidebar', !Session.get('open_sidebar'))
  }

  logout = () => {
    Meteor.logout()
    this.props.history.push('/')
  }

  render() {
    const { global_configuration, loading } = this.props

    if (!loading) {
      Session.set('global_configuration', global_configuration)
      const {
        navbar_consults, 
        navbar_consults_term,
        navbar_home_term,
        navbar_participation,
        navbar_participation_term,
        navbar_projects,
        navbar_projects_term,
        navbar_territories,
        navbar_territories_term,
        navbar_lexical_term,
        navbar_lexical
      } = global_configuration
      this.check_initial_config()
      console.log('Global configuration', global_configuration)
      return (
        <div className="main-container">
          <Helmet>
            <title>{global_configuration.main_title}</title>
            <meta property="og:title" content={global_configuration.main_title} />
            <meta property="og:description" content={global_configuration.main_description} />
            <meta property="og:url" content="https://jeparticipe.toulouse.fr" />
            <meta name="description" content={global_configuration.main_description} />
            <link rel="icon" href={global_configuration.global_logo_url} />
            <meta property="og:image" content={global_configuration.landing_header_background_url} />
            <meta property="og:type" content="website" />
            <meta name="author" content="Toulouse Métropole" />

            {!global_configuration.seo_active ?
              <meta name="robots" content="noindex, nofollow" />
              : 
              <meta name="robots" content="index, follow" />
            }
          </Helmet>
          <Sidebar.Pushable>
            <Sidebar as={Menu} animation='push' width='thin' visible={Session.get('open_sidebar')} className="main-sidebar" icon='labeled' vertical inverted>
              <Link onClick={this.toggleSideBar} to="/">
                <Menu.Item name='consultations'>
                  {navbar_home_term}
                </Menu.Item>
              </Link>
              {navbar_territories && 
                <Link className="item" onClick={this.toggleSideBar} to="/territories">
                  <div className="navbar-item">{navbar_territories_term}</div>
                </Link>
              }
              {navbar_consults &&
                <Link className="item" onClick={this.toggleSideBar} to="/consults">
                  <div className="navbar-item">{navbar_consults_term}</div>
                </Link>
              }
              {navbar_projects && 
                <Link className="item" onClick={this.toggleSideBar} to="/projects">
                  <div className="navbar-item">{navbar_projects_term}</div>
                </Link>
              }
              {navbar_participation && 
                <Link className="item" onClick={this.toggleSideBar} to="/participation">
                  <div className="navbar-item">{navbar_participation_term}</div>
                </Link>
              }
              {navbar_lexical && 
                <Link className="item" onClick={this.toggleSideBar} to="/lexical">
                  <div className="navbar-item">{navbar_lexical_term}</div>
                </Link>
              }
              {Meteor.userId() ?
                <span>
                  {Roles.userIsInRole(Meteor.userId(), ['admin', 'moderator']) &&
                    <Link className="item" onClick={this.toggleSideBar} to="/admin/consults">
                      <div className="navbar-item">Admin</div>
                    </Link>
                  }
                  <Link className="item" onClick={this.toggleSideBar} to="/me/profile">
                    <div className="navbar-item">Mon profil</div>
                  </Link>
                  <Menu.Item floated="bottom" name='profile' onClick={this.logout}>
                    Déconnexion
                  </Menu.Item>
                </span>
                :
                <Link className="item" onClick={this.toggleSideBar} to="/sign_in">
                  <div className="navbar-item">Connexion</div>
                </Link>
              }
            </Sidebar>
            <Sidebar.Pusher>
              <Grid>
                <Grid.Column width={16} className="navbar-container">
                  <Navbar />
                </Grid.Column>
                <Grid.Column width={16}>
                  <main className="main-container">
                    <Switch>
                      <Public component={Landing} exact path="/" { ...this.props } />
                      <Public component={SignupPage} exact path="/sign_up"       { ...this.props } />
                      <Public component={SigninPage} exact path="/sign_in"       { ...this.props } />
                      <Public component={ConsultsPage} exact path="/consults"       { ...this.props } />
                      <Public component={ConsultPage} exact path="/consults/:urlShorten"       { ...this.props } />
                      <Public component={TerritoryConsultsPage} exact path="/territory/:shorten_url/consults"       { ...this.props } />
                      <Public component={ProfilePage} exact path="/profile/:user_id"       { ...this.props } />
                      <Public component={ProjectsPage} exact path="/projects"       { ...this.props } />
                      <Public component={NewProjectPage} exact path="/projects/new"       { ...this.props } />
                      <Public component={NewProjectPage} exact path="/projects/new/:parent_id"       { ...this.props } />
                      <Public component={NewProjectPage} exact path="/projects/new/territory/:shorten_url"       { ...this.props } />
                      <Public component={EditProjectPage} exact path="/projects/:shorten_url/edit"       { ...this.props } />
                      <Public component={ProjectPage} exact path="/projects/:shorten_url"       { ...this.props } />
                      <Public component={MyProfile} exact path="/me/profile"       { ...this.props } />
                      <Public component={MyProjectsPage} exact path="/me/projects"       { ...this.props } />
                      <Public component={SendPasswordEmail} exact path="/forgot_password" { ...this.props } />
                      <Public component={ResetPassword} exact path="/reset-password/:token" { ...this.props } />
                      <Public component={TerritoriesPage} exact path="/territories" { ...this.props } />
                      <Public component={TerritoryProjectsPage} exact path="/territory/:shorten_url/projects" { ...this.props } />
                      <Public component={Conditions} exact path="/conditions" { ...this.props } />
                      <Public component={LegalNotice} exact path="/mentions_legales" { ...this.props } />
                      <Public component={About} exact path="/a_propos" { ...this.props } />
                      <Public component={Participation} exact path="/participation" { ...this.props } />
                      <Public component={Lexical} exact path="/lexical" { ...this.props } />
                      <Public component={AccountValidation} exact path="/account_validation/:token" { ...this.props } />
                      <Public component={NotFound} path="*"  { ...this.props } />
                    </Switch>
                  </main>
                </Grid.Column>
                {global_configuration.footer_display &&
                  <Grid.Column width={16} className="footer-container">
                    <Footer />
                  </Grid.Column>
                }
              </Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
          <CookieConsent
            location="bottom"
            buttonText="J'accepte"
            style={{ background: "rgba(1,1,1,0.8)" }}
            buttonStyle={{ color: "white", backgroundColor: "rgb(140,140,140)", cursor: "pointer" }}
          >
              En poursuivant votre navigation sur ce site, vous acceptez l’utilisation de cookies pour vous proposer des contenus et services adaptés à vos centres d’intérêt. <Link to="/conditions" target="_blank">En savoir plus et gérer ces paramètres</Link> 
          </CookieConsent>
        </div>
      )
    } else {
      return <Loader className="inline-block">Chargement de la page</Loader>
    }
  }
}

export default MainLayoutContainer = createContainer(() => {
  const globalConfigurationPublication = Meteor.subscribe('global_configuration')
  const loading = !globalConfigurationPublication.ready()
  const global_configuration = Configuration.findOne({})
  return {
    loading,
    global_configuration
  }
}, withRouter(MainLayout))
