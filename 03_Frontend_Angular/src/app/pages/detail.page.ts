import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { Evento, Entrada } from "../models/models";
import { mensajeError } from "../shared/http";
@Component({
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  template: `<section class="page">
    <a routerLink="/eventos">← Volver a cartelera</a>
    @if (error()) {
      <p class="alert error" role="alert">{{ error() }}</p>
    }
    @if (evento(); as e) {
      <div class="detail-layout">
        <div>
          <span class="eyebrow">FESTHOLIC / ENCUENTROS EN VIVO</span>
          <h1>{{ e.nombre }}</h1>
          <p class="detail-meta">
            {{ e.fecha | date: "fullDate" }}<br />{{ e.lugar }}
          </p>
          <div class="detail-graphic" aria-hidden="true">✳</div>
        </div>
        <aside class="form-panel">
          <span class="eyebrow">TU LUGAR EN EL ENCUENTRO</span>
          <h2>Consigue tus entradas</h2>
          <p>Capacidad total: {{ e.capacidad }} personas.</p>
          <p>Disponibilidad confirmada al comprar.</p>
          @if (compra(); as c) {
            <div class="alert success" role="status">
              ¡Compra confirmada! Entrada #{{ c.id }} ·
              {{ c.cantidad }} persona(s).
            </div>
            <a routerLink="/entradas">Ver mis entradas ↗</a>
          } @else if (!e.activo || e.fecha < hoy) {
            <p class="alert">Este evento no está disponible para la venta.</p>
          } @else if (auth.usuario()) {
            <form [formGroup]="form" (ngSubmit)="comprar()">
              <label
                >Cantidad<input
                  type="number"
                  min="1"
                  [max]="e.capacidad"
                  step="1"
                  formControlName="cantidad"
              /></label>
              @if (form.controls.cantidad.touched && form.invalid) {
                <small class="field-error"
                  >Ingresa una cantidad entera entre 1 y
                  {{ e.capacidad }}.</small
                >
              }
              <p class="muted">
                Compra para {{ auth.usuario()?.nombre }}. No se realiza un cobro
                en línea en este avance académico.
              </p>
              <button class="primary full" [disabled]="busy()">
                {{ busy() ? "Confirmando…" : "Confirmar compra ↗" }}
              </button>
            </form>
          } @else {
            <p>Inicia sesión para guardar tu lugar.</p>
            <a
              class="primary"
              routerLink="/login"
              [queryParams]="{ returnUrl: '/eventos/' + e.id }"
              >Iniciar sesión ↗</a
            >
          }
        </aside>
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
