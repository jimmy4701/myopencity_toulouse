import React from 'react'
if(Meteor.isClient){
    import 'rc-steps/assets/index.css';
    import 'rc-steps/assets/iconfont.css';
}
import Steps, {Step} from 'rc-steps'
import styled from 'styled-components'

const Stepper = (props) => {
    return(
        <Steps current={props.budget_step ? props.budget_step : 0} labelPlacement="vertical">
            {props.steps.map((step, index) => {
                return <CustomStep active={index == props.active_step_index} title={step.title} description={step.description} onClick={() => props.onStepClick ? props.onStepClick(step.key) : null} />
            })}
        </Steps>
    )
}

export default Stepper

const CustomStep = styled(Step)`
    > .rc-steps-item-content {

        cursor: pointer;
        
        >.rc-steps-item-description {
            color: ${props => props.active ? "rgba(0,0,0, 0.65)" : "rgba(0, 0, 0, 0.43)"};
            text-align: center;
        }

        >.rc-steps-item-title {
            color: ${props => props.active ? "rgba(0,0,0, 0.65)" : "rgba(0, 0, 0, 0.43)"};
        }
    }

    &.rc-steps-item-process .rc-steps-item-icon {
        background-color: #c20012;
        border-color: #c20012;
    }

    &.rc-steps-item-finish .rc-steps-item-icon {
        border-color: #c20012;
        background-color: #c20012;
    }

    &.rc-steps-item-finish .rc-steps-item-tail:after {
        background-color: #c20012;
        height: 3px;
    }
`