package pe.festholic.eventos.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(EventoNoEncontradoException.class)
    public ResponseEntity<ApiError> manejarNoEncontrado(EventoNoEncontradoException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 404, exception.getMessage(), Map.of());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<ApiError> manejarUsuarioNoEncontrado(UsuarioNoEncontradoException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 404, exception.getMessage(), Map.of());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ApiError> manejarReglaNegocio(ReglaNegocioException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 400, exception.getMessage(), Map.of());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(EmailYaRegistradoException.class)
    public ResponseEntity<ApiError> manejarEmailRepetido(EmailYaRegistradoException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 409, exception.getMessage(), Map.of());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ApiError> manejarCredenciales(CredencialesInvalidasException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 401, exception.getMessage(), Map.of());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> manejarValidacion(MethodArgumentNotValidException exception) {
        Map<String, String> errores = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errores.put(error.getField(), error.getDefaultMessage()));
        ApiError respuesta = new ApiError(LocalDateTime.now(), 400, "Datos de entrada inválidos", errores);
        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> manejarIntegridad(DataIntegrityViolationException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 409,
                "La operación no es posible porque el registro está relacionado con otros datos", Map.of());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> manejarJsonInvalido(HttpMessageNotReadableException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 400,
                "El cuerpo de la solicitud no es un JSON válido o tiene un formato de dato incorrecto", Map.of());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> manejarTipoInvalido(MethodArgumentTypeMismatchException exception) {
        ApiError error = new ApiError(LocalDateTime.now(), 400,
                "El valor del parámetro '" + exception.getName() + "' no tiene el formato esperado", Map.of());
        return ResponseEntity.badRequest().body(error);
    }
}