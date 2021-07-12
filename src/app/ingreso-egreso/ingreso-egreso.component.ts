import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IngresoEgreso} from '../models/ingeso-egreso.model';
import {IngresoEgresoService} from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import {AppState} from '../app.reducer';
import {Store} from '@ngrx/store';
import * as uiActions from '../shared/ui.actions';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-ingreso-egreso',
    templateUrl: './ingreso-egreso.component.html',
    styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
    ingresoForm: FormGroup;
    tipo: string = 'ingreso';
    cargando: boolean = false;
    loadingSubs: Subscription;

    constructor(private fb: FormBuilder,
                private store: Store<AppState>,
                private ingresoEgresoService: IngresoEgresoService) {
    }

    ngOnInit() {
        this.loadingSubs = this.store.select('ui')
                .subscribe( ui => this.cargando = ui.isLoading);

        this.ingresoForm = this.fb.group(
                {
                    descripcion: ['', Validators.required],
                    monto: ['', Validators.required],
                }
        );
    }

    ngOnDestroy() {
        this.loadingSubs.unsubscribe();
    }

    guardar() {
        this.store.dispatch(uiActions.isLoading());


        if (this.ingresoForm.invalid) {
            return;
        }

        const {descripcion, monto} = this.ingresoForm.value;
        const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
        this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
                .then( () => {
                    Swal.fire('Registro creado', descripcion, 'success');
                    this.store.dispatch(uiActions.stopLoading());
                    this.ingresoForm.reset();
                })
                .catch( (err ) => {
                    this.store.dispatch(uiActions.stopLoading());
                    Swal.fire('Error', err.message, 'error');

                });
    }

}
