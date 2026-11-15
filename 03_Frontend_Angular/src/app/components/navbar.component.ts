import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../services/auth.service";
@Component({
  selector: "app-navbar",
  imports: [RouterLink, RouterLinkActive],
  template: `<header>
    <a class="brand" routerLink="/eventos">festholic<span>✦</span></a>
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
        <a routerLink="/login">Iniciar sesión →</a>
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
