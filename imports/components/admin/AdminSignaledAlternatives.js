import React, {Component} from 'react'
import { Grid, Header, Loader, Divider } from 'semantic-ui-react'
import AlternativePartial from '/imports/components/alternatives/AlternativePartial'
import { withTracker } from 'meteor/react-meteor-data'
import {Alternatives} from '/imports/api/alternatives/alternatives'
import {AlternativesAlerts} from '/imports/api/alternatives_alerts/alternatives_alerts'

export class AdminSignaledAlternatives extends Component {
    state = {
        page: 0,
        total_pages: 0
    }

    componentDidMount(){
        Meteor.call('alternatives.get_signaled', {page: 0}, (error, result) => {
            if(error){
                console.log('Erreur', error.message)
            }else{
                console.log('RESULT ALTERNATIVES', result)
                this.setState({...result})
            }
        })
    }

    reload = () => {
        Meteor.call('alternatives.get_signaled', {page: this.state.page}, (error, result) => {
            if(error){
                console.log('Erreur', error.message)
            }else{
                console.log('RESULT ALTERNATIVES', result)
                this.setState({...result})
            }
        })
    }

    render(){
        const {total_pages, page} = this.state
        const {alternatives, loading} = this.props

        if(!loading){
            return(
                <Grid stackable>
                    <Grid.Column width={16}>
                        <Header as='h3'>Avis signalés</Header>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        {alternatives.map(alternative => {
                            return <AlternativePartial 
                                key={alternative._id} 
                                onCancelSignalement={this.reload}
                                alternative={alternative} 
                                display_consult 
                                removable 
                                signaled/>
                        })}
                        {alternatives.length == 0 &&
                            <p>Aucun avis pour le moment</p>
                        }
                    </Grid.Column>
                </Grid>
            )
        }else{
            return <div>Chargement des avis</div>
        }
    }
}

export default AdminSignaledAlternativesContainer = withTracker(() => {
    const alertsPublication = Meteor.subscribe('alternatives_alerts.to_treat')
    const alerts = AlternativesAlerts.find({treated: false}).fetch()
    if(alerts){
        const alternatives_ids = alerts.map(alert => alert.alternative)
        const alternativesPublication = Meteor.subscribe('alternatives.by_ids', alternatives_ids)
        const alternatives = Alternatives.find({_id: {$in: alternatives_ids}}).fetch()
        const loading = !alertsPublication.ready() || !alternativesPublication.ready()
        return {
            loading,
            alternatives
        }
    }
    return {
        loading: true
    }
})(AdminSignaledAlternatives)