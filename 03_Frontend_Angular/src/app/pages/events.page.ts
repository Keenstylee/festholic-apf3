import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Evento } from "../models/models";
import { EventCardComponent } from "../components/event-card.component";
import { mensajeError } from "../shared/http";
@Component({
  imports: [FormsModule, EventCardComponent],
  template: `<section class="hero">
      <div>
        <span class="eyebrow">MÚSICA. ENCUENTROS. MOMENTOS.</span>
        <h1>La próxima gran<br />historia se vive<br /><em>en persona.</em></h1>
        <p>
          Descubre eventos, encuentra a tu gente<br />y guarda tu lugar en el
          próximo encuentro.
        </p>
        <a class="primary" href="#cartelera">Explorar eventos <span>↓</span></a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="rings"></div>
        <span class="art-label">FEEL IT.<br />LIVE IT.</span>
        <div class="art-bottom">FESTHOLIC EXPERIENCES <b>✦</b></div>
      </div>
    </section>
    <div class="ticker">
      ENCUENTRA TU RITMO <span>✦</span> VIVE EL MOMENTO <span>✦</span> CREA
      RECUERDOS <span>✦</span> ENCUENTRA TU RITMO
    </div>
    <section id="cartelera">
      <div class="section-heading">
        <div>
          <span class="eyebrow">TU PRÓXIMO PLAN</span>
          <h2>En cartelera<span class="accent">.</span></h2>
        </div>
        <form class="filter" (ngSubmit)="cargar()">
          <label
            >Filtrar por fecha<input
              type="date"
              name="fecha"
              [(ngModel)]="fecha" /></label
          ><button class="secondary" [disabled]="loading()">Buscar</button
          ><button
            type="button"
            class="text-button"
            (click)="fecha = ''; cargar()"
          >
            Ver todos
          </button>
        </form>
      </div>
      @if (error()) {
        <div class="alert error" role="alert">
          {{ error() }} <button (click)="cargar()">Reintentar</button>
        </div>
      }
      @if (loading()) {
        <p role="status">Buscando tu próximo encuentro…</p>
      } @else {
        <div class="event-grid">
          @for (e of eventos(); track e.id) {
            <app-event-card [evento]="e" (seleccionar)="abrir($event)" />
          } @empty {
            <div class="empty">
              <h3>Aún no hay eventos para mostrar.</h3>
              <p>Vuelve pronto o prueba otra fecha.</p>
            </div>
          }
        </div>
      }
    </section>`,
})
export class EventsPage {
  api = inject(ApiService);
  router = inject(Router);
  eventos = signal<Evento[]>([]);
  loading = signal(false);
  error = signal("");
  fecha = "";
  constructor() {
    void this.cargar();
  }
  async cargar() {
    this.loading.set(true);
    this.error.set("");
    try {
      this.eventos.set(await this.api.eventos(this.fecha));
    } catch (e) {
      this.error.set(mensajeError(e));
      this.eventos.set([]);
    } finally {
      this.loading.set(false);
    }
  }
  abrir(e: Evento) {
    this.router.navigate(["/eventos", e.id]);
  }
}
