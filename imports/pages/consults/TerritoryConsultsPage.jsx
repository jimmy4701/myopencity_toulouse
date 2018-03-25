import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Header, Loader, Button } from 'semantic-ui-react'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import { Consults } from '/imports/api/consults/consults'
import { Territories } from '/imports/api/territories/territories'

export class TerritoryConsultsPage extends TrackerReact(Component) {

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
        const { consults, ended_consults, territory, loading } = this.props
        const { show_ended_consults } = this.state
        const { navbar_color } = Meteor.isClient && Session.get('global_configuration')
        const { ended_consults_title, consults_title, consults_no_consults } = Meteor.isClient && Session.get('global_configuration')

        if (!loading) {
            return (
                <Grid className="wow fadeInUp" stackable>
                    <Grid.Column width={16} className="territory-consults-header">
                        <Header as="h1" className="wow fadeInUp territory-name" style={{color: navbar_color}}>{territory.name}</Header>
                        <Header as="h3" className="wow fadeInDown territory-label" data-wow-delay="0.5s">{!show_ended_consults ? consults_title : ended_consults_title}</Header>
                        {ended_consults.length > 0 ?
                            <Button size="mini" onClick={(e) => { this.toggleState('show_ended_consults', e) }}>Voir les consultations {!show_ended_consults ? "terminées" : "en cours"}</Button>
                            : ''}
                    </Grid.Column>
                    {!show_ended_consults ?
                        <Grid.Column width={16}>
                            {consults.length == 0 ?
                                <Header className="center-align" as="h3">{consults_no_consults}</Header>
                                :
                                <Grid stackable>
                                    {consults.map((consult, index) => {
                                        return (
                                            <Grid.Column width={4} className="center-align">
                                                <ConsultPartial className="wow fadeInUp" consult={consult} />
                                            </Grid.Column>
                                        )
                                    })}
                                </Grid>
                            }
                        </Grid.Column>
                        :
                        <Grid.Column width={16}>
                            {ended_consults.length == 0 ?
                                <Header className="center-align" as="h3">Aucune consultation terminée actuellement</Header>
                                :
                                <Grid stackable>
                                    {ended_consults.map((consult, index) => {
                                        return (
                                            <Grid.Column width={4} className="center-align">
                                                <ConsultPartial className="wow fadeInUp" consult={consult} />
                                            </Grid.Column>
                                        )
                                    })}
                                </Grid>
                            }
                        </Grid.Column>
                    }
                </Grid>
            )
        } else {
            return <Loader className="inline-block">Chargement des consultations</Loader>
        }
    }
}

export default TerritoryConsultsPageContainer = createContainer(({ match }) => {
    const { shorten_url } = match.params
    const territoryPublication = Meteor.isClient && Meteor.subscribe('territories.by_shorten_url', shorten_url )
    const territory = Territories.findOne({shorten_url, active: true})
    if(territory){
        const consultsPublication = Meteor.isClient && Meteor.subscribe('consults.by_territory', territory._id)
        const loading = Meteor.isClient && (!territoryPublication.ready() || !consultsPublication.ready())
        const consults = Consults.find({ visible: true, ended: false, territories: territory._id }).fetch()
        const ended_consults = Consults.find({ visible: true, ended: true, territories: territory._id }, {sort: {title: 1}}).fetch()
        return {
            loading,
            consults,
            ended_consults,
            territory
        }
    }else{
        return {loading: true}
    }
}, TerritoryConsultsPage)
