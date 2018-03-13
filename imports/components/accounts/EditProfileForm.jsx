import React, {Component} from 'react'
import {
  Grid,
  Form,
  Input,
  Button,
  Header,
  Container,
  Checkbox,
  Message,
  Divider,
  Select
} from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'
import {Territories} from '/imports/api/territories/territories'
import {withTracker} from 'meteor/react-meteor-data'
import {Link} from 'react-router-dom'

export class EditProfileForm extends Component {

  /*
    required props:
      - none
  */

  state = {
    user_profile: {}
  }

  componentWillMount() {
    this.setState({
      user_profile: Meteor.isClient && Meteor
        .user()
        .profile
    })
  }

  handleDescriptionChange(e) {
    let {user_profile} = this.state
    user_profile.description = e
      .target
      .getContent()
    this.setState({user_profile})
  }

  handleProfileChange = (e) => {
    let {user_profile} = this.state
    user_profile[e.target.name] = e.target.value
    this.setState({user_profile})
  }

  toggleProfile = (attr) => {
    let {user_profile} = this.state
    user_profile[attr] = !user_profile[attr]
    this.setState({user_profile})
  }

  handleSelect = (event, data) => {
    let {user_profile} = this.state
    user_profile[data.name] = data.value
    this.setState({user_profile})
  }

  edit_profile(e) {
    e.preventDefault()
    const {user_profile} = this.state

    Meteor.call('user.edit_profile', user_profile, (error, result) => {
      if (error) {
        console.log(error)
        Bert.alert({title: "Erreur lors de la modification de votre profil", message: error.reason, type: 'danger', style: 'growl-bottom-left'})
      } else {
        Bert.alert({title: "Votre profil a bien été modifié", type: 'success', style: 'growl-bottom-left'})
      }
    });
  }

  render() {
    const {user_profile} = this.state
    const {territories} = this.props
    const socio_pro_options = [
      {
        key: "farmer",
        value: "farmer",
        text: "Agriculteurs"
      }, {
        key: "entrepreneur",
        value: "entrepreneur",
        text: "Artisans, Commerçants, Entrepreneurs"
      }, {
        key: "independant",
        value: "independant",
        text: "Professions libérales et cadres supérieurs"
      }, {
        key: "middle",
        value: "middle",
        text: "Cadres moyens"
      }, {
        key: "employee",
        value: "employee",
        text: "Employés"
      }, {
        key: "worker",
        value: "worker",
        text: "Ouvriers"
      }, {
        key: "service",
        value: "service",
        text: "Personnels de services"
      }, {
        key: "retired",
        value: "retired",
        text: "Retraités"
      }, {
        key: "student",
        value: "student",
        text: "Étudiants"
      }, {
        key: "military",
        value: "military",
        text: "Militaires"
      }, {
        key: "other",
        value: "other",
        text: "Autres"
      }
    ]

    const territories_options = territories.map(territory => {
      return {key: territory._id, value: territory._id, text: territory.name}
    })

    return (
      <Container>
        <Grid stackable>
          <Grid.Column width={8}>
          <Header as='h1'>Les quartiers de la Métropole et vous</Header>
            <Form>
                <Form.Field>
                  <label>J'y habite</label>
                    <Select
                      options={territories_options}
                      value={user_profile.home_territories}
                      onChange={this.handleSelect}
                      name="home_territories"
                      multiple
                      />
                </Form.Field>
                <Form.Field>
                  <label>J'y travaille</label>
                    <Select
                      options={territories_options}
                      value={user_profile.work_territories}
                      onChange={this.handleSelect}
                      name="work_territories"
                      multiple
                      />
                </Form.Field>

                <Form.Field>
                  <label>Ils m'intéressent</label>
                  <Select
                        options={territories_options}
                        value={user_profile.interest_territories}
                        onChange={this.handleSelect}
                        name="interest_territories"
                        multiple
                  />
                </Form.Field>
                <Form.Field>
                    <label>J'y passe régulièrement</label>
                      <Select
                        options={territories_options}
                        value={user_profile.travel_territories}
                        onChange={this.handleSelect}
                        name="travel_territories"
                        multiple
                        />
                    </Form.Field>
              </Form>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h1">Dîtes-nous en un peu plus sur vous</Header>
              <Form>
                <Form.Group widths="equal">
                  <Form.Checkbox
                    label={{
                    children: "J'autorise les autres citoyens à voir mes données"
                  }}
                    vertical
                    onClick={() => this.toggleProfile('public_profile')}
                    checked={user_profile.public_profile}/>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input
                    type="number"
                    min="0"
                    label="Votre age"
                    value={user_profile.age}
                    onChange={this.handleProfileChange}
                    name="age"/>
                  <Form.Field>
                    <label>Vous êtes</label>
                    <Select
                      options={[
                      {
                        key: "man",
                        value: "man",
                        text: "Un homme"
                      }, {
                        key: "woman",
                        value: "woman",
                        text: "Une femme"
                      }
                    ]}
                      value={user_profile.gender}
                      onChange={this.handleSelect}
                      name="gender"/>
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Catégorie socio-professionnelle</label>
                    <Select
                      options={socio_pro_options}
                      value={user_profile.socio_pro}
                      onChange={this.handleSelect}
                      name="socio_pro"/>
                  </Form.Field>
                </Form.Group>
                <Form.Field className="padded-bottom center-align">
                  <Button
                    size="big"
                    positive
                    onClick={(e) => {
                    this.edit_profile(e)
                  }}>Modifier mon profil</Button>
                </Form.Field>
              </Form>
            </Grid.Column>
            <Grid.Column width={16}>
            <Message color="blue" icon="thumbs up" header="Vous comprendre, ça passe par cette page" content="En remplissant votre profil correctement, vous permettez à la Métropole de Toulouse de mieux comprendre vos avis, et de prendre de meilleures décisions."/>
          </Grid.Column>
        </Grid>
      </Container>
    ) 
  } 
}

export default EditProfileFormContainer = withTracker(() => {
  const territories = Territories.find({active: true}).fetch()
  return {
    territories
  }
})(EditProfileForm)