import React, {Component} from 'react'
import styled from 'styled-components'
import { Menu, Button } from 'semantic-ui-react'

export default class BudgetConsultForm extends Component {
    state = {
        budget_consult: {},
        step: "global"
    }

    changeStep = (step) => this.setState({step})

    render(){
        const { step } = this.state

        return(
            <MainContainer>
                <ActionsContainer>
                    <Menu fluid>
                        <Menu.Item onClick={() => this.changeStep('global')} active={step == 'global'}>Informations générales</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('territories')} active={step == 'territories'}>Territoires</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('design')} active={step == 'design'}>Apparence</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('parts')} active={step == 'parts'}>Parties / Contenu</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('documents')} active={step == 'documents'}>Documents</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('settings')} active={step == 'settings'}>Configuration</Menu.Item>
                        <Menu.Item onClick={this.submit_form}>{this.props.budget_consult ? "Modifier" : "Créer"}</Menu.Item>
                    </Menu>
                </ActionsContainer>
                <PartsContainer>
                    {step == "global" &&
                        <h1>GLOBAL</h1>
                    }
                    {step == "territories" &&
                        <h1>territories</h1>
                    }
                    {step == "design" &&
                        <h1>design</h1>
                    }
                    {step == "parts" &&
                        <h1>parts</h1>
                    }
                    {step == "documents" &&
                        <h1>documents</h1>
                    }
                    {step == "settings" &&
                        <h1>settings</h1>
                    }
                </PartsContainer>
            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const ActionsContainer = styled.div`
    display: flex;
    width: 100%;
`

const PartsContainer = styled.div`
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    width: 100%;
`