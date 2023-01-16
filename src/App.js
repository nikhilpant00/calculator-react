import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./app.css"

const initialState={
  prevOperand: "",
  currOperand: "",
  operator: ""
};

export const ACTIONS={
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATOR: "choose-operator",
  CLEAR: "clear",
  EVALUATE: "evaluate"
}

const evaluate= ({currOperand, prevOperand, operator})=>{
  const curr= parseFloat(currOperand);
  const prev= parseFloat(prevOperand);
  if(isNaN(curr) && isNaN(prev)) return "";
  let computation=0;
  switch(operator){
    case "+":  computation= prev+curr;
    case "-":  computation= prev-curr;
    case "*":  computation= prev*curr;
    case "÷":  computation= prev/curr;
  }
  return computation.toString();
}

const reducer= (CurrState, {type, payload})=>{
  switch(type){

    case ACTIONS.ADD_DIGIT:
      if(CurrState.currOperand){
        if(CurrState.overWrite) return {...CurrState, currOperand: payload, overWrite: false};
        if(CurrState.currOperand==="0" && payload.digit==="0")
          return CurrState;
        if(payload.digit==="." && CurrState.currOperand.includes("."))
          return CurrState;  
      }
      return {
        ...CurrState,
        currOperand: `${CurrState.currOperand || ""}${payload}`
      }

    case ACTIONS.CLEAR:
      return initialState;  
    
    case ACTIONS.CHOOSE_OPERATOR:
      if(!CurrState.currOperand && !CurrState.prevOperand)
        return initialState;
      if(CurrState.currOperand && CurrState.prevOperand){
        return {
          prevOperand: evaluate(CurrState),
          currOperand: "",
          operator: payload,
        }
      }
      if(CurrState.currOperand)  
        return {
          prevOperand: CurrState.currOperand,
          currOperand: "",
          operator: payload,
        }  
      if(CurrState.prevOperand && !CurrState.currOperand)
        return {
          ...CurrState,
          operator: payload,
        } 
        
    case ACTIONS.EVALUATE:
      if(!CurrState.currOperand && !CurrState.prevOperand)
        return initialState;
      if(CurrState.currOperand && CurrState.prevOperand)
        return {
          currOperand: evaluate(CurrState),
          prevOperand: "",
          operator: "",
          overWrite: true,
        }
      return CurrState;  
    
    case ACTIONS.DELETE_DIGIT:
      if(CurrState.overWrite) return {...CurrState, currOperand: "", overWrite: false};
      if(CurrState.prevOperand && !CurrState.currOperand) return CurrState;
      return (CurrState.currOperand)? {...CurrState, currOperand: CurrState.currOperand.slice(0,-1)} : initialState;

    default:
      return CurrState;  

  }
}

const INEGER_FORMATTER= new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0,
})
function formatOperand(operand){
  if(operand==null|| operand=="") return null;
  const [integer, decimal]= operand.split(".");
  if(decimal== null) return INEGER_FORMATTER.format(integer);
  return `${INEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  

  const [{currOperand, prevOperand, operator},dispatch]= useReducer(reducer, {});


  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-output">{formatOperand(prevOperand)} {operator}</div>
        <div className="curr-output">{formatOperand(currOperand)}</div>
      </div>
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.CLEAR})}>
        AC
      </button>
      <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>
        DEL
      </button>
      <OperationButton operation={'÷'} dispatch={dispatch}/>
      <DigitButton digit={'1'} dispatch={dispatch}/>
      <DigitButton digit={'2'} dispatch={dispatch}/>
      <DigitButton digit={'3'} dispatch={dispatch}/>
      <OperationButton operation={'*'} dispatch={dispatch}/>
      <DigitButton digit={'4'} dispatch={dispatch}/>
      <DigitButton digit={'5'} dispatch={dispatch}/>
      <DigitButton digit={'6'} dispatch={dispatch}/>
      <OperationButton operation={'+'} dispatch={dispatch}/>
      <DigitButton digit={'7'} dispatch={dispatch}/>
      <DigitButton digit={'8'} dispatch={dispatch}/>
      <DigitButton digit={'9'} dispatch={dispatch}/>
      <OperationButton operation={'-'} dispatch={dispatch}/>
      <DigitButton digit={'.'} dispatch={dispatch}/>
      <DigitButton digit={'0'} dispatch={dispatch}/>
      <button className="span-two" onClick={()=>dispatch({type: ACTIONS.EVALUATE})}>
        =
      </button>
    </div>
  );
}

export default App;
