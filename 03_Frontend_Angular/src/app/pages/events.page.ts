import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Evento } from "../models/models";
import { EventCardComponent } from "../components/event-card.component";
import { mensajeError } from "../shared/http";
@Component({
  imports: [FormsModule, EventCardComponent],
  template: `<section class="hero concert-hero">
      <div class="hero-copy">
        <span class="pill-label"><i></i>LA MÚSICA NOS ENCUENTRA</span>
        <h1>Tu próxima<br />gran noche<br /><em>empieza aquí.</em></h1>
        <p>
          Los eventos que quieres vivir.<br />Tu gente. Tu música. Tu lugar.
        </p>
        <a class="primary" href="#cartelera">Explorar eventos <span>↓</span></a>
        <div class="hero-footnote">
          <span>01 / DESCUBRE</span><span>02 / ELIGE</span
          ><span>03 / VÍVELO</span>
        </div>
      </div>
      <div class="stage-visual" aria-hidden="true">
        <div class="stage-beams"></div>
        <div class="stage-horizon"></div>
        <div class="stage-word">LIVE<br /><span>THE</span><br />FEELING.</div>
        <div class="stage-footer">
          <span>FESTHOLIC EXPERIENCE</span><b>✦</b>
        </div>
      </div>
    </section>
    <div class="ticker">
      <span>✦</span> ENCUENTRA TU RITMO <span>✦</span> VIVE EL MOMENTO
      <span>✦</span> CREA RECUERDOS <span>✦</span>
    </div>
    <section id="cartelera">
      <div class="section-heading">
        <div>
          <span class="eyebrow">SELECCIÓN FESTHOLIC</span>
          <h2>Eventos disponibles<span class="accent">.</span></h2>
          <p>Encuentra ese próximo «yo estuve ahí».</p>
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
          {{ error() }}
          <button class="secondary" (click)="cargar()">Reintentar</button>
        </div>
      }
      @if (loading()) {
        <p role="status">Buscando tu próximo encuentro…</p>
      } @else if (!error()) {
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
      <div class="experience-strip">
        <span class="experience-icon">✦</span>
        <div>
          <h3>Un encuentro empieza con una entrada.</h3>
          <p>
            Descubre la cartelera, guarda tu lugar y consulta tus compras desde
            tu cuenta.
          </p>
        </div>
      </div>
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
