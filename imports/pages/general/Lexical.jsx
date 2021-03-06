import React, {Component} from 'react'
import { Grid, Container } from 'semantic-ui-react'
import { Configuration } from '/imports/api/configuration/configuration'
import { withTracker } from 'meteor/react-meteor-data'

class Lexical extends Component {
    state = {
        
    }

    render(){

        const {global_configuration, loading} = this.props

        if(!loading){
            const {
                lexical_page_content
              } = global_configuration
            return(
                <Grid stackable>
                    <Grid.Column width={16} className="wow fadeInUp">
                        <Container>
                            <div className="dangerous" dangerouslySetInnerHTML={{__html: lexical_page_content }} />
                        </Container>
                    </Grid.Column>
                </Grid>
            )
        }else{
            return <div></div>
        }
    }
}

export default LexicalContainer = withTracker(() => {
    const globalConfigurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
    const loading = Meteor.isClient && !globalConfigurationPublication.ready()
    const global_configuration = Configuration.findOne()
    return {
        loading,
        global_configuration
    }
  })(Lexical)