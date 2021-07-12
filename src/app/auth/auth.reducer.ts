import {createReducer, on} from '@ngrx/store';
import { setuser, unsetuser } from './auth.actions';
import {Usuario} from '../models/usuario.model';

export interface State {
    user: Usuario;
}

export const initialState: State = {
    user: null,
};

const _authReducer = createReducer(initialState,
        on( setuser,   (state, {user}) => ({ ...state, user: {...user}  })),
        on( unsetuser, (state) => ({ ...state, user: null })),
);

export function authReducer(state, action) {
    return _authReducer(state, action);
}
