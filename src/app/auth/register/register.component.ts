import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {createDirective} from '@angular/compiler/src/core';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AppState} from '../../app.reducer';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import * as actions from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [ Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    if (this.registroForm.invalid) {return; }

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    this.store.dispatch(actions.isLoading());
    const {nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password)
            .then(credenciales => {
              console.log(credenciales);
              Swal.close();
              this.router.navigate(['/']);
              this.store.dispatch(actions.stopLoading());
            })
            .catch(err => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.message,
              });
              this.store.dispatch(actions.stopLoading());
            });
  }

}
