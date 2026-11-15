export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "ADMIN" | "CLIENTE";
}
export interface AuthResponse {
  token: string;
  tipo: string;
  email: string;
  rol: Usuario["rol"];
}
export interface Evento {
  id: number;
  nombre: string;
  lugar: string;
  fecha: string;
  capacidad: number;
  activo: boolean;
}
export interface Entrada {
  id: number;
  usuario: Usuario;
  evento: Evento;
  cantidad: number;
  fechaCompra: string;
  estado: string;
}
