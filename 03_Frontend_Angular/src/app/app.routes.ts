import { Routes } from "@angular/router";
import { authGuard, adminGuard } from "./guards/auth.guard";
export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "eventos" },
  {
    path: "login",
    loadComponent: () => import("./pages/auth.page").then((m) => m.AuthPage),
  },
  {
    path: "registro",
    loadComponent: () => import("./pages/auth.page").then((m) => m.AuthPage),
  },
  {
    path: "eventos",
    loadComponent: () =>
      import("./pages/events.page").then((m) => m.EventsPage),
  },
  {
    path: "eventos/:id",
    loadComponent: () =>
      import("./pages/detail.page").then((m) => m.DetailPage),
  },
  {
    path: "entradas",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/tickets.page").then((m) => m.TicketsPage),
  },
  {
    path: "admin/eventos",
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import("./pages/admin.page").then((m) => m.AdminPage),
  },
  {
    path: "admin/eventos/nuevo",
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import("./pages/event-form.page").then((m) => m.EventFormPage),
  },
  {
    path: "admin/eventos/:id/editar",
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import("./pages/event-form.page").then((m) => m.EventFormPage),
  },
  {
    path: "admin/entradas",
    canActivate: [authGuard, adminGuard],
    data: { todas: true },
    loadComponent: () =>
      import("./pages/tickets.page").then((m) => m.TicketsPage),
  },
  { path: "**", redirectTo: "eventos" },
];
