import React, {Component} from 'react'
import { Grid, Header, Container } from 'semantic-ui-react'
import {Line} from 'react-chartjs-2'

export default class AdminStatistics extends Component {
    state = {
        
    }

    componentWillMount(){
        Meteor.call('admin.get_users_statistics', (error, statistics) => {
            if(error){
                console.log('Erreur', error.message)
            }else{
                this.setState({statistics})
            }
        })
    }

    render(){
        const { statistics } = this.state
        return(
            <Container>
                <Grid stackable>
                    <Grid.Column width={16}>
                        <Header as='h3'>Statistiques de la plateforme</Header>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}