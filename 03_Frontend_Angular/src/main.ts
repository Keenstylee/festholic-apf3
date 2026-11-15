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
  imports: [RouterOutlet, NavbarComponent],
  template: `<app-navbar />
    <main><router-outlet /></main>
    <footer class="site-footer">
      <div class="footer-main">
        <div>
          <a class="brand" href="/">festholic<span>✦</span></a>
          <p class="footer-kicker">EVENTOS · EXPERIENCIAS · ENTRADAS</p>
          <p>
            Tu próximo encuentro empieza aquí.<br />Descubre, elige y vive el
            momento.
          </p>
        </div>
        <div>
          <h3>Explora Festholic</h3>
          <a href="/eventos">Ver eventos →</a
          ><a href="/entradas">Mis entradas →</a
          ><a href="/login">Mi cuenta →</a>
        </div>
        <div class="footer-statement">
          <span>LIVE THE</span><strong>FEELING<span>✦</span></strong>
        </div>
      </div>
      <div class="footer-bottom">
        <span>Los mejores momentos se viven juntos.</span
        ><small>PROYECTO ACADÉMICO · APF3 · 2026</small>
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
