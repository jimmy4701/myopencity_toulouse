import React, { Component } from 'react';
import { Consults } from '/imports/api/consults/consults';
import { ConsultParts } from '/imports/api/consult_parts/consult_parts';
import { Configuration } from '/imports/api/configuration/configuration';
import { Territories } from '/imports/api/territories/territories';
import { Grid, Header, Image, Loader, Container, Divider, Statistic } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data'
import moment from 'moment'
import _ from 'lodash'
import Helmet from 'react-helmet'

export class AdminConsultSummary extends Component {
    render() {
        const { loading, consult, consult_parts, configuration } = this.props
        const actual_date = moment().format('DD.MM.YYYY')
        
        if (!loading) {
            const { global_image_url, navbar_color, main_title } = configuration

            return (
                <Container>
                    <Helmet>
                        <title>Compte rendu de consultation du {actual_date}</title>
                    </Helmet>
                    <Grid stackable style={{marginBottom: "15em"}}>
                        <Grid.Column width={16} className="center-align">
                            <Image src={global_image_url} inline size="medium" />
                            <Header as='h1'>{main_title}</Header>
                            <Header as='h2'>Compte rendu de consultation</Header>
                            <p>Généré le {actual_date}</p>
                        </Grid.Column>
                            <Grid.Column width={16}>
                                <Header as='h2' style={{backgroundColor: navbar_color, padding: "1em", color: "white"}}>{consult.title}</Header>
                                <p>Créée le {moment(consult.created_at).format('DD.MM.YYYY à HH:mm')}</p>
                                <Grid stackable>
                                    {consult_parts.map((part, part_index) => {
                                        const vote_values = _.orderBy(part.vote_values, ['counter'], ['desc'])
                                        const total_votes = _.sumBy(vote_values, (o) => {return o.counter})
                                        return (
                                            <Grid.Column width={16}>
                                                <Divider horizontal style={{backgroundColor: "rgb(228, 228, 228)"}}><Header as='h3' style={{color: navbar_color}}>{part.title}</Header></Divider>
                                                <Header as='h4'>Question : {part.question}</Header>
                                                <Grid stackable>
                                                    {vote_values.map((vote_value, vote_index) => {
                                                        return (
                                                            <Grid.Column width={8}>
                                                                <Statistic horizontal>
                                                                    <Statistic.Value>{vote_value.counter}</Statistic.Value>
                                                                    <Statistic.Label>{vote_value.vote_value} <span style={{color: navbar_color}}>({vote_value.counter > 0 ?_.round((vote_value.counter*100)/total_votes, 2) : 0} %)</span></Statistic.Label>
                                                                </Statistic>
                                                            </Grid.Column>
                                                        )
                                                    })}
                                                </Grid>
                                            </Grid.Column>
                                        )
                                    })}
                                </Grid>
                            </Grid.Column>
                    </Grid>
                </Container>
            );
        } else {
            return <Loader className="inline-block">Chargement du compte rendu de consultation</Loader>
        }
    }
}

export default AdminConsultSummaryContainer = createContainer(({match}) => {
    const {shorten_url} = match.params
    const consultPublication = Meteor.isClient && Meteor.subscribe('consult.admin_by_shorten_url', shorten_url)
    const consult = Consults.findOne({url_shorten: shorten_url})
    if(consult){
        const consultPartsPublication = Meteor.isClient && Meteor.subscribe('consult_parts.by_consult_url_shorten', shorten_url)
        const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.by_ids', consult.territories)
        const configurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
        const loading = Meteor.isClient && (!configurationPublication.ready() || !territoriesPublication.ready() || !consultPublication.ready() || !consultPartsPublication.ready())
        const territories = Territories.find({_id: {$in: consult.territories}}).fetch()
        const consult_parts = ConsultParts.find({consult_url_shorten: shorten_url, active: true}).fetch()
        const configuration = Configuration.findOne()
        return {
            loading,
            consult,
            consult_parts,
            territories,
            configuration
        }
    }else{
        return {loading: true}
    }
}, AdminConsultSummary)