import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Usuario} from '../models/usuario.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AppState} from '../app.reducer';
import {Store} from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import {Subscription} from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userSubscription: Subscription;
    private _user: Usuario;

    get user() {
        return this._user;
    }

    constructor(public auth: AngularFireAuth,
                private store: Store<AppState>,
                public firestore: AngularFirestore) {
    }

    initAuthListener() {
        this.auth.authState.subscribe(fuser => {
            if (fuser) {
                this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
                        .subscribe( (firestoresUser: any) => {
                            const user = Usuario.fromFirebase( firestoresUser);
                            this._user = user;
                            this.store.dispatch(authActions.setuser({ user }));

                        });
            } else {
                // unset user
                this._user = null;
                this.userSubscription.unsubscribe();
                this.store.dispatch(authActions.unsetuser());
                this.store.dispatch(ingresoEgresoActions.unsetItems());
            }
        });
    }

    crearUsuario(nombre: string, email: string, password: string) {
        return this.auth.createUserWithEmailAndPassword(email, password)
                .then(fbUser => {
                    const newUser = new Usuario(fbUser.user.uid, nombre, fbUser.user.email );
                    return this.firestore.doc(`${fbUser.user.uid}/usuario`).set( {...newUser} );
                });
    }

    loginUsuario(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.auth.signOut();
    }

    isAuth() {
        return this.auth.authState.pipe(
                map(fbUser => fbUser != null)
        );
    }
}
