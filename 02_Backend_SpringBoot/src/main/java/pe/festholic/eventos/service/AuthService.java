package pe.festholic.eventos.service;

import pe.festholic.eventos.dto.AuthResponse;
import pe.festholic.eventos.dto.LoginRequest;
import pe.festholic.eventos.dto.RegistroRequest;
import pe.festholic.eventos.dto.UsuarioResponse;

public interface AuthService {
    UsuarioResponse registrar(RegistroRequest solicitud);
    AuthResponse login(LoginRequest solicitud);
}