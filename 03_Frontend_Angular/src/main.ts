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
    <footer>
      <a class="brand" href="/">festholic<span>✳</span></a>
      <p>Los mejores momentos se viven juntos.</p>
      <small>PROYECTO ACADÉMICO · APF3 · 2026</small>
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
