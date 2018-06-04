import {Meteor} from 'meteor/meteor'
import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Menu, Modal, Dropdown, Image, Icon} from 'semantic-ui-react'
import SigninForm from '/imports/components/accounts/SigninForm'
import {Link, withRouter} from 'react-router-dom'

class NavbarAccountItem extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  state = {
    screen_size: window.innerWith
  }

  onSignin(user_id){
    this.props.history.push('/')
  }

  logout(){
    Meteor.logout((error, result) => {
      if(error){
        Bert.alert({
          title: "Erreur lors de la déconnexion",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        this.props.history.push('/')
        Bert.alert({
          title: "Au revoir",
          message: "Vous avez été déconnecté",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    })
  }

  toggleState(attr, e){
    e.preventDefault()
    let state = this.state
    state[attr] = !state[attr]
    this.setState(state)
  }

  onSignupClick(){
    this.setState({open_modal: false})
  }

  render(){
    const current_user = Meteor.user()
    const {project_term, navbar_projects, connect_explain, navbar_color} = Meteor.isClient && Session.get('global_configuration')
    
    if(current_user){
      const trigger = (
        <div className="navbar-item" style={{display: 'flex', alignItems: 'center'}}>
          <Image floated="left" avatar src="/images/avatar-logo.png" /> {current_user.username}
        </div>
      )
      return(
        <Dropdown trigger={trigger} icon={null}>
          <Dropdown.Menu>
            <Link to="/me/profile">
              <Dropdown.Item>Profil</Dropdown.Item>
            </Link>
            {navbar_projects &&
              <Link to="/me/projects">
                <Dropdown.Item>Mes {project_term}s</Dropdown.Item>
              </Link> 
            }
            {Roles.userIsInRole(Meteor.userId(), ['admin', 'moderator']) ?
              <Link to="/admin/consults">
                <Dropdown.Item>Admin</Dropdown.Item>
              </Link>
            : ''}
            <Dropdown.Item onClick={this.logout.bind(this)}>Déconnexion</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        )
    }else{
      return (
        <div>
          <Menu.Item className="navbar-item" onClick={(e) => {this.toggleState('open_modal', e)}}><Icon name="user" /> Connexion</Menu.Item>
          <Modal size="mini" className="wow fadeInUp" open={this.state.open_modal} onClose={(e) => {this.toggleState('open_modal', e)}}>
            <Modal.Header className="center-align">
              <Image src="/images/toulouse-metropole-dark.png" inline/>
            </Modal.Header>
            <Modal.Header className="center-align" as="h1" style={{backgroundColor: navbar_color, color: "white"}}>
              Connexion
            </Modal.Header>
            {connect_explain &&
              <p className="center-align">{connect_explain}</p>
            }
            <Modal.Content>
              <Modal.Description>
                <SigninForm fluidButtons onSignin={this.onSignin.bind(this)} onSignupClick={this.onSignupClick.bind(this)} />
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </div>
      )
    }
  }
}

export default withRouter(NavbarAccountItem)
