package pe.festholic.eventos.exception;

public class EventoNoEncontradoException extends RuntimeException {
    public EventoNoEncontradoException(Long id) {
        super("No se encontró el evento con ID " + id);
    }
}
