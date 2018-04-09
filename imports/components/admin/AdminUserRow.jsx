import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Loader, Table, Button, Label} from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'

export default class AdminUserRow extends TrackerReact(Component){

  /*
    required props:
      - user: Object
  */

  constructor(props){
    super(props);
    this.state = {

    }
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

  render(){
    const {user} = this.props
    moment.locale('fr')
    const moderator = Roles.userIsInRole(user._id, 'moderator')
    const alternative_moderator = Roles.userIsInRole(user._id, 'alternative_moderator')
    const admin = Roles.userIsInRole(user._id, 'admin')
    return(
      <Table.Row>
        <Table.Cell>{user.username}{admin && <span>  <Label>ADMIN</Label></span>}</Table.Cell>
        <Table.Cell>{user.emails[0].address}</Table.Cell>
        <Table.Cell>{moment(user.createdAt).format('DD.MM.YYYY - HH:mm')}</Table.Cell>
        <Table.Cell>
          <Button color={user.blocked ? "red" : ""} onClick={(e) => {this.toggleBlocked(e)}}>{user.blocked ? "Bloqué" : "Actif"}</Button>
          {Roles.userIsInRole(Meteor.userId(), 'admin') &&
            [
              <Button color={moderator ? "green" : ""} onClick={(e) => {this.toggleModerator(e)}}>{moderator ? "Modérateur" : "Utilisateur"}</Button>,
              <Button color={alternative_moderator ? "green" : ""} onClick={(e) => {this.toggleAlternativeModerator(e)}}>Modérateur Alter.</Button>
            ]
          }
          <Link to={"/profile/" + user._id}>
            <Button>Profil</Button>
          </Link>
        </Table.Cell>
      </Table.Row>
    )
  }
}
