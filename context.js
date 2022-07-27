import React, { createContext, useContext } from "react";
import { reducer, initialState } from "./reducer";

const AppContext = createContext();

const Context = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export default Context;
export { useGlobalContext };
