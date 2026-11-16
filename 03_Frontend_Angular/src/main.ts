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
import es from "@angular/common/locales/es-PE";
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
            <a class="brand" routerLink="/eventos">fest<span>holic</span></a>
            <p>Eventos y entradas.</p>
          </div>
          <nav class="footer-nav" aria-label="Navegación del pie de página">
            <a routerLink="/eventos">Eventos</a
            ><a routerLink="/entradas">Mis entradas</a
            ><a routerLink="/login">Mi cuenta</a>
          </nav>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Festholic</span
          ><span>Conciertos y festivales en Lima.</span>
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
