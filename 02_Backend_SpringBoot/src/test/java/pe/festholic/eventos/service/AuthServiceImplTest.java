package pe.festholic.eventos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    private AuthServiceImpl authService;

    @BeforeEach
    void preparar() {
        authService = new AuthServiceImpl(usuarioRepository, passwordEncoder, jwtService);
    }

    @Test
    void debeRegistrarUnClienteConLaContrasenaCifrada() {
        when(usuarioRepository.findByEmail("ana@festholic.pe")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("clave12345")).thenReturn("HASH");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario usuario = inv.getArgument(0);
            usuario.setId(5L);
            return usuario;
        });

        UsuarioResponse respuesta = authService.registrar(
                new RegistroRequest("Ana", " ANA@festholic.pe ", "clave12345"));

        assertEquals(5L, respuesta.id());
        assertEquals("ana@festholic.pe", respuesta.email());
        assertEquals(Rol.CLIENTE, respuesta.rol());

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        assertEquals("HASH", captor.getValue().getPassword());
    }

    @Test
    void debeRechazarElRegistroDeUnEmailYaUsado() {
        when(usuarioRepository.findByEmail("ana@festholic.pe")).thenReturn(Optional.of(new Usuario()));

        assertThrows(EmailYaRegistradoException.class, () -> authService.registrar(
                new RegistroRequest("Ana", "ana@festholic.pe", "clave12345")));

        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void debeIniciarSesionYEntregarElToken() {
        Usuario usuario = usuarioExistente();
        when(usuarioRepository.findByEmail("ana@festholic.pe")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("clave12345", "HASH")).thenReturn(true);
        when(jwtService.generarToken(usuario)).thenReturn("TOKEN");

        AuthResponse respuesta = authService.login(new LoginRequest("ana@festholic.pe", "clave12345"));

        assertEquals("TOKEN", respuesta.token());
        assertEquals("Bearer", respuesta.tipo());
        assertEquals(Rol.ADMIN, respuesta.rol());
    }

    @Test
    void debeRechazarElLoginConContrasenaIncorrecta() {
        when(usuarioRepository.findByEmail("ana@festholic.pe")).thenReturn(Optional.of(usuarioExistente()));
        when(passwordEncoder.matches("incorrecta", "HASH")).thenReturn(false);

        assertThrows(CredencialesInvalidasException.class,
                () -> authService.login(new LoginRequest("ana@festholic.pe", "incorrecta")));

        verify(jwtService, never()).generarToken(any(Usuario.class));
    }

    @Test
    void debeRechazarElLoginDeUnEmailInexistente() {
        when(usuarioRepository.findByEmail("nadie@festholic.pe")).thenReturn(Optional.empty());

        assertThrows(CredencialesInvalidasException.class,
                () -> authService.login(new LoginRequest("nadie@festholic.pe", "clave12345")));
    }

    private Usuario usuarioExistente() {
        Usuario usuario = new Usuario();
        usuario.setId(5L);
        usuario.setNombre("Ana");
        usuario.setEmail("ana@festholic.pe");
        usuario.setPassword("HASH");
        usuario.setRol(Rol.ADMIN);
        return usuario;
    }
}