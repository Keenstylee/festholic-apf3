import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService),
    token = auth.token();
  const protegida =
    req.url.startsWith("/api/") &&
    !["/api/auth/login", "/api/auth/registro"].includes(req.url);
  return next(
    protegida && token
      ? req.clone({ setHeaders: { Authorization: "Bearer " + token } })
      : req,
  ).pipe(
    catchError((e) => {
      if (e.status === 401 && protegida) auth.salir();
      return throwError(() => e);
    }),
  );
};
export function mensajeError(e: unknown): string {
  if (!(e instanceof HttpErrorResponse))
    return "No pudimos completar la operación. Inténtalo nuevamente.";
  if ([0, 502, 504].includes(e.status))
    return "No se pudo conectar con el servidor. Comprueba que el backend esté iniciado.";
  if (e.status === 401)
    return "Credenciales incorrectas o sesión vencida. Inicia sesión nuevamente.";
  if (e.status === 403)
    return "Tu cuenta no tiene permiso para realizar esta acción.";
  if (e.status === 404) return "El registro solicitado ya no existe.";
  if (e.status === 400 || e.status === 409)
    return (
      Object.values(e.error?.errores ?? {})
        .filter((x) => typeof x === "string")
        .join(". ") ||
      e.error?.mensaje ||
      "La operación entra en conflicto con los datos registrados."
    );
  return "El servidor no pudo completar la operación. Inténtalo nuevamente.";
}
