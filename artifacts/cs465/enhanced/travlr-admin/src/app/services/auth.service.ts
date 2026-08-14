import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { API_BASE_PATH } from '../shared/api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token = signal<string | null>(null);

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        return this.http.post<{ token: string }>(`${API_BASE_PATH}/login`, { username, password });
    }

    setToken(t: string) {
        this.token.set(t);
        localStorage.setItem('token', t);
    }

    loadToken() {
        const t = localStorage.getItem('token');
        if (t) this.token.set(t);
    }

    getToken() {
        return this.token();
    }

    isLoggedIn() {
        return !!this.token();
    }

    logout() {
        this.token.set(null);
        localStorage.removeItem('token');
    }
}