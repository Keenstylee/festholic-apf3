import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Entrada } from "../models/models";
import { mensajeError } from "../shared/http";
@Component({
  imports: [DatePipe, RouterLink],
  template: `<section class="page">
    <span class="eyebrow">TU COLECCIÓN DE MOMENTOS</span>
    <h1>
      {{ todas ? "Todas las entradas" : "Tus próximos encuentros"
      }}<span class="accent">.</span>
    </h1>
    <p>
      {{
        todas
          ? "Registro general de compras."
          : "Tus compras confirmadas, listas para el próximo encuentro."
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
          <article class="ticket admission-ticket">
            <div class="ticket-content">
              <span class="event-status"><i></i>{{ e.estado }}</span>
              <h2>{{ e.evento.nombre }}</h2>
              <p>
                ◷ {{ e.evento.fecha | date: "fullDate" }}<br />◇
                {{ e.evento.lugar }}
              </p>
              <div class="ticket-bottom">
                <span
                  >Compra: {{ e.fechaCompra | date: "dd/MM/yyyy HH:mm" }}</span
                >
              </div>
              @if (todas) {
                <p class="ticket-owner">
                  {{ e.usuario.nombre }} · {{ e.usuario.email }}
                </p>
              }
            </div>
            <div class="admission-stub">
              <span class="eyebrow">FESTHOLIC</span
              ><strong>{{ e.cantidad }}</strong
              ><span>{{ e.cantidad === 1 ? "PERSONA" : "PERSONAS" }}</span>
              <div class="barcode" aria-hidden="true"></div>
              <small>ENTRADA #{{ e.id }}</small
              ><span class="sr-only">{{ e.cantidad }} persona(s)</span>
            </div>
          </article>
        } @empty {
          <div class="empty">
            <span class="empty-symbol" aria-hidden="true">✦</span>
            <h2>Tu próxima historia está por empezar.</h2>
            <p>Descubre la cartelera y encuentra tu próximo plan.</p>
            <a class="primary" routerLink="/eventos">Explorar eventos →</a>
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
