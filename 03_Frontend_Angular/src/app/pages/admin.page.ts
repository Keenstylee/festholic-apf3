import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Evento } from "../models/models";
import { mensajeError } from "../shared/http";
@Component({
  imports: [DatePipe, RouterLink],
  template: `<section class="page">
    <span class="eyebrow">ESPACIO DE ADMINISTRACIÓN</span>
    <div class="section-heading">
      <div>
        <h1>Gestiona los encuentros<span class="accent">.</span></h1>
        <p>Crea, edita y organiza la cartelera de Festholic.</p>
      </div>
      <a class="primary" routerLink="/admin/eventos/nuevo">+ Nuevo evento</a>
    </div>
    <a routerLink="/admin/entradas">Ver todas las entradas ↗</a>
    @if (error()) {
      <p class="alert error" role="alert">{{ error() }}</p>
    }
    @if (ok()) {
      <p class="alert success" role="status">{{ ok() }}</p>
    }
    @if (pendiente(); as e) {
      <div class="alert" role="alert">
        <p>
          ¿Eliminar “{{ e.nombre }}”? Esta acción quitará el evento de la
          cartelera.
        </p>
        <button class="danger" [disabled]="busy()" (click)="eliminar(e)">
          Sí, eliminar
        </button>
        <button
          class="secondary"
          [disabled]="busy()"
          (click)="pendiente.set(null)"
        >
          Cancelar
        </button>
      </div>
    }
    @if (loading()) {
      <p role="status">Cargando eventos…</p>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Fecha / lugar</th>
              <th>Capacidad</th>
              <th>Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (e of eventos(); track e.id) {
              <tr>
                <td>
                  <strong>{{ e.nombre }}</strong
                  ><small>#{{ e.id }}</small>
                </td>
                <td>
                  {{ e.fecha | date: "dd MMM yyyy"
                  }}<small>{{ e.lugar }}</small>
                </td>
                <td>{{ e.capacidad }}</td>
                <td>
                  <span class="badge">{{
                    e.activo ? "Abierta" : "Cerrada"
                  }}</span>
                </td>
                <td>
                  <a [routerLink]="['/admin/eventos', e.id, 'editar']"
                    >Editar</a
                  >
                  <button class="text-button" (click)="pendiente.set(e)">
                    Eliminar
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">Todavía no hay eventos. Crea el primero.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  </section>`,
})
export class AdminPage {
  api = inject(ApiService);
  eventos = signal<Evento[]>([]);
  pendiente = signal<Evento | null>(null);
  error = signal("");
  ok = signal("");
  busy = signal(false);
  loading = signal(false);
  constructor() {
    void this.cargar();
  }
  async cargar() {
    this.loading.set(true);
    try {
      this.eventos.set(await this.api.eventos());
    } catch (e) {
      this.error.set(mensajeError(e));
    } finally {
      this.loading.set(false);
    }
  }
  async eliminar(e: Evento) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set("");
    this.ok.set("");
    try {
      await this.api.eliminar(e.id);
      this.pendiente.set(null);
      this.ok.set("Evento eliminado.");
      await this.cargar();
    } catch (e) {
      this.error.set(mensajeError(e));
    } finally {
      this.busy.set(false);
    }
  }
}
