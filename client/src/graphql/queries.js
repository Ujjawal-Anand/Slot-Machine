import { gql, useQuery } from 'apollo-boost';
import { AUTH_INFO, VERIFY_TOKEN } from './fragments';


export const TOKEN_USER_QUERY = gql`
    query  {
        verifyToken {
            ...verifyToken
        }
    }
    ${VERIFY_TOKEN}
`

export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
            ...authInfo
        }
    }
    ${AUTH_INFO}
`