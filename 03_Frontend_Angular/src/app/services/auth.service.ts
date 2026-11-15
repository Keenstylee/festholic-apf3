import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { AuthResponse, Usuario } from "../models/models";
@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  usuario = signal<Usuario | null>(null);
  token(): string | null {
    const token = sessionStorage.getItem("festholic.token");
    if (!token) return null;
    try {
      const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      if (JSON.parse(atob(part)).exp * 1000 <= Date.now()) {
        this.salir();
        return null;
      }
      return token;
    } catch {
      this.salir();
      return null;
    }
  }
  async restaurar() {
    if (this.token()) {
      try {
        this.usuario.set(
          await firstValueFrom(this.http.get<Usuario>("/api/auth/me")),
        );
      } catch {
        this.salir();
      }
    }
  }
  async login(email: string, password: string) {
    const r = await firstValueFrom(
      this.http.post<AuthResponse>("/api/auth/login", { email, password }),
    );
    sessionStorage.setItem("festholic.token", r.token);
    try {
      this.usuario.set(
        await firstValueFrom(this.http.get<Usuario>("/api/auth/me")),
      );
    } catch (e) {
      this.salir();
      throw e;
    }
  }
  registrar(nombre: string, email: string, password: string) {
    return firstValueFrom(
      this.http.post<Usuario>("/api/auth/registro", {
        nombre,
        email,
        password,
      }),
    );
  }
  salir() {
    sessionStorage.removeItem("festholic.token");
    this.usuario.set(null);
  }
}
