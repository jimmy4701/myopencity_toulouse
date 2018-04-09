import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Grid, Header, Button, Loader, Container, Icon} from 'semantic-ui-react'
import TerritoryPartial from '/imports/components/territories/TerritoryPartial'
import TerritoryForm from '/imports/components/territories/TerritoryForm'
import {Territories} from '/imports/api/territories/territories'
import { withTracker } from 'meteor/react-meteor-data'
import {Link} from 'react-router-dom'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'

const SortableList = SortableContainer(({items, onEditClick}) => {

  const ordered_items = _.sortBy(items, 'priority')
  return (
    <Grid stackable>
      {ordered_items.map((value, index) => (
        <Grid.Column width={4}>
          <SortableItem key={`item-${index}`} index={index} value={value} onEditClick={onEditClick} />
        </Grid.Column>
      ))}
    </Grid>
  )
})

const SortableItem = SortableElement(({value, onEditClick}) =>
  <TerritoryPartial territory={value} onEditClick={() => onEditClick(value)} />
)

export class AdminTerritoriesPage extends Component{

  /*
    required props:
      - none
  */

  state = {
    display_form: false,
    sorted_territories: []
  }

  componentWillReceiveProps(new_props){
    this.setState({sorted_territories: new_props.territories})
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    const new_territories = arrayMove(this.state.sorted_territories, oldIndex, newIndex)
    this.setState({sorted_territories: arrayMove(this.state.sorted_territories, oldIndex, newIndex)})
    _.each(new_territories, (territory, index) => {
      territory.priority = index
      Meteor.call('territories.update', territory, (error, result) => {
        if(error){
          console.log(error)
          Bert.alert({
            title: "Erreur lors de la modification de la priorité du territoire",
            message: error.reason,
            type: 'danger',
            style: 'growl-bottom-left',
          })
        }
      });
    })
  }

  toggleState = (e) => {
    this.setState({[e.target.name]: !this.state[e.target.name], editing_territory: null})
  }

  onSubmit = () => {
    this.setState({display_form: false, editing_territory: null})
  }

  editTerritory = (territory) => {
    this.setState({display_form: true, editing_territory: territory})
  }


  render(){
    const {territories, loading} = this.props
    const {display_form, editing_territory, sorted_territories} = this.state

    if(!loading){
      return(
        <Grid stackable className="wow fadeInLeft">
          <Grid.Column width={16} className="center-align">
            <Header as="h1">Gestion des territoires / quartiers</Header>
          </Grid.Column>
          <Grid.Column width={16}>
            <Container>
                <Button color={!display_form && "green"} onClick={this.toggleState} name="display_form" >{display_form ? "Annuler" : "Créer un nouveau territoire"}</Button>
                {display_form ?
                  <TerritoryForm territory={editing_territory} onSubmitForm={this.onSubmit} />
              :
                <Grid stackable>
                  <SortableList axis="xy" items={sorted_territories} onSortEnd={this.onSortEnd} onEditClick={this.editTerritory} />
                </Grid>
              }
            </Container>
          </Grid.Column>
        </Grid>
      )
    }else{
      return <Loader className="inline-block">Chargement des consultations</Loader>
    }
  }
}

export default AdminTerritoriesPageContainer = withTracker(() => {
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.all')
  const loading = Meteor.isClient && !territoriesPublication.ready()
  const territories = Territories.find({}, {sort: {priority: 1}}).fetch()
  return {
    loading,
    territories
  }
})(AdminTerritoriesPage)
