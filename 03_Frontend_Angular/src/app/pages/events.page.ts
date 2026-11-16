import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Evento } from "../models/models";
import { EventCardComponent } from "../components/event-card.component";
import { mensajeError } from "../shared/http";
@Component({
  imports: [FormsModule, EventCardComponent],
  template: ` <section class="catalog-heading">
      <h1>Eventos y conciertos.</h1>
      <p>Consulta la cartelera y encuentra tu próximo evento.</p>
    </section>
    <section id="cartelera">
      <h2 class="sr-only">Cartelera de eventos</h2>
      <div class="catalog-toolbar">
        <div
          class="catalog-tabs"
          role="group"
          aria-label="Filtrar eventos por estado"
        >
          <button
            [class.active]="vista() === 'todos'"
            (click)="vista.set('todos'); limite.set(18)"
          >
            Todos</button
          ><button
            [class.active]="vista() === 'proximos'"
            (click)="vista.set('proximos'); limite.set(18)"
          >
            Próximos</button
          ><button
            [class.active]="vista() === 'finalizados'"
            (click)="vista.set('finalizados'); limite.set(18)"
          >
            Finalizados
          </button>
        </div>
        <div class="catalog-search">
          <label for="event-search" class="sr-only">Buscar evento</label
          ><input
            id="event-search"
            type="search"
            placeholder="Buscar evento o lugar"
            (input)="busqueda.set($any($event.target).value); limite.set(18)"
          />
        </div>
        <form class="filter" (ngSubmit)="aplicarFecha()">
          <label
            >Filtrar por fecha<input
              type="date"
              name="fecha"
              [(ngModel)]="fecha" /></label
          ><button class="secondary" [disabled]="loading()">Buscar</button
          ><button
            type="button"
            class="text-button"
            (click)="fecha = ''; aplicarFecha()"
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
        <p role="status">Cargando eventos…</p>
      } @else if (!error()) {
        <div class="event-grid">
          @for (e of visibles().slice(0, limite()); track e.id) {
            <app-event-card [evento]="e" (seleccionar)="abrir($event)" />
          } @empty {
            <div class="empty">
              <h3>No hay eventos para este filtro.</h3>
              <p>Prueba otra fecha o busca otro nombre.</p>
            </div>
          }
        </div>
        @if (visibles().length > limite()) {
          <div class="load-more">
            <button class="secondary" (click)="limite.update(mas)">
              Cargar más eventos
            </button>
          </div>
        }
      }
    </section>`,
})
export class EventsPage {
  api = inject(ApiService);
  router = inject(Router);
  eventos = signal<Evento[]>([]);
  loading = signal(false);
  error = signal("");
  vista = signal<"todos" | "proximos" | "finalizados">("proximos");
  busqueda = signal("");
  limite = signal(18);
  fecha = "";
  fechaAplicada = signal("");
  hoy = new Date().toLocaleDateString("en-CA");
  visibles = computed(() => {
    const q = this.busqueda().trim().toLocaleLowerCase();
    return this.eventos()
      .filter(
        (e) =>
          (this.vista() === "todos" ||
            (this.vista() === "finalizados"
              ? e.fecha < this.hoy
              : e.fecha >= this.hoy)) &&
          (!this.fechaAplicada() || e.fecha === this.fechaAplicada()) &&
          (!q || (e.nombre + " " + e.lugar).toLocaleLowerCase().includes(q)),
      )
      .sort(
        (a, b) =>
          Number(!a.imagenUrl) - Number(!b.imagenUrl) ||
          a.fecha.localeCompare(b.fecha),
      );
  });
  mas = (n: number) => n + 18;
  constructor() {
    void this.cargar();
  }
  aplicarFecha() {
    this.fechaAplicada.set(this.fecha);
    this.limite.set(18);
  }
  async cargar() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set("");
    try {
      this.eventos.set(await this.api.eventos());
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
