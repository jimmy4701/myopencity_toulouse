import React, {Component} from 'react'
import styled from 'styled-components'
import { Menu, Button } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import { BudgetConsultGeneralForm, BudgetConsultTerritoriesForm } from '/imports/components/budget_consults'

export default class BudgetConsultForm extends Component {
    state = {
        budget_consult: {
            territories: [],
            sub_territories: []
        },
        step: "global"
    }

    changeStep = (step) => this.setState({step})

    submitForm = () => {
        const {budget_consult} = this.state
        Meteor.call(`budget_consults.${this.props.budget_consult ? 'update' : 'insert'}`, budget_consult , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                toast.success(`Budget participatif ${this.props.budget_consult ? "modifié" : "créé"}`)
                if(this.props.onFormSubmit) this.props.onFormSubmit()
            }
        })
    }

    subFormSubmit = (budget_consult) => this.setState({budget_consult})

    render(){
        const { step, budget_consult } = this.state

        return(
            <MainContainer>
                <ActionsContainer>
                    <Menu fluid>
                        <Menu.Item onClick={() => this.changeStep('global')} active={step == 'global'}>Informations générales</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('territories')} active={step == 'territories'}>Territoires</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('design')} active={step == 'design'}>Apparence</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('propositions')} active={step == 'propositions'}>Propositions</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('agora')} active={step == 'agora'}>Agora</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('results')} active={step == 'results'}>Résultats</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('documents')} active={step == 'documents'}>Documents</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('settings')} active={step == 'settings'}>Configuration</Menu.Item>
                        <Menu.Item onClick={this.submit_form}>{this.props.budget_consult ? "Modifier" : "Créer"}</Menu.Item>
                    </Menu>
                </ActionsContainer>
                <PartsContainer>
                    {step == "global" &&
                        <BudgetConsultGeneralForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    }
                    {step == "territories" &&
                        <BudgetConsultTerritoriesForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
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