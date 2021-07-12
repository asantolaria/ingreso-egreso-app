import {createReducer, on} from '@ngrx/store';
import { setItems, unsetItems } from './ingreso-egreso.action';
import {IngresoEgreso} from '../models/ingeso-egreso.model';

export interface State {
    items: IngresoEgreso[];
}

export const initialState: State = {
    items: [],
};

const _uiReducer = createReducer(initialState,
        on( setItems,   (state, { items}) => ({ ...state, items: [...items]  })),
        on( unsetItems, (state) => ({ ...state, items : [] })),
);

export function uiReducer(state, action) {
    return _uiReducer(state, action);
}
