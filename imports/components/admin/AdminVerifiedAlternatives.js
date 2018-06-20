import React, {Component} from 'react'
import { Grid, Header, Loader } from 'semantic-ui-react'
import AlternativePartial from '/imports/components/alternatives/AlternativePartial'
import { withTracker } from 'meteor/react-meteor-data'
import {Alternatives} from '/imports/api/alternatives/alternatives'

export class AdminVerifiedAlternatives extends Component {
    state = {
        page: 0,
        total_pages: 0
    }

    render(){
        const {loading, alternatives} = this.props

        if(!loading){
            return(
                <Grid stackable>
                    <Grid.Column width={16}>
                        <Header as='h3'>Avis non vérifiés</Header>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        {alternatives.map(alternative => {
                            return <AlternativePartial key={alternative._id} alternative={alternative} display_consult removable/>
                        })}
                        {alternatives.length == 0 &&
                            <p>Aucun avis pour le moment</p>
                        }
                    </Grid.Column>
                </Grid>
            )
        }else{
            return <Loader inline>Chargement des avis</Loader>
        }
    }
}

export default AdminVerifiedAlternativesContainer = withTracker(() => {
    const alternativesPublication = Meteor.isClient && Meteor.subscribe('alternatives.verified')
    const loading = Meteor.isClient && !alternativesPublication.ready()
    const alternatives = Alternatives.find({verified: true}).fetch()
    return {
        loading,
        alternatives
    }
})(AdminVerifiedAlternatives)