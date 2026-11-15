import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
export const authGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);
  return auth.token() && auth.usuario()
    ? true
    : inject(Router).createUrlTree(["/login"], {
        queryParams: { returnUrl: state.url },
      });
};
export const adminGuard: CanActivateFn = () =>
  inject(AuthService).usuario()?.rol === "ADMIN" ||
  inject(Router).createUrlTree(["/eventos"]);
