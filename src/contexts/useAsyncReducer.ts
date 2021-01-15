import { useCallback, useState } from "react"

const useAsyncReducer = (reducer: any, initialState = {}) => {
  const [state, setState] = useState(initialState)

  const dispatch = useCallback(async (action: any) => {
    console.log('state', state);

    const result = reducer(state, action)
    console.log('result', result);
    if (typeof result.then === "function") {
        console.log('typeof result.then', typeof result.then);
        
      try {
        const newState = await result
        console.log('newState', newState);
        
        setState(newState)
      } catch (err) {
        setState({ ...state })
      }
    } else {
        console.log('not a promise');
        const newState = await result
        setState(newState)
    }
  }, [reducer, state])

  return [state, dispatch]
}

export default useAsyncReducer