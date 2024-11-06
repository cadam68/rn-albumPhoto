// note : createContext is lowercase because we export a plain function

import React, { useState, useEffect } from 'react';

export default (loader, initialValues) => {
    const Context = React.createContext();

    const Provider = ({children}) => {
        const [state, setState] = useState(initialValues);

        useEffect(()=>{
            loader(setState);
        }, []);

        return (
            <Context.Provider value={{ state, setState }}>
                {children}
            </Context.Provider>
        );
    }

    return {Provider, Context};
}