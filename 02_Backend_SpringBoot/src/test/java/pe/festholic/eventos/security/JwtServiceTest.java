package pe.festholic.eventos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;
import pe.festholic.eventos.model.Rol;
import pe.festholic.eventos.model.Usuario;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    private static final String SECRETO = "clave-de-prueba-con-al-menos-32-caracteres-123456";
    private static final String OTRO_SECRETO = "otra-clave-distinta-de-al-menos-32-caracteres-99";

    @Test
    void debeGenerarUnTokenQueSePuedeLeer() {
        JwtService jwtService = new JwtService(SECRETO, 3_600_000L);

        Claims claims = jwtService.leerClaims(jwtService.generarToken(nuevoUsuario()));

        assertEquals("cliente@festholic.pe", claims.getSubject());
        assertEquals("CLIENTE", claims.get("rol", String.class));
    }

    @Test
    void debeRechazarUnTokenFirmadoConOtraClave() {
        JwtService emisor = new JwtService(OTRO_SECRETO, 3_600_000L);
        JwtService receptor = new JwtService(SECRETO, 3_600_000L);
        String token = emisor.generarToken(nuevoUsuario());

        assertThrows(JwtException.class, () -> receptor.leerClaims(token));
    }

    @Test
    void debeRechazarUnTokenExpirado() {
        JwtService jwtService = new JwtService(SECRETO, -1_000L);
        String token = jwtService.generarToken(nuevoUsuario());

        assertThrows(JwtException.class, () -> jwtService.leerClaims(token));
    }

    private Usuario nuevoUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Cliente Prueba");
        usuario.setEmail("cliente@festholic.pe");
        usuario.setRol(Rol.CLIENTE);
        return usuario;
    }
}