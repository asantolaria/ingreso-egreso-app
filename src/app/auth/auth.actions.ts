import {createAction, props} from '@ngrx/store';
import {Usuario} from '../models/usuario.model';

export const setuser = createAction(
        '[Auth] setUser',
        props<{user: Usuario}>()
);

export const unsetuser = createAction(
        '[Auth] unSetUser',
);
