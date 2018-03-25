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
    const {buttons_validation_background_color, buttons_validation_text_color} = Meteor.isClient && Session.get('global_configuration')
    const age_options = [
      {
        key: "18",
        value: "18",
        text: "Moins de 18 ans"
      },
      {
        key: "30",
        value: "30",
        text: "Entre 18 et 30 ans"
      },
      {
        key: "40",
        value: "40",
        text: "Entre 30 et 40 ans"
      },
      {
        key: "50",
        value: "50",
        text: "Entre 40 et 50 ans"
      },
      {
        key: "60",
        value: "60",
        text: "Entre 50 et 60 ans"
      },
      {
        key: "70",
        value: "70",
        text: "Entre 60 et 70 ans"
      },
      {
        key: "80",
        value: "80",
        text: "Plus de 70 ans"
      }
    ]

    const territories_options = territories.map(territory => {
      return {key: territory._id, value: territory._id, text: territory.name}
    })

    const {cnil_signup_text} = Meteor.isClient && Session.get('global_configuration')

    return (
      <Container>
        <Grid stackable>
          <Grid.Column width={8}>
          <Header as='h1'>Les quartiers de la ville et vous</Header>
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
                  <Form.Field>
                    <label>Votre âge</label>
                    <Select
                      options={age_options}
                      value={user_profile.age}
                      onChange={this.handleSelect}
                      name="age"/>
                  </Form.Field>
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
                  
                </Form.Group>
                <Form.Field className="padded-bottom center-align">
                  <Button
                    size="big"
                    positive
                    style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}}
                    onClick={(e) => {
                    this.edit_profile(e)
                  }}>Modifier mon profil</Button>
                </Form.Field>
                <div className="cnil-signup-text" dangerouslySetInnerHTML={{__html: cnil_signup_text }} />
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