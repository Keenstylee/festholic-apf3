package pe.festholic.eventos.exception;

public class UsuarioNoEncontradoException extends RuntimeException {
    public UsuarioNoEncontradoException(Long id) {
        super("No se encontró el usuario con ID " + id);
    }
}