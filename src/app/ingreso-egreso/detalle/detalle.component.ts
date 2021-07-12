import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppState} from '../../app.reducer';
import {Store} from '@ngrx/store';
import {IngresoEgreso} from '../../models/ingeso-egreso.model';
import {Subscription} from 'rxjs';
import {IngresoEgresoService} from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor(
          private ingresoEgresoService: IngresoEgresoService,
          private store: Store<AppState>) { }

  ngOnInit() {
    this.ingresosSubs = this.store.select('ingresosEgresos').subscribe( ie  => {
      this.ingresosEgresos = ie.items;
    });
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
  }

  borrar(uid: string) {
    console.log(uid);
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
            .then(() => Swal.fire('Borrado', 'Item Borrado', 'success'))
            .catch(err => Swal.fire('Borrado', err.message, 'error'));

  }

}
