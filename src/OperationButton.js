import React from 'react'
import { ACTIONS } from './App'

function OperationButton({operation, dispatch}) {
  return (
    <button onClick={()=>dispatch({type: ACTIONS.CHOOSE_OPERATOR, payload: operation})}>
        {operation}
    </button>
  )
}

export default OperationButton