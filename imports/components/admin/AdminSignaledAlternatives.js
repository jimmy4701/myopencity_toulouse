import React, {Component} from 'react'
import { Grid, Header, Loader } from 'semantic-ui-react'
import AlternativePartial from '/imports/components/alternatives/AlternativePartial'
import { withTracker } from 'meteor/react-meteor-data'
import {Alternatives} from '/imports/api/alternatives/alternatives'
import {AlternativesAlerts} from '/imports/api/alternatives_alerts/alternatives_alerts'

export class AdminSignaledAlternatives extends Component {
    state = {
        page: 0,
        total_pages: 0
    }

    render(){
        const {loading, alternatives, alerts} = this.props

        if(!loading){
            return(
                <Grid stackable>
                    <Grid.Column width={16}>
                        <Header as='h3'>Alternatives signalées</Header>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        {alert.map(alert => {
                            const alternative = _.find(alternatives, o => o._id == alert.alternative)
                            return <AlternativePartial key={alternative._id} alternative={alternative} display_consult removable/>
                        })}
                        {alternatives.length == 0 &&
                            <p>Aucune alternative pour le moment</p>
                        }
                    </Grid.Column>
                </Grid>
            )
        }else{
            return <Loader inline>Chargement des alternatives</Loader>
        }
    }
}

export default AdminSignaledAlternativesContainer = withTracker(() => {
    const alertsPublication = Meteor.isClient && Meteor.subscribe('alternatives_alerts.not_treated')
    const alerts = AlternativesAlerts.find({treated: false}).fetch()
    if(alerts){
        const alternativesPublication = Meteor.isClient && Meteor.subscribe('alternatives.unverified')
        const loading = Meteor.isClient && (!alternativesPublication.ready() && !alertsPublication.ready())
        const alternatives_ids = alerts.map(alert => alert.alternative)
        const alternatives = Alternatives.find({_id: {$in: alternatives_ids}}).fetch()
        return {
            loading,
            alternatives,
            alerts
        }
    }else{
        return {loading: true}
    }
})(AdminSignaledAlternatives)