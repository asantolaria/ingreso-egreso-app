import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppState} from '../app.reducer';
import {Store} from '@ngrx/store';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {IngresoEgresoService} from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  ingresosEgresosSubs: Subscription;

  constructor(
          private ingresoEgresoService: IngresoEgresoService,
          private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubs = this.store.select('user')
            .pipe(
                    filter( auth => auth.user != null )
            )
            .subscribe( user => {
              console.log( user );
              this.ingresosEgresosSubs = this.ingresoEgresoService.initIngresosEgresosListener( user.user.uid )
                      .subscribe( ingresosEgresosFB => {
                        this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB}));
                      });

            });
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.ingresosEgresosSubs.unsubscribe();
  }

}
