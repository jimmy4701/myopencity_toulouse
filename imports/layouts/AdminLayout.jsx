import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Sidebar, Grid, Segment, Button, Menu, Image, Icon, Header, Loader} from 'semantic-ui-react'
import Navbar from '/imports/components/navigation/Navbar'
import {Configuration} from '/imports/api/configuration/configuration'
import { createContainer } from 'meteor/react-meteor-data'

export class AdminLayout extends TrackerReact(Component){

  constructor(props){
    super(props)
    this.state = {
      subscription:{
        configuration: Meteor.subscribe('global_configuration')
      }
    }
  }

  componentWillUnmount(){
    this.state.subscription.configuration.stop()
  }

  componentWillMount(){
    Session.set('open_sidebar', true)
  }

  componentDidMount(){
    new WOW().init()
  }


  go(route){
    Session.set('open_sidebar', false)
    FlowRouter.go(route)
  }

  toggleSidebar(e){
    e.preventDefault()
    Session.set('open_sidebar', !Session.get('open_sidebar'))
  }


  render(){
    const {global_configuration, loading} = this.props

    if(!loading){
      return (
        <div className="main-container">
          <Sidebar.Pushable>
            <Sidebar as={Menu} animation='push' width='thin' visible={Session.get('open_sidebar')} className="main-sidebar" icon='labeled' vertical inverted>
              {Roles.userIsInRole(Meteor.userId(), 'admin') ?
                <Menu.Item onClick={() => {this.go('AdminConfiguration')}} name='cogs'>
                  <Icon name='cogs' />
                  Configuration
                </Menu.Item>
              : ''}
              <Menu.Item onClick={() => {this.go('AdminUsers')}} name='users'>
                <Icon name='users' />
                Utilisateurs
              </Menu.Item>
              {Roles.userIsInRole(Meteor.userId(), 'admin') ?
                <Menu.Item onClick={() => {this.go('AdminExternalApis')}} name='google'>
                  <Icon name='google' />
                  Services externes
                </Menu.Item>
              : ''}
              <Menu.Item onClick={() => {this.go('AdminConsults')}} name='comments'>
                <Icon name='comments' />
                Consultations
              </Menu.Item>
              <Menu.Item onClick={() => {this.go('AdminProjects')}} name='projects'>
                <Icon name='lightbulb' />
                Projets
              </Menu.Item>
              <Menu.Item onClick={() => {this.go('AdminAlternativesValidation')}} name='projects'>
                <Icon name='check circle' />
                Alternatives
              </Menu.Item>
              {Roles.userIsInRole(Meteor.userId(), 'admin') ?
                <Menu.Item onClick={() => {this.go('AdminApiAuthorizations')}} name='api_authorizations'>
                  <Icon name='key' />
                  Autorisations API
                </Menu.Item>
              : ''}
              {Roles.userIsInRole(Meteor.userId(), 'admin') ?
                <Menu.Item onClick={() => {this.go('AdminExternalOpencities')}} name='external_opencities'>
                  <Icon name='exchange' />
                  Opencities connectés
                </Menu.Item>
              : ''}
            </Sidebar>
            <Sidebar.Pusher>
              <Grid stackable>
                <Grid.Column width={16} className="navbar-container">
                  <Navbar />
                </Grid.Column>
                <Grid.Column width={16}>
                  <main>
                    {this.props.content}
                  </main>
                </Grid.Column>
              </Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
          <Button style={{backgroundColor: configuration.navbar_color, color: configuration.navbar_color}} onClick={(e) => {this.toggleSidebar(e)}} className="open-sidebar-button" rounded icon="content" size="big"></Button>
        </div>
      )
    }else{
      return <Loader className="inline-block">Chargement de la configuration</Loader>
    }

  }
}

export default AdminLayoutContainer = createContainer(() => {
  const globalConfigurationPublication = Meteor.subscribe('global_configuration')
  const loading = !globalConfigurationPublication.ready()
  const global_configuration = Configuration.findOne({})
  return {
    loading,
    global_configuration
  }
}, AdminLayout)
