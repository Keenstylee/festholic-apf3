package pe.festholic.eventos.dto;

import pe.festholic.eventos.model.Rol;

public record UsuarioResponse(Long id, String nombre, String email, Rol rol) {
}