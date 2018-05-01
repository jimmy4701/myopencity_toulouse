import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Loader, Table, Button, Label, Modal, Form} from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'

export default class AdminUserRow extends TrackerReact(Component){

  /*
    required props:
      - user: Object
  */

  state = {

  }

  handleTerritoriesChange = (event, data) => {
    console.log('data', data)
    Meteor.call('territories.set_moderator', {territories_ids: data.value, user_id: this.props.user._id} , (error, result) => {
      if(error){
        console.log('Erreur', error.message)
        Bert.alert({
              title: "Erreur lors de la modification des droits",
              style: 'growl-bottom-left',
              type: 'danger'
            })
      }else{
        
      }
    })
  }

  toggleBlocked(){
    Meteor.call('users.toggle_blocked', this.props.user._id, (error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la modification de l'utilisateur",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        Bert.alert({
          title: "Utilisateur modifié",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    })
  }

  toggleAlternativeModerator = (e) => {
    Meteor.call('admin.toggle_alternative_moderator', this.props.user._id, (error, result) => {
      if(error){
        console.log('Erreur', error.message)
      }else{
        Bert.alert({
          title: 'Utilisateur modifié',
          style: 'growl-bottom-left',
          type: 'success'
        })
      }
    })
  }

  toggleState = (e, {name}) => this.setState({[name]: !this.state[name]})

  remove = () => {
    Meteor.call('admin.remove_account', this.props.user._id , (error, result) => {
      if(error){
        console.log('Erreur', error.message)
        Bert.alert({
              title: "Erreur lors de la suppression du compte",
              message: error.message,
              style: 'growl-bottom-left',
              type: 'success'
            })
      }else{
          Bert.alert({
            title: "Compte supprimé",
            message: "Tout le contenu associé a également été supprimé",
            style: 'growl-bottom-left',
            type: 'success'
          })
      }
    })
  }

  toggleModerator(){
    Meteor.call('users.toggle_moderator', this.props.user._id, (error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la modification de l'utilisateur",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        Bert.alert({
          title: "Utilisateur modifié",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    });
  }

  toggleModal = () => this.setState({open_modal: !this.state.open_modal})

  render(){
    const {user, territories} = this.props
    const {removing, open_modal} = this.state
    moment.locale('fr')
    const moderator = Roles.userIsInRole(user._id, 'moderator')
    const alternative_moderator = Roles.userIsInRole(user._id, 'alternative_moderator')
    const admin = Roles.userIsInRole(user._id, 'admin')
    const user_territories = user.roles.map(role => {
      if(role != "admin" && role != "moderator"){
        return role
      }
    })
    const territories_options = territories.map(territory => {
      return {
        key: territory._id,
        value: territory._id,
        text: territory.name
      }
    })
    return(
      <Table.Row>
        <Table.Cell>{user.username}{admin && <span>  <Label>ADMIN</Label></span>}{moderator && <span>  <Label>MODERATEUR</Label></span>}</Table.Cell>
        <Table.Cell>{user.emails[0].address}</Table.Cell>
        <Table.Cell>{moment(user.createdAt).format('DD.MM.YYYY - HH:mm')}</Table.Cell>
        <Table.Cell>
          <Button color={user.blocked ? "red" : ""} onClick={(e) => {this.toggleBlocked(e)}}>{user.blocked ? "Bloqué" : "Actif"}</Button>
          <Button onClick={this.toggleModal}>Gérer les droits</Button>
          <Link to={"/profile/" + user._id}>
            <Button>Profil</Button>
          </Link>
        </Table.Cell>
          <Modal size="mini" className="wow fadeInUp" open={open_modal} onClose={this.toggleModal}>
            <Modal.Header className="center-align" as="h1">Gestion des droits</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p>{user.username}</p>
                {Roles.userIsInRole(Meteor.userId(), 'admin') &&
                [
                  <Button fluid color={moderator ? "green" : ""} onClick={(e) => {this.toggleModerator(e)}}>{moderator ? "Modérateur" : "Utilisateur"}</Button>,
                  <Button fluid color={alternative_moderator ? "green" : ""} onClick={(e) => {this.toggleAlternativeModerator(e)}}>Notifications</Button>
                ]
                }
                {Roles.userIsInRole(Meteor.userId(), 'admin') && moderator &&
                  <Form>
                      <Form.Select
                        options={territories_options}
                        onChange={this.handleTerritoriesChange}
                        multiple
                        value={user_territories}
                      />
                  </Form>
                }
                {Roles.userIsInRole(Meteor.userId(), 'admin') &&
                  <span>
                    {removing && 
                      <Button fluid color="red" onClick={this.remove}>Supprimer le compte</Button>
                    }
                    <Button fluid color={!removing && "red"} name="removing" onClick={this.toggleState}>{removing ? "Annuler" : "Supprimer"}</Button>
                  </span>
                }
              </Modal.Description>
            </Modal.Content>
          </Modal>
      </Table.Row>
    )
  }
}
