import React, { useReducer, useEffect, useState } from "react";

export default (reducer, actions, defaultValue, loader) => {
  const Context = React.createContext();

  const Provider = ({ children }) => {
    const [loading, setLoading] = useState(true); // Manage loading state
    const [state, dispatch] = useReducer(reducer, defaultValue); // Only main state in reducer

    // Bind actions
    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    useEffect(() => {
      const init = async () => {
        if (loader) await loader(dispatch)();
        setLoading(false); // Set loading to false when loader completes
      };
      init();
    }, []);

    return <Context.Provider value={{ state, loading, ...boundActions }}>{children}</Context.Provider>;
  };

  return { Context, Provider };
};
