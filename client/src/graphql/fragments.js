import { gql } from 'apollo-boost'


export const AUTH_INFO = gql`
    fragment authInfo on Auth {
        id
        email
        token
        points
        attempts
        coupons
    }
`;

export const VERIFY_TOKEN = gql`
    fragment verifyToken on VerifyToken {
        id
        email
        token
    }
`