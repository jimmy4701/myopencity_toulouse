import React, {Component} from 'react'
import styled from 'styled-components'
import { Card, Button } from 'semantic-ui-react'
import { toast } from 'react-toastify'

export default class SubTerritoryPartial extends Component {
    state = {
        
    }

    remove = () => {
        const {sub_territory} = this.props

        Meteor.call('sub_territories.remove', sub_territory._id , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                toast.success("Le sous-territoire a été supprimé")
            }
        })
    }

    toggleState = (e, {name}) => this.setState({[name]: !this.state[name]})

    render(){
        const {sub_territory} = this.props
        const {removing} = this.state

        return(
            <Card>
                <Card.Content>
                    <Card.Header>{sub_territory.name}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    {!removing &&
                        <Button basic color='green' onClick={this.props.onEditClick}>
                            Modifier
                        </Button>
                    }
                        <Button basic color={!removing && "red"} onClick={this.toggleState} name="removing">
                            {removing ? "Annuler" : "Supprimer"}
                        </Button>
                        {removing &&
                            <Button onClick={this.remove} basic color="red">Confirmer suppression</Button>
                        }
                    </div>
                </Card.Content>
            </Card>
        )
    }
}