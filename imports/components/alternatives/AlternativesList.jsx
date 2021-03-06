import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Alternatives} from '/imports/api/alternatives/alternatives'
import {Grid, Header, Input, Feed, Image, Loader} from 'semantic-ui-react'
import AlternativePartial from '/imports/components/alternatives/AlternativePartial'
import AlternativePresentation from '/imports/components/alternatives/AlternativePresentation'

export class AlternativesList extends TrackerReact(Component){

  /*
    required props:
      - consult_part: Object
      - page: Number
      - results_size: Number
      - search_term: String
  */

  constructor(props){
    super(props);
    this.state = {
      selected_alternative: null
    }
  }

  select_alternative(selected_alternative){
    this.setState({selected_alternative})
    if(this.props.on_displaying_alternative){
      this.props.on_displaying_alternative(true)
    }
  }

  hide_selected_alternative(){
    this.setState({selected_alternative: null})
    if(this.props.on_displaying_alternative){
      this.props.on_displaying_alternative(false)
    }
  }

  render(){
    const {alternatives} = this.props
    const {selected_alternative} = this.state

      return(
        <Grid stackable centered>
            <Grid.Column width={16}>
              <Grid stackable stretched>
                    {_.sortBy(alternatives, function(al){return -al.created_at}).map((alternative, index) => {
                      return <AlternativePartial alternative={alternative} key={index} />
                    })}
              </Grid>
            </Grid.Column>
        </Grid>
      )
  }
}

export default AlternativesListContainer = createContainer(({ consult_part, page, results_size, search_term }) => {
  const skip_entities = page * results_size
  const alternatives = Alternatives.find({validated: true, consult_part: consult_part._id, content: {$regex: search_term}}, {limit: results_size, skip: skip_entities, sort: {created_at: -1}}).fetch()
  return {
    alternatives
  }
}, AlternativesList)
