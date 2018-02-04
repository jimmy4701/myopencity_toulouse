import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Header, Loader, Button, Card, Image } from 'semantic-ui-react'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import { Consults } from '/imports/api/consults/consults'
import { Territories } from '/imports/api/territories/territories'
import { Link } from 'react-router-dom'

export class TerritoriesPage extends TrackerReact(Component) {

    /*
      required props:
        - none
    */

    constructor(props) {
        super(props);
        this.state = {
            show_ended_consults: false
        }
    }

    toggleState(attr, e) {
        let state = this.state
        state[attr] = !state[attr]
        this.setState(state)
    }

    render() {
        const { territories, loading } = this.props
        const { navbar_color } = Meteor.isClient && Session.get('global_configuration')
        if (!loading) {
            return (
                <Grid className="wow fadeInUp" stackable>
                    <Grid.Column width={16} className="territory-consults-header">
                        <Header as="h1" className="wow fadeInUp territory-name" style={{ color: navbar_color }}>Les Quartiers</Header>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Card.Group>

                            {territories.map((territory, index) => {
                                return (
                                    <Card key={territory._id}>
                                        <Image src={territory.image_url} />
                                        <Card.Content>
                                            <Card.Header>{territory.name}</Card.Header>
                                            <Card.Meta>Élu/Élue: {territory.official_user_name}</Card.Meta>
                                        </Card.Content>
                                        <Card.Content extra>
                                        <Link to={"/territory/" + territory.shorten_url + "/consults" }>
                                            <Button content="Consultations" />
                                        </Link>
                                        <Link to={"/territory/" + territory.shorten_url + "/projects" }>
                                            <Button content="Propositions" />
                                        </Link>
                                        </Card.Content>
                                    </Card>
                                )
                            })}
                        </Card.Group>

                    </Grid.Column>
                </Grid>
            )
        } else {
            return <Loader className="inline-block">Chargement des quartiers</Loader>
        }
    }
}

export default TerritoriesPageContainer = createContainer(({ match }) => {

    const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
    const loading = Meteor.isClient && !territoriesPublication.ready()
    const territories = Territories.find({ active: true }, {sort: {name: 1}}).fetch()
    return {
        loading,
        territories
    }

}, TerritoriesPage)
