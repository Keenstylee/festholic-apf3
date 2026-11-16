import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Entrada } from "../models/models";
import { mensajeError } from "../shared/http";
@Component({
  imports: [DatePipe, RouterLink],
  template: `<section class="page">
    <h1>{{ todas ? "Todas las entradas" : "Mis entradas" }}</h1>
    <p>
      {{
        todas
          ? "Consulta el registro de compras."
          : "Consulta los eventos y las entradas de tu cuenta."
      }}
    </p>
    @if (error()) {
      <p class="alert error" role="alert">
        {{ error() }}
        <button class="secondary" (click)="cargar()">Reintentar</button>
      </p>
    }
    @if (loading()) {
      <p role="status">Cargando entradas…</p>
    } @else if (!error()) {
      <div class="ticket-grid">
        @for (e of entradas(); track e.id) {
          <article class="admission-ticket">
            <div class="ticket-content">
              <p class="ticket-state">
                {{ e.estado === "ACTIVA" ? "Entrada activa" : e.estado }}
              </p>
              <h2>{{ e.evento.nombre }}</h2>
              <p>
                {{ e.evento.fecha | date: "fullDate" }}<br />{{
                  e.evento.lugar
                }}
              </p>
              <p class="ticket-purchase-date">
                Comprada el {{ e.fechaCompra | date: "dd/MM/yyyy HH:mm" }}
              </p>
              @if (todas) {
                <p>{{ e.usuario.nombre }} · {{ e.usuario.email }}</p>
              }
            </div>
            <div class="admission-stub">
              <strong>{{ e.cantidad }}</strong><span>{{
                e.cantidad === 1 ? "persona" : "personas"
              }}</span
              ><small>Entrada #{{ e.id }}</small>
            </div>
          </article>
        } @empty {
          <div class="empty">
            <h2>Todavía no tienes entradas.</h2>
            <p>Consulta los eventos y elige tu próximo plan.</p>
            <a class="primary" routerLink="/eventos">Ver eventos</a>
          </div>
        }
      </div>
    }
  </section>`,
})
export class TicketsPage {
  api = inject(ApiService);
  todas = inject(ActivatedRoute).snapshot.data["todas"] === true;
  entradas = signal<Entrada[]>([]);
  error = signal("");
  loading = signal(false);
  constructor() {
    void this.cargar();
  }
  async cargar() {
    this.loading.set(true);
    this.error.set("");
    try {
      this.entradas.set(await this.api.entradas(this.todas));
    } catch (e) {
      this.error.set(mensajeError(e));
    } finally {
      this.loading.set(false);
    }
  }
}
