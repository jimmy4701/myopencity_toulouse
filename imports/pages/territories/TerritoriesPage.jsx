import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {createContainer} from 'meteor/react-meteor-data'
import {
    Grid,
    Header,
    Loader,
    Button,
    Card,
    Image,
    Container
} from 'semantic-ui-react'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import {Consults} from '/imports/api/consults/consults'
import {Territories} from '/imports/api/territories/territories'
import {Configuration} from '/imports/api/configuration/configuration'
import {Link} from 'react-router-dom'
import _ from 'lodash'

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
        const {territories, loading} = this.props
        const {navbar_color, project_term, consults_term, territories_title, navbar_projects, territories_explain, territories_display_explain} = this.props.global_configuration
        if (!loading) {
            return (
                <Container>
                    <Grid className="wow fadeInUp" stackable>
                        <Grid.Column width={16} className="territory-consults-header">
                            <Header
                                as="h1"
                                className="wow fadeInUp territory-name"
                                style={{
                                color: navbar_color
                            }}>{territories_title}</Header>
                            {territories_display_explain &&
                                <div className="dangerous" dangerouslySetInnerHTML={{__html: territories_explain }} />
                            }
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Grid stackable>
                                    {territories.map((territory, index) => {
                                        return (
                                            <Grid.Column key={territory._id} className="center-align" width={4}>
                                                <Card className="inline-block">
                                                    <Image src={territory.image_url_mini ? territory.image_url_mini : territory.image_url}/>
                                                    <Card.Content>
                                                        <Card.Header>{territory.name}</Card.Header>
                                                        <Card.Meta>Maire de quartier : {territory.official_user_name}</Card.Meta>
                                                    </Card.Content>
                                                    <Card.Content extra>
                                                        <Link to={"/territory/" + territory.shorten_url + "/consults"}>
                                                            <Button content={_.capitalize(consults_term)}/>
                                                        </Link>
                                                        {territory.projects_active && navbar_projects &&
                                                            <Link to={"/territory/" + territory.shorten_url + "/projects"}>
                                                                <Button content={_.capitalize(project_term) + "s"}/>
                                                            </Link>
                                                        }
                                                    </Card.Content>
                                                </Card>
                                            </Grid.Column>
                                        )
                                    })}
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </Container>
            )
        } else {
            return <Loader className="inline-block">Chargement des quartiers</Loader>
        }
    }
}

export default TerritoriesPageContainer = createContainer(({match}) => {

    const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
    const configurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
    const loading = Meteor.isClient && (!territoriesPublication.ready() && !configurationPublication.ready())
    const territories = Territories.find({
        active: true
    }, {
        sort: {
            priority: 1
        }
    }).fetch()
    const global_configuration = Configuration.findOne()
    return {loading, territories, global_configuration}

}, TerritoriesPage)
