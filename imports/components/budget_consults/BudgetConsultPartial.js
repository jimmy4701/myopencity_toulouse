import React, {Component} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button, Card, Image } from 'semantic-ui-react'
import { truncate } from 'lodash'

export default class BudgetConsultPartial extends Component {
    state = {
        
    }

    toggleState = (e, {name}) => this.setState({[name]: !this.state[name]})

    render(){
        const {display_manage_buttons, removing} = this.state
        const { hide_buttons, budget_consult } = this.props

        return(
            <Card>
                <Link to={"/budget_consults/" + budget_consult.url_shorten}>
                    <Image src={budget_consult.image_url_mini ? budget_consult.image_url_mini : budget_consult.image_url} />
                </Link>
                <Card.Content>
                    <Card.Header>
                        {budget_consult.title}
                    </Card.Header>
                    <Card.Description>
                        {truncate(budget_consult.description, { length: 200, separator: ' ' })}
                    </Card.Description>
                </Card.Content>
                {!hide_buttons &&
                    <Card.Content className="center-align" extra>
                        <Link to={"/consults/" + budget_consult.url_shorten}>
                            <Button fluid>Consulter</Button>
                        </Link>
                        {Roles.userIsInRole(Meteor.userId(), ['admin', 'moderator']) &&
                            <div>
                                <Button fluid active={this.state.display_manage_buttons} onClick={this.toggleState} name="display_manage_buttons">Gérer</Button>
                                {display_manage_buttons &&
                                    <div>
                                        <Link to={"/admin/budgets/" + budget_consult._id + "/edit"}>
                                            <Button fluid>Modifier</Button>
                                        </Link>
                                        <Button onClick={this.toggleBudgetConsult} name="active" fluid>{budget_consult.active ? "Rendre inactif" : "Rendre actif"}</Button>
                                        <Button onClick={this.toggleLanding} fluid>{budget_consult.landing_display ? "Ne plus mettre en avant" : "Mettre en avant"}</Button>
                                        <Button name="removing" onClick={this.toggleState} color={!removing && "red"}>{removing ? "Annuler" : "Supprimer"}</Button>
                                        {removing && <Button color="red" onClick={this.remove}>Supprimer</Button>}
                                    </div>
                                }
                            </div>
                        }
                    </Card.Content>
                }
            </Card>
        )
    }
}

const MainContainer = styled.div`
    
`