package pe.festholic.eventos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CompraEntradaRequest(
        @NotNull(message = "El usuario es obligatorio") Long usuarioId,
        @NotNull(message = "El evento es obligatorio") Long eventoId,
        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser al menos 1") Integer cantidad
) {
}