import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import User from '../models/User';

interface LoginReq {
    username: string;
    password: string;
}

interface RegisterReq {
    username: string;
    password: string;
    confirm_password: string;
}

@Injectable({
    providedIn: 'root',
})
export default class AuthService {
    private apiUrl = environment.apiUrl;
    _httpClient = inject(HttpClient);
    _router = inject(Router);

    login(user: LoginReq) {
        return this._httpClient.post<User>(
            `${this.apiUrl}/auth/login`,
            user
        );
    }

    register(user: RegisterReq) {
        return this._httpClient.post(`${this.apiUrl}/user`, user);
    }

    logout() {
        localStorage.clear();
        this._router.navigateByUrl('/login');
    }

    isLogged() {
        return localStorage.getItem('user') != null;
    }

    getUser() {
        return localStorage.getItem('user') ?? '';
    }

    saveUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    saveNewToken(accessToken: string): void {
        const user = JSON.parse(this.getUser());
        localStorage.setItem('user', JSON.stringify({ ...user, accessToken }));
    }

    refreshToken(refreshToken: string) {
        return this._httpClient.post(`${this.apiUrl}/auth/refresh-token`, {
            refreshToken,
        });
    }

    haveAccess() {
        const userLocal = localStorage.getItem('user') ?? '';
        const loggintoken = JSON.parse(userLocal).accessToken;
        const extractedtoken = loggintoken.split('.')[1];
        const atobdata = atob(extractedtoken);
        const finaldata = JSON.parse(atobdata);
        if (finaldata.role == 'admin') {
            return true;
        } else {
            alert('you not having access');
            return false;
        }
    }
}