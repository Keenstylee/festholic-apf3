package pe.festholic.eventos.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.festholic.eventos.dto.AuthResponse;
import pe.festholic.eventos.dto.LoginRequest;
import pe.festholic.eventos.dto.RegistroRequest;
import pe.festholic.eventos.dto.UsuarioResponse;
import pe.festholic.eventos.exception.CredencialesInvalidasException;
import pe.festholic.eventos.exception.EmailYaRegistradoException;
import pe.festholic.eventos.model.Rol;
import pe.festholic.eventos.model.Usuario;
import pe.festholic.eventos.repository.UsuarioRepository;
import pe.festholic.eventos.security.JwtService;

import java.util.Locale;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public UsuarioResponse registrar(RegistroRequest solicitud) {
        String email = normalizarEmail(solicitud.email());
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new EmailYaRegistradoException(email);
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(solicitud.nombre().trim());
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(solicitud.password()));
        usuario.setRol(Rol.CLIENTE);

        Usuario guardado = usuarioRepository.save(usuario);
        return new UsuarioResponse(guardado.getId(), guardado.getNombre(),
                guardado.getEmail(), guardado.getRol());
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest solicitud) {
        String email = normalizarEmail(solicitud.email());
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(CredencialesInvalidasException::new);
        if (!passwordEncoder.matches(solicitud.password(), usuario.getPassword())) {
            throw new CredencialesInvalidasException();
        }

        return new AuthResponse(jwtService.generarToken(usuario), "Bearer",
                usuario.getEmail(), usuario.getRol());
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
