import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AppState} from '../../app.reducer';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

    userSubs: Subscription;
    nombre: string = '';

    constructor(private authService: AuthService,
                private store: Store<AppState>,
                private routers: Router) {
    }

    ngOnInit() {
        this.userSubs = this.store.select('user')
                .subscribe( user => {
            this.nombre = user.user?.nombre;
        });
    }

    ngOnDestroy() {
        this.userSubs.unsubscribe();
    }

    logout() {
        this.authService.logout().then(() => {
            this.routers.navigate(['/login']);
        });
    }

}
