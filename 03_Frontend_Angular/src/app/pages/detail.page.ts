import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { Evento, Entrada } from "../models/models";
import { EventPosterComponent } from "../components/event-poster.component";
import { mensajeError } from "../shared/http";
@Component({
  imports: [DatePipe, ReactiveFormsModule, RouterLink, EventPosterComponent],
  template: `<section class="page detail-page">
    <a class="back-link" routerLink="/eventos">← Volver a eventos</a>
    @if (error()) {
      <p class="alert error" role="alert">{{ error() }}</p>
    }
    @if (evento(); as e) {
      <div class="detail-layout">
        <div class="detail-art"><app-event-poster [evento]="e" /></div>
        <div class="event-detail-content">
          <h1>{{ e.nombre }}</h1>
          <dl class="event-facts">
            <div>
              <dt>Fecha</dt>
              <dd>{{ e.fecha | date: "fullDate" }}</dd>
            </div>
            <div>
              <dt>Lugar</dt>
              <dd>{{ e.lugar }}</dd>
            </div>
          </dl>
          <div id="compra" class="purchase-panel">
            <h2>Entradas</h2>
            <p>La disponibilidad se confirma al comprar.</p>
            @if (compra(); as c) {
              <div class="alert success" role="status">
                ¡Compra confirmada! Entrada #{{ c.id }} ·
                {{ c.cantidad }} persona(s).
              </div>
              <a class="primary full" routerLink="/entradas"
                >Ver mis entradas</a
              >
            } @else if (!e.activo || e.fecha < hoy) {
              <p class="alert">
                {{
                  e.fecha < hoy
                    ? "Este evento ya finalizó."
                    : "La venta de este evento está cerrada."
                }}
              </p>
            } @else if (auth.usuario()) {
              <form [formGroup]="form" (ngSubmit)="comprar()">
                <div class="ticket-option">
                  <div>
                    <h3>Acceso al evento</h3>
                    <p>Capacidad registrada: {{ e.capacidad }} personas.</p>
                  </div>
                  <div class="ticket-option-stub">
                    <label for="ticket-quantity">Cantidad</label>
                    <div class="quantity-stepper">
                      <button
                        type="button"
                        aria-label="Disminuir cantidad"
                        [disabled]="busy() || form.controls.cantidad.value <= 1"
                        (click)="cambiarCantidad(-1)"
                      >
                        −</button
                      ><input
                        id="ticket-quantity"
                        type="number"
                        min="1"
                        [max]="e.capacidad"
                        step="1"
                        formControlName="cantidad"
                      /><button
                        type="button"
                        aria-label="Aumentar cantidad"
                        [disabled]="
                          busy() || form.controls.cantidad.value >= e.capacidad
                        "
                        (click)="cambiarCantidad(1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                @if (form.controls.cantidad.touched && form.invalid) {
                  <small class="field-error"
                    >Ingresa una cantidad entera entre 1 y
                    {{ e.capacidad }}.</small
                  >
                }
                <div class="purchase-summary">
                  <span>Entradas seleccionadas</span
                  ><strong>{{ form.controls.cantidad.value }}</strong>
                </div>
                <p class="muted">
                  Compra para {{ auth.usuario()?.nombre }}. No se realiza un
                  cobro en línea.
                </p>
                <button class="primary full" [disabled]="busy()">
                  {{ busy() ? "Confirmando…" : "Confirmar compra" }}
                </button>
              </form>
            } @else {
              <p>Inicia sesión para seleccionar tus entradas.</p>
              <a
                class="primary full"
                routerLink="/login"
                [queryParams]="{ returnUrl: '/eventos/' + e.id }"
                >Iniciar sesión</a
              >
            }
          </div>
          <a class="back-link" routerLink="/eventos">Consultar otros eventos</a>
        </div>
      </div>
    } @else if (!error()) {
      <p role="status">Cargando evento…</p>
    }
  </section>`,
})
export class DetailPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  evento = signal<Evento | null>(null);
  compra = signal<Entrada | null>(null);
  error = signal("");
  busy = signal(false);
  hoy = new Date().toLocaleDateString("en-CA");
  form = this.fb.nonNullable.group({
    cantidad: [
      1,
      [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
    ],
  });
  constructor() {
    void this.cargar();
  }
  async cargar() {
    try {
      const e = await this.api.evento(
        Number(this.route.snapshot.paramMap.get("id")),
      );
      this.evento.set(e);
      this.form.controls.cantidad.addValidators(Validators.max(e.capacidad));
      this.form.controls.cantidad.updateValueAndValidity();
    } catch (e) {
      this.error.set(mensajeError(e));
    }
  }
  cambiarCantidad(delta: number) {
    if (this.busy()) return;
    const control = this.form.controls.cantidad;
    const actual = Number(control.value);
    const base = Number.isInteger(actual) ? actual : 1;
    control.setValue(
      Math.max(1, Math.min(this.evento()?.capacidad ?? 1, base + delta)),
    );
    control.markAsTouched();
  }
  async comprar() {
    if (this.busy()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const e = this.evento(),
      u = this.auth.usuario();
    if (!e || !u || !this.auth.token()) {
      this.error.set("Inicia sesión nuevamente para comprar.");
      return;
    }
    this.busy.set(true);
    this.error.set("");
    try {
      this.compra.set(
        await this.api.comprar(u.id, e.id, this.form.getRawValue().cantidad),
      );
      await this.cargar();
    } catch (e) {
      this.error.set(mensajeError(e));
    } finally {
      this.busy.set(false);
    }
  }
}
