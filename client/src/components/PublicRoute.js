import React, { useContext, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const PublicRoute = ({ ...rest }) => {
    const { state } = useContext(AuthContext);
    let history = useHistory();

    useEffect(() => {
        if (state.user) {
            history.push('/slotmachine');
        }
    }, [state.user]);

    return (
            <Route {...rest} />
    );
};

export default PublicRoute;
