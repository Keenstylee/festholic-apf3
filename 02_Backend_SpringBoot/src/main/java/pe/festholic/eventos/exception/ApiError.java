package pe.festholic.eventos.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
        LocalDateTime fecha,
        int estado,
        String mensaje,
        Map<String, String> errores
) {
}
