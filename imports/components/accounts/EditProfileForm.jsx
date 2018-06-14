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
        key: "24",
        value: "24",
        text: "Entre 18 et 24 ans"
      },
      {
        key: "39",
        value: "39",
        text: "Entre 25 et 39 ans"
      },
      {
        key: "65",
        value: "65",
        text: "Entre 40 et 65 ans"
      },
      {
        key: "80",
        value: "80",
        text: "Plus de 65 ans"
      }
    ]

    const territories_options = territories.map(territory => {
      return {key: territory._id, value: territory._id, text: territory.name}
    })

    const {cnil_signup_text, navbar_color, fill_profile_explain} = Meteor.isClient && Session.get('global_configuration')

    return (
      <Container>
        <Grid stackable>
          <Grid.Column width={16}>
              <Header style={{color: navbar_color}} as="h1">Aidez-nous à mieux vous connaître</Header>
              {fill_profile_explain && 
                <div style={{marginBottom: "1em"}} dangerouslySetInnerHTML={{__html: fill_profile_explain }} />
              }
              <Form>
                <Form.Group>
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
                      }, {
                        key: "other",
                        value: "other",
                        text: "Autre"
                      }
                    ]}
                      value={user_profile.gender}
                      onChange={this.handleSelect}
                      name="gender"/>
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  
                </Form.Group>
              </Form>
            </Grid.Column>
          <Grid.Column width={16}>
            <Header as='h1' style={{color: navbar_color}}>Vous et Toulouse</Header>
              <Form>
                  <Form.Group widths='equal'>
                    <Form.Field>
                      <label>J'y habite</label>
                        <Select
                          options={territories_options}
                          value={user_profile.home_territories}
                          onChange={this.handleSelect}
                          name="home_territories"
                          />
                    </Form.Field>
                    <Form.Field>
                      <label>Ils m'intéressent (choix multiples possibles)</label>
                      <Select
                            options={territories_options}
                            value={user_profile.interest_territories}
                            onChange={this.handleSelect}
                            name="interest_territories"
                            multiple
                      />
                    </Form.Field>
                  </Form.Group>
                  <Form.Group>
                    <Form.Field width={8}>
                      <label>J'y travaille</label>
                        <Select
                          options={territories_options}
                          value={user_profile.work_territories}
                          onChange={this.handleSelect}
                          name="work_territories"
                          />
                    </Form.Field>
                  </Form.Group>
                  <Form.Field className="padded-bottom center-align">
                    <Button
                      size="big"
                      positive
                      style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color, margin: "2em 0"}}
                      onClick={(e) => {
                      this.edit_profile(e)
                    }}>Enregistrer</Button>
                  </Form.Field>
                </Form>
            </Grid.Column>
            <Grid.Column width={16}>
              <Header as='h3'>Mentions légales</Header>
              <div className="cnil-signup-text" dangerouslySetInnerHTML={{__html: cnil_signup_text }} />
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