import React, {Component} from 'react'
import { Grid, Header, Container } from 'semantic-ui-react'
import {Line} from 'react-chartjs-2'
import _ from 'lodash'

export default class AdminStatistics extends Component {
    state = {
        statistics: []
    }

    componentWillMount(){
        Meteor.call('admin.get_users_statistics', (error, result) => {
            if(error){
                console.log('Erreur', error.message)
            }else{
                console.log('result', result)
                this.setState({statistics: result})
            }
        })
    }

    render(){
        const { statistics } = this.state

        const chartOptions = {
            legend: {
              display: true
            }
          }

        const stats = statistics.map(stat => {
            return {'label': moment(stat._id).format('DD.MM.YYYY'), count: stat.count, creation_date: moment(stat._id).format('YYYYMMDD')}
        })
        console.log('stats', stats)
        
        stats = _.orderBy(stats, 'creation_date', 'asc')
        console.log('stats', stats)

        const data = {
            labels: stats.map(stat => stat.label),
            datasets: [{
              label: "Inscriptions",
              data: stats.map(stat => stat.count)
            }]
        }
        
        

        return(
            <Container>
                <Grid stackable>
                    <Grid.Column width={16}>
                        <Header as='h3'>Statistiques de la plateforme</Header>
                        <Line
                            options={chartOptions}
                            height={100}
                            data={data} />
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}