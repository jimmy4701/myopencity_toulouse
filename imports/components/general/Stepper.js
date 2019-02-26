import React from 'react'
if(Meteor.isClient){
    import 'rc-steps/assets/index.css';
    import 'rc-steps/assets/iconfont.css';
}
import Steps, {Step} from 'rc-steps'
import styled from 'styled-components'

const Stepper = (props) => {
    return(
        <Steps current={props.current_step ? props.current_step : 0} labelPlacement="vertical">
            {props.steps.map(step => {
                return <CustomStep title={step.title} description={step.description} />
            })}
        </Steps>
    )
}

export default Stepper

const CustomStep = styled(Step)`
    > .rc-steps-item-content {

        >.rc-steps-item-description {
            text-align: center;
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