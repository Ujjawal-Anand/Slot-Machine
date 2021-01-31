import React, { useReducer, createContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_CURRENT_USER } from '../graphql/queries';


// reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGGED_IN_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

// state
const initialState = {
    user: null
};

// create context
const AuthContext = createContext();

// context provider
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
        
        const { data, error } = useQuery(GET_CURRENT_USER)
        console.log(data);

        useEffect(() => {
            if(data) {
                const user = data.getCurrentUser;
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, 
                               token: user.token, 
                               attempts: user.attempts, 
                               points: user.points,
                               coupons: user.coupons  }
                });
            } else {
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: null
                });
            }
        }, [data])
    

    const value = { state, dispatch };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// export
export { AuthContext, AuthProvider };
