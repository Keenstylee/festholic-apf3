import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Evento, Entrada } from "../models/models";
@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);
  eventos(fecha = "") {
    return firstValueFrom(
      this.http.get<Evento[]>(
        fecha
          ? "/api/eventos/buscar?fecha=" + encodeURIComponent(fecha)
          : "/api/eventos",
      ),
    );
  }
  evento(id: number) {
    return firstValueFrom(this.http.get<Evento>("/api/eventos/" + id));
  }
  guardar(evento: Omit<Evento, "id">, id?: number) {
    return firstValueFrom(
      id
        ? this.http.put<Evento>("/api/eventos/" + id, evento)
        : this.http.post<Evento>("/api/eventos", evento),
    );
  }
  eliminar(id: number) {
    return firstValueFrom(this.http.delete<void>("/api/eventos/" + id));
  }
  comprar(usuarioId: number, eventoId: number, cantidad: number) {
    return firstValueFrom(
      this.http.post<Entrada>("/api/entradas", {
        usuarioId,
        eventoId,
        cantidad,
      }),
    );
  }
  entradas(todas = false) {
    return firstValueFrom(
      this.http.get<Entrada[]>("/api/entradas" + (todas ? "" : "/mis")),
    );
  }
}
