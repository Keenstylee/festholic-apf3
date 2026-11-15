import {
  Component,
  inject,
  LOCALE_ID,
  provideAppInitializer,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
  provideRouter,
  RouterOutlet,
  RouterLink,
  withComponentInputBinding,
  withInMemoryScrolling,
} from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import es from "@angular/common/locales/es";
import { routes } from "./app/app.routes";
import { NavbarComponent } from "./app/components/navbar.component";
import { AuthService } from "./app/services/auth.service";
import { jwtInterceptor } from "./app/shared/http";
registerLocaleData(es);
@Component({
  selector: "app-root",
  imports: [RouterOutlet, RouterLink, NavbarComponent],
  template: `<app-navbar />
    <main><router-outlet /></main>
    <footer class="site-footer">
      <div class="footer-shell">
        <div class="footer-main">
          <div class="footer-brand">
            <a
              class="brand"
              routerLink="/eventos"
              aria-label="Festholic, volver al inicio"
              >festholic<span>✦</span></a
            >
            <p class="footer-kicker">EVENTOS · EXPERIENCIAS · ENTRADAS</p>
            <p>
              Encuentra a tu gente.<br />Haz del próximo encuentro un gran
              recuerdo.
            </p>
          </div>
          <nav class="footer-nav" aria-label="Navegación del pie de página">
            <h2>Explora Festholic</h2>
            <a routerLink="/eventos"
              >Ver eventos <span aria-hidden="true">→</span></a
            ><a routerLink="/entradas"
              >Mis entradas <span aria-hidden="true">→</span></a
            ><a routerLink="/login"
              >Mi cuenta <span aria-hidden="true">→</span></a
            >
          </nav>
          <div class="footer-invite">
            <span class="eyebrow">NOS VEMOS EN VIVO</span>
            <p>Tu siguiente historia<br />empieza en persona<span> ✦</span></p>
            <a routerLink="/eventos">Ir a la cartelera →</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Festholic. Los mejores momentos se viven juntos.</span
          ><small>Proyecto académico · APF3</small>
        </div>
      </div>
    </footer>`,
})
class AppComponent {}
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: "enabled" }),
    ),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: LOCALE_ID, useValue: "es-PE" },
    provideAppInitializer(() => inject(AuthService).restaurar()),
  ],
}).catch(console.error);
