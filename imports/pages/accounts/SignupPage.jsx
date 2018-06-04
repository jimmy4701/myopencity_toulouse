import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Grid, Header, Container, Image } from 'semantic-ui-react'
import SignupForm from '/imports/components/accounts/SignupForm'
import styled from 'styled-components'

class SignupPage extends Component {

  /*
    required params:
  */

  state = {

  }

  render() {
    const { global_image_url } = Meteor.isClient && Session.get('global_configuration')
    const { className } = this.props

    return (
      <Grid stackable className={className}>
        <Grid.Column width={16} className="mobile-padding">
          <Container>
            <Grid stackable centered className="wow fadeInUp main-container" verticalAlign="middle">
              <Grid.Column width={16} className="mobile-padding">
                <Header as="h1"><Image className="image" src={global_image_url} size="small" /> Inscription</Header>
                <SignupForm />
              </Grid.Column>
            </Grid>
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}

export default styled(SignupPage)`
  > div div .main-container {
    @media screen and (min-width: 990px) {
      padding: 0 14em !important;
    }
  }

  > div div div div .image {
    width: 5em !important;
  }
`