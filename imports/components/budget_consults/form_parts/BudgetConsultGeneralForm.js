import React, {Component} from 'react'
import styled from 'styled-components'
import { Form, Divider } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'

export default class BudgetConsultGeneralForm extends Component {
    state = {
        budget_consult: {}
    }

    componentWillMount(){
        const {budget_consult} = this.props
        this.setState({budget_consult})
    }

    componentWillUnmount(){
        const {budget_consult} = this.state
        this.props.onFormSubmit(budget_consult)
    }

    handleDateChange = (date, name) => {
        let {budget_consult} = this.state
        budget_consult[name] = date.toDate()
        this.setState({budget_consult})
    }

    handleChange = (e, {name, value}) => {
        let { budget_consult } = this.state
        budget_consult[name] = value
        this.setState({budget_consult})
    }

    handleBudgetStep = (step) => {
        let { budget_consult } = this.state
        budget_consult.step = step
        this.setState({budget_consult})
    }

    resetStepDate = (attr) => {
        const { budget_consult } = this.state
        budget_consult[attr] = null
        this.setState({budget_consult})
    }

    render(){
        const { budget_consult } = this.state

        return(
            <MainContainer>
                <h3>Phase de consultation</h3>
                <PhasesContainer>
                    <PhasePartial active={budget_consult.step == "propositions"} onClick={() => this.handleBudgetStep("propositions")}>Propositions</PhasePartial>
                    <PhasePartial active={budget_consult.step == "agora"} onClick={() => this.handleBudgetStep("agora")}>Agora</PhasePartial>
                    <PhasePartial active={budget_consult.step == "analysis"} onClick={() => this.handleBudgetStep("analysis")}>Analyse</PhasePartial>
                    <PhasePartial active={budget_consult.step == "votes"} onClick={() => this.handleBudgetStep("votes")} >Votes</PhasePartial>
                    <PhasePartial active={budget_consult.step == "results"} onClick={() => this.handleBudgetStep("results")} >Résultats</PhasePartial>
                </PhasesContainer>
                <Divider />
                <h3>Dates des différentes phases</h3>
                <Form>
                    <CustomFormGroup>
                        <Form.Field>
                            <label>Début de la phase de propositions</label>
                            <DatePicker
                                selected={moment(budget_consult.propositions_start_date)}
                                dateFormat="DD/MM/YYYY"
                                onChange={(date) => this.handleDateChange(date, "propositions_start_date")}
                                name="propositions_start_date"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Fin de la phase de propositions</label>
                            <DatePicker
                                selected={moment(budget_consult.propositions_end_date)}
                                dateFormat="DD/MM/YYYY"
                                name="propositions_end_date"
                                onChange={(date) => this.handleDateChange(date, "propositions_end_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Début de la phase d'agora</label>
                            <DatePicker
                                selected={moment(budget_consult.agora_start_date)}
                                dateFormat="DD/MM/YYYY"
                                name="agora_start_date"
                                onChange={(date) => this.handleDateChange(date, "agora_start_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Fin de la phase d'agora</label>
                            <DatePicker
                                selected={moment(budget_consult.agora_end_date)}
                                dateFormat="DD/MM/YYYY"
                                name="agora_end_date"
                                onChange={(date) => this.handleDateChange(date, "agora_end_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Début de la phase d'analyse technique</label>
                            <DatePicker
                                selected={moment(budget_consult.analysis_start_date)}
                                dateFormat="DD/MM/YYYY"
                                name="analysis_start_date"
                                onChange={(date) => this.handleDateChange(date, "analysis_start_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Fin de la phase d'analyse technique</label>
                            <DatePicker
                                selected={moment(budget_consult.analysis_end_date)}
                                dateFormat="DD/MM/YYYY"
                                name="analysis_end_date"
                                onChange={(date) => this.handleDateChange(date, "analysis_end_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Début de la phase de votes</label>
                            <DatePicker
                                selected={moment(budget_consult.votes_start_date)}
                                dateFormat="DD/MM/YYYY"
                                name="votes_start_date"
                                onChange={(date) => this.handleDateChange(date, "votes_start_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Fin de la phase de votes</label>
                            <DatePicker
                                selected={moment(budget_consult.votes_end_date)}
                                dateFormat="DD/MM/YYYY"
                                name="votes_end_date"
                                onChange={(date) => this.handleDateChange(date, "votes_end_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Début de la phase de résultats</label>
                            <DatePicker
                                selected={moment(budget_consult.results_start_date)}
                                dateFormat="DD/MM/YYYY"
                                name="results_start_date"
                                onChange={(date) => this.handleDateChange(date, "results_start_date")}
                            />
                        </Form.Field>
                    </CustomFormGroup>
                    <Form.Input 
                        label="Titre de la consultation"
                        onChange={this.handleChange}
                        value={budget_consult.title}
                        name="title"
                        required
                    />
                    <Form.Input 
                        label="Budget total de la consultation (enveloppe)"
                        onChange={this.handleChange}
                        value={budget_consult.total_budget}
                        name="total_budget"
                        type="number"
                        step="0.01"
                    />
                    <Form.TextArea 
                        label="Description de la consultation"
                        onChange={this.handleChange}
                        value={budget_consult.description}
                        name="description"
                        required
                    />
                    <p><span style={{color: "red"}}>*</span> Champs obligatoires</p>
                </Form>
            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    
`

const CustomFormGroup = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

const PhasesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;    
`

const PhasePartial = styled.div`
    flex: 1;
    cursor: pointer;
    background-color: ${props => props.active ? "#c20012" : "white"};
    border: 1px solid #c20012;
    padding: 1em;
    margin: 1em;
    border-radius: 0.3em;
    color: ${props => props.active ? "white" : "black"};
`