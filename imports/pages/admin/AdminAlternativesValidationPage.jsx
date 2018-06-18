import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Menu, Container, Icon, Form, Button} from 'semantic-ui-react'
import AlternativePartial from '/imports/components/alternatives/AlternativePartial'
import AdminUnverifiedAlternatives from '/imports/components/admin/AdminUnverifiedAlternatives'
import AdminUnvalidatedAlternatives from '/imports/components/admin/AdminUnvalidatedAlternatives'
import AdminSignaledAlternatives from '/imports/components/admin/AdminSignaledAlternatives'
import AdminSearchAlternatives from '/imports/components/admin/AdminSearchAlternatives'
import AdminVerifiedAlternatives from '/imports/components/admin/AdminVerifiedAlternatives'

export default class AdminAlternativesValidationPage extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  state = {
    part: "unverified",
    search_text: "",
    typing_text: ""
  }

  changePart = (part) => this.setState({part})

  handleChange = (e, {name, value}) => this.setState({[name]: value})

  search = (e) => {
    e.preventDefault()
    this.setState({search_text: this.state.typing_text})
  }

  resetSearch = () => {
    this.setState({search_text: "", typing_text: ""})
  }

  render(){
    const {part, search_text, typing_text} = this.state

      return(
        <Container>
          <Grid stackable>
          <Grid.Column width={16}>
            <Form onSubmit={this.search}>
              <Form.Input
                label='Rechercher un avis'
                onChange={this.handleChange}
                value={typing_text}
                name='typing_text'
                placeholder="Tapez un contenu d'avis"
              />
              <Button icon="search" content="Rechercher" />
              {search_text && 
                <Button icon="refresh" onClick={this.resetSearch} content="Annuler la recherche" />
              }
            </Form>
          </Grid.Column>
          {!search_text &&
            <Grid.Column width={16}>
              <Menu pointing secondary stackable>
                  <Menu.Item active={part === 'unverified'} onClick={() => this.changePart('unverified')} >
                      <Icon name="find" />
                      Non vérifiés
                  </Menu.Item>
                  <Menu.Item active={part === 'unvalidated'} onClick={() => this.changePart('unvalidated')} >
                    <Icon name="ban" />
                    Invalidés
                  </Menu.Item>
                  <Menu.Item active={part === 'signaled'} onClick={() => this.changePart('signaled')} >
                    <Icon name="ban" />
                    Signalés
                  </Menu.Item>
                  <Menu.Item active={part === 'verified'} onClick={() => this.changePart('verified')} >
                    <Icon name="check" />
                    Vérifiés
                  </Menu.Item>
              </Menu>
            </Grid.Column>
          }
            {(part == "unverified" && !search_text) &&
              <AdminUnverifiedAlternatives/>
            }
            {(part == 'unvalidated' && !search_text) &&
              <AdminUnvalidatedAlternatives/>
            }
            {(part == 'signaled' && !search_text) && 
              <AdminSignaledAlternatives/>
            }
            {(part == 'verified' && !search_text) && 
              <AdminVerifiedAlternatives/>
            }
          {search_text &&
            <AdminSearchAlternatives search_text={search_text} />
          }
          </Grid>
        </Container>
      )
  }
}


