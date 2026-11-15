package pe.festholic.eventos.dto;

import pe.festholic.eventos.model.Rol;

public record AuthResponse(String token, String tipo, String email, Rol rol) {
}