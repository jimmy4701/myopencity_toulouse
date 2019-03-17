import React, {Component} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button, Card, Image } from 'semantic-ui-react'
import { truncate } from 'lodash'
import { toast } from 'react-toastify'

export default class BudgetConsultPartial extends Component {
    state = {
        
    }

    toggle = (attribute) => {
        Meteor.call(`budget_consults.toggle`, {id: this.props.budget_consult._id, attribute} , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }
        })
    }

    remove = () => {
        Meteor.call('budget_consults.remove', this.props.budget_consult._id , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                toast.success("Budget participatif supprimé")
            }
        })
    }

    toggleState = (e, {name}) => this.setState({[name]: !this.state[name]})

    render(){
        const {display_manage_buttons, removing} = this.state
        const { hide_buttons, budget_consult } = this.props

        return(
            <MainContainer>
                <Link to={"/budget_consults/" + budget_consult.url_shorten}>
                    <Image src={budget_consult.image_url_mini ? budget_consult.image_url_mini : budget_consult.image_url} />
                </Link>
                <Card.Content className="center-align">
                    <Card.Header>
                        {budget_consult.title}
                    </Card.Header>
                    <Card.Description>
                        {truncate(budget_consult.description, { length: 200, separator: ' ' })}
                    </Card.Description>
                </Card.Content>
                {!hide_buttons &&
                    <Card.Content className="center-align" extra>
                        <Link to={"/budgets/" + budget_consult.url_shorten}>
                            <Button fluid>Consulter</Button>
                        </Link>
                        {Meteor.isClient && Roles.userIsInRole(Meteor.userId(), ['admin', 'moderator']) &&
                            <div>
                                <Button fluid active={this.state.display_manage_buttons} onClick={this.toggleState} name="display_manage_buttons">Gérer</Button>
                                {display_manage_buttons &&
                                    <div>
                                        <Link to={"/admin/budgets/" + budget_consult._id + "/edit"}>
                                            <Button fluid>Modifier</Button>
                                        </Link>
                                        <Link to={"/admin/budgets/" + budget_consult._id + "/propositions"}>
                                            <Button fluid>Propositions</Button>
                                        </Link>
                                        <Button onClick={() => this.toggle("visible")} fluid>{budget_consult.visible ? "Rendre invisible" : "Rendre visible"}</Button>
                                        <Button onClick={() => this.toggle("landing_display")} fluid>{budget_consult.landing_display ? "Ne plus mettre en avant" : "Mettre en avant"}</Button>
                                        <Button onClick={() => this.toggle("active")} fluid>{budget_consult.active ? "Désactiver" : "Activer"}</Button>
                                        <Button onClick={() => this.toggle("ended")} fluid>{budget_consult.ended ? "Lancer" : "Stopper"}</Button>
                                        <Button name="removing" onClick={this.toggleState} color={!removing && "red"}>{removing ? "Annuler" : "Supprimer"}</Button>
                                        {removing && <Button color="red" onClick={this.remove}>Supprimer</Button>}
                                    </div>
                                }
                            </div>
                        }
                    </Card.Content>
                }
            </MainContainer>
        )
    }
}

const MainContainer = styled(Card)`
    height: 100%;
`