import { Component, input, output } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Evento } from "../models/models";
import { EventPosterComponent } from "./event-poster.component";
@Component({
  selector: "app-event-card",
  imports: [DatePipe, EventPosterComponent],
  template: ` <article class="event-card">
    <app-event-poster [evento]="evento()" />
    <div class="card-body">
      <p class="event-date">{{ evento().fecha | date: "dd MMM yyyy" }}</p>
      <h3>{{ evento().nombre }}</h3>
      <p class="venue">{{ evento().lugar }}</p>
      <div class="card-bottom">
        <span>{{
          evento().fecha < hoy
            ? "Finalizado"
            : evento().activo
              ? "Venta abierta"
              : "Venta cerrada"
        }}</span
        ><button class="secondary" (click)="seleccionar.emit(evento())">
          Ver evento →
        </button>
      </div>
    </div>
  </article>`,
})
export class EventCardComponent {
  evento = input.required<Evento>();
  seleccionar = output<Evento>();
  hoy = new Date().toLocaleDateString("en-CA");
}
