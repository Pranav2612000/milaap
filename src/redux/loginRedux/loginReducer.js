import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT} from './loginActionTypes';

const initalState = {
    loading: false,
}

export const loginReducer = (state = initalState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            console.log('login');
            return {
                ...state,
                loading: true
            }
        case LOGIN_SUCCESS:
            console.log('loggedin');
            return {
                ...state,
                loading: false,
                loggedIn: true,
            }
        case LOGIN_FAILURE:
            console.log('fail');
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case LOGOUT:
            console.log('logout');
            return {
                ...state,
                loggedIn: false,
            }
        default: 
            console.log('def');
            return state;
    }
}
export default loginReducer;
