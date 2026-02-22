import { useEffect, useState } from 'react'

export const useDebounce = <T>(state: T, time: number = 300) => {
  const [debState, setDebState] = useState(state)

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebState(state)
    }, time)

    return () => {
      clearTimeout(timeoutID)
    }
  }, [state, time])

  return debState
}
