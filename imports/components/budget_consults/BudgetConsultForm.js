import React, {Component} from 'react'
import styled from 'styled-components'
import { Menu, Button } from 'semantic-ui-react'
import { toast } from 'react-toastify'

import BudgetConsultGeneralForm from '/imports/components/budget_consults/form_parts/BudgetConsultGeneralForm'
import BudgetConsultDesignForm from '/imports/components/budget_consults/form_parts/BudgetConsultDesignForm'
import BudgetConsultTerritoriesForm from '/imports/components/budget_consults/form_parts/BudgetConsultTerritoriesForm'
import BudgetConsultPropositionForm from '/imports/components/budget_consults/form_parts/BudgetConsultPropositionForm'
import BudgetConsultVotesForm from '/imports/components/budget_consults/form_parts/BudgetConsultVotesForm'
import BudgetConsultResultsForm from '/imports/components/budget_consults/form_parts/BudgetConsultResultsForm'
import BudgetConsultDocumentsForm from '/imports/components/budget_consults/form_parts/BudgetConsultDocumentsForm'
import BudgetConsultConfigurationForm from '/imports/components/budget_consults/form_parts/BudgetConsultConfigurationForm'
import BudgetConsultAgoraForm from '/imports/components/budget_consults/form_parts/BudgetConsultAgoraForm'

export default class BudgetConsultForm extends Component {
    state = {
        budget_consult: {
            territories: [],
            sub_territories: [],
            propositions_active: true,
            votes_active: true,
            propositions_step_name: "Propositions",
            agora_step_name: "Agora",
            analysis_step_name: "Analyse technique",
            votes_step_name: "Votes",
            results_step_name: "Résultats",
            step: "propositions",
            attached_files: [],
            available_votes: 6,
            propositions_max: 1
        },
        step: "global"
    }

    componentWillMount(){
        const {budget_consult} = this.props
        if(budget_consult) this.setState({budget_consult})
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
                        {/* <Menu.Item onClick={() => this.changeStep('analysis')} active={step == 'analysis'}>Analyse</Menu.Item> */}
                        <Menu.Item onClick={() => this.changeStep('votes')} active={step == 'votes'}>Votes</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('results')} active={step == 'results'}>Résultats</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('documents')} active={step == 'documents'}>Documents</Menu.Item>
                        <Menu.Item onClick={() => this.changeStep('settings')} active={step == 'settings'}>Configuration</Menu.Item>
                        <CustomMenuItem onClick={this.submitForm}>{this.props.budget_consult ? "Modifier" : "Créer"}</CustomMenuItem>
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
                        <BudgetConsultDesignForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    }
                    {step == "propositions" &&
                        <BudgetConsultPropositionForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    }
                    {step == "agora" &&
                        <BudgetConsultAgoraForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    }
                    {/* {step == "analysis" &&
                        <BudgetConsultAnalysisForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    } */}
                    {step == "votes" &&
                        <BudgetConsultVotesForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    }
                    {step == "results" &&
                        <BudgetConsultResultsForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    }
                    {step == "documents" &&
                        <BudgetConsultDocumentsForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
                    }
                    {step == "settings" &&
                        <BudgetConsultConfigurationForm budget_consult={budget_consult} onFormSubmit={this.subFormSubmit} />
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

const CustomMenuItem = styled(Menu.Item)`
    cursor: pointer;
    background-color: #00a611 !important;
    color: white !important;
`