import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Loader, Container } from 'semantic-ui-react';
import { Configuration } from '/imports/api/configuration/configuration';

export class About extends Component {

    componentDidMount(){
        window.scrollTo(0,0);
    }

    render() {
        const { loading, complete_configuration } = this.props

        if (!loading) {
            const { about_term, about } = complete_configuration

            return (
                <Grid stackable>
                    <Container>
                        <Grid.Column width={16} className="cgu_header">
                            <Header as='h2' className="wow fadeInUp">{about_term}</Header>
                        </Grid.Column>
                        <Grid.Column width={16} className="wow fadeInUp cgu_container">
                            <div dangerouslySetInnerHTML={{ __html: about }}></div>
                        </Grid.Column>

                    </Container>
                </Grid>
            );
        } else {
            return <Loader className="inline-block">Chargement des About d'utilisation</Loader>
        }
    }
}

export default AboutContainer = withTracker(() => {
    const completeConfigPublication = Meteor.isClient && Meteor.subscribe('configuration.with_about')
    const loading = Meteor.isClient && !completeConfigPublication.ready()
    const complete_configuration = Configuration.findOne()
    return {
        loading,
        complete_configuration
    }
})(About)