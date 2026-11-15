import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../services/auth.service";
@Component({
  selector: "app-navbar",
  imports: [RouterLink, RouterLinkActive],
  template: `<header class="site-header">
    <a class="brand-lockup" routerLink="/eventos" aria-label="Festholic, inicio"
      ><span class="brand-mark" aria-hidden="true">f.</span
      ><span
        ><b class="brand">festholic<span>✦</span></b
        ><small>EVENTOS · EXPERIENCIAS · ENTRADAS</small></span
      ></a
    >
    <nav aria-label="Navegación principal">
      <a routerLink="/eventos" routerLinkActive="current">Explorar</a>
      @if (auth.usuario()) {
        <a routerLink="/entradas" routerLinkActive="current">Mis entradas</a>
        @if (auth.usuario()?.rol === "ADMIN") {
          <a routerLink="/admin/eventos" routerLinkActive="current"
            >Administrar</a
          >
        }
        <button class="text-button" (click)="salir()">Salir</button>
      } @else {
        <a class="nav-login" routerLink="/login">Iniciar sesión →</a>
      }
    </nav>
  </header>`,
})
export class NavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);
  salir() {
    this.auth.salir();
    this.router.navigateByUrl("/eventos");
  }
}
