import {
    LISTA_CONVERSA
} from '../actions/types';

const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LISTA_CONVERSA:
            return action.payload
        default:
            return state;
    }
}