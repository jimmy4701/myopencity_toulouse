import React, { Component } from 'react'
import { Grid, Header, Button, Loader, Container, Icon, Form, Item } from 'semantic-ui-react'
import TerritoryPartial from '/imports/components/territories/TerritoryPartial'
import TerritoryForm from '/imports/components/territories/TerritoryForm'
import { Territories } from '/imports/api/territories/territories'
import { withTracker } from 'meteor/react-meteor-data'
import { Link } from 'react-router-dom'

export class AdminTerritory extends Component {

  /*
    required props:
      - none
  */

  state = {
    moderator_email: ""
  }

  toggleState = (e) => {
    this.setState({ [e.target.name]: !this.state[e.target.name], editing_territory: null })
  }

  add_user = (e) => {
    e.preventDefault()
    Meteor.call('territories.add_moderator', { email: this.state.moderator_email, territory_id: this.props.territory._id }, (error, result) => {
      if (error) {
        console.log(error)
        Bert.alert({
          title: "Erreur lors de l'ajout du modérateur",
          message: error.message,
          type: 'danger',
          style: 'growl-bottom-left'
        })
      } else {
        Bert.alert({
          title: 'Modérateur ajouté',
          type: 'success',
          style: 'growl-bottom-left'
        })
        this.setState({ moderator_email: "" })
      }
    })
  }

  remove_moderator = (user) => {
    Meteor.call('territories.remove_moderator', { user_id: user._id, territory_id: this.props.territory._id }, (error, result) => {
      if (error) {
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la suppression du modérateur",
          message: error.message,
          type: 'danger',
          style: 'growl-bottom-left'
        })
      } else {
        Bert.alert({
          title: 'Modérateur supprimé',
          type: 'success',
          style: 'growl-bottom-left'
        })
        this.setState()
      }
    })
  }

  onSubmit = () => {
    this.setState({ display_form: false, editing_territory: null })
  }

  editTerritory = (territory) => {
    this.setState({ display_form: true, editing_territory: territory })
  }

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value })


  render() {
    const { territory, users, loading } = this.props
    const { moderator_email } = this.state

    if (!loading) {
      return (
        <Container>
          <Grid stackable className="wow fadeInLeft">
            <Grid.Column width={16} className="wow fadeInLeft">
              <Header as="h1"><Icon name="map" size="big" />Gestion du quartier {territory.name}</Header>
            </Grid.Column>
            <Grid.Column width={16}>
              <Header as="h3">Modérateurs</Header>
              <Form onSubmit={this.add_user}>
                <Form.Input
                  onChange={this.handleChange}
                  type='text'
                  value={moderator_email}
                  name="moderator_email"
                />
                <Button content="Ajouter le modérateur" color="green" icon="add" />
              </Form>
              <Item.Group>

                {users.map((user) => {
                  return (
                    <Item key={user._id}>
                      <Item.Image size='tiny' src={user.profile.avatar_url} />

                      <Item.Content>
                        <Link to={"/profile/" + user._id}>
                          <Item.Header>{user.username}</Item.Header>
                        </Link>
                        <Item.Meta>{user.emails[0].address}</Item.Meta>
                        <Item.Extra><Button onClick={() => this.remove_moderator(user)} color="red" size="mini">Supprimer</Button></Item.Extra>
                      </Item.Content>
                    </Item>
                  )
                })}

              </Item.Group>
            </Grid.Column>
          </Grid>
        </Container>
      )
    } else {
      return <Loader className="inline-block">Chargement des consultations</Loader>
    }
  }
}

export default AdminTerritoryContainer = withTracker(({ match }) => {
  const { territory_id } = match.params
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.by_id', territory_id)
  const territory = Territories.findOne({ _id: territory_id })
  if (territory) {
    const usersPublication = Meteor.isClient && Meteor.subscribe('users.moderators_by_territory', territory.shorten_url)
    const loading = Meteor.isClient && (!territoriesPublication.ready() || !usersPublication.ready())
    const users = Meteor.users.find({ _id: { $ne: Meteor.isClient ? Meteor.userId() : this.userId } })
    return {
      loading,
      territory,
      users
    }
  } else {
    return { loading: true }
  }
})(AdminTerritory)
