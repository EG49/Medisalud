# Diagrama ER — MediSalud

Esquema completo de base de datos (PostgreSQL), 14 tablas. Este archivo usa
sintaxis [Mermaid](https://mermaid.js.org/) — se renderiza automáticamente
al verlo en GitHub.

```mermaid
erDiagram
    USUARIO ||--o| PERFIL_PACIENTE : "es"
    USUARIO ||--o| PERFIL_MEDICO : "es"
    USUARIO ||--o| PERFIL_REPARTIDOR : "es"

    PERFIL_PACIENTE ||--o{ PACIENTE_CUIDADOR : "vinculado con"
    USUARIO ||--o{ PACIENTE_CUIDADOR : "cuida a"

    PERFIL_PACIENTE ||--o{ HISTORIAL_MEDICO : "tiene"
    USUARIO ||--o{ HISTORIAL_MEDICO : "registra"

    PERFIL_PACIENTE ||--o{ EXAMEN : "tiene"
    USUARIO ||--o{ EXAMEN : "solicita"

    PERFIL_PACIENTE ||--o{ RECETA : "tiene"
    USUARIO ||--o{ RECETA : "emite"
    RECETA ||--|{ RECETA_ITEM : "contiene"
    MEDICAMENTO ||--o{ RECETA_ITEM : "es"

    PERFIL_PACIENTE ||--o{ PEDIDO : "realiza"
    USUARIO ||--o{ PEDIDO : "entrega"
    PEDIDO ||--|{ PEDIDO_DETALLE : "contiene"
    RECETA_ITEM ||--o{ PEDIDO_DETALLE : "se pide en"
    FARMACIA ||--o{ PEDIDO_DETALLE : "provee"

    USUARIO ||--o{ NOTIFICACION : "recibe"
    PERFIL_PACIENTE ||--o{ NOTIFICACION : "origina"

    USUARIO {
        uuid id PK
        string nombre
        string apellidos
        string cedula UK
        string celular UK
        string email
        string rol "paciente | medico | repartidor | cuidador | admin"
        boolean activo
        datetime creado_en
    }

    PERFIL_PACIENTE {
        uuid usuario_id PK,FK
        date fecha_nacimiento
        string direccion
        string contacto_emergencia_nombre
        string contacto_emergencia_telefono
        text alergias
    }

    PERFIL_MEDICO {
        uuid usuario_id PK,FK
        string especialidad
        string num_licencia
    }

    PERFIL_REPARTIDOR {
        uuid usuario_id PK,FK
        string vehiculo
        string zona_cobertura
    }

    PACIENTE_CUIDADOR {
        uuid id PK
        uuid paciente_id FK
        uuid cuidador_id FK
        string relacion
        boolean autorizado_pedidos
        string estado "pendiente_solicitud | pendiente_invitacion | aprobado"
        string iniciado_por "paciente | cuidador"
    }

    HISTORIAL_MEDICO {
        uuid id PK
        uuid paciente_id FK
        uuid medico_id FK
        date fecha
        text diagnostico
        text notas
    }

    EXAMEN {
        uuid id PK
        uuid paciente_id FK
        uuid medico_id FK
        string tipo
        string zona_cuerpo "cabeza | torax | abdomen | brazo_izq | brazo_der | pierna_izq | pierna_der | general"
        date fecha
        string laboratorio
        text resultado_simple
        string archivo_url
    }

    MEDICAMENTO {
        uuid id PK
        string nombre
        string presentacion
        text descripcion_uso
        boolean requiere_receta
    }

    RECETA {
        uuid id PK
        uuid paciente_id FK
        uuid medico_id FK
        string hospital
        date fecha_emision
        text indicaciones_extra
    }

    RECETA_ITEM {
        uuid id PK
        uuid receta_id FK
        uuid medicamento_id FK
        int cantidad_total
        int frecuencia_horas
        int duracion_dias
        datetime fecha_inicio
        text indicaciones
        boolean activa
    }

    FARMACIA {
        uuid id PK
        string nombre
        string logo_url
        string direccion
        string telefono_contacto
    }

    PEDIDO {
        uuid id PK
        uuid paciente_id FK
        uuid cuidador_id FK "nullable"
        uuid repartidor_id FK "nullable"
        string direccion_entrega
        string estado "solicitado | confirmado | en_preparacion | en_camino | entregado | cancelado"
        datetime creado_en
        datetime entregado_en
    }

    PEDIDO_DETALLE {
        uuid id PK
        uuid pedido_id FK
        uuid receta_item_id FK
        uuid farmacia_id FK
        int cantidad_solicitada
    }

    NOTIFICACION {
        uuid id PK
        uuid destinatario_id FK
        uuid paciente_relacionado_id FK
        string tipo "pedido | receta | cuidador"
        string mensaje
        boolean leida
        datetime fecha
    }
```

## Notas de diseño (por qué quedó así)

- **`PERFIL_PACIENTE` / `PERFIL_MEDICO` / `PERFIL_REPARTIDOR`** son 1—1 con `USUARIO`
  (no todos los campos aplican a todos los roles).
- **`RECETA` / `RECETA_ITEM`**: una receta es un documento (médico, hospital, fecha)
  que puede contener varios medicamentos. La disponibilidad de cada medicamento
  se calcula en el cliente a partir de `RECETA_ITEM`, nunca se guarda como
  columna fija.
- **`PEDIDO_DETALLE.receta_item_id`**: un pedido reabastece ítems específicos,
  no documentos completos de receta.
- **`PACIENTE_CUIDADOR`**: la vinculación puede iniciarla el paciente o el
  cuidador (`iniciado_por`), y queda pendiente hasta que la otra parte confirma.
- **`NOTIFICACION`** solo guarda tipos `pedido`, `receta` y `cuidador`. Los
  recordatorios de medicina (`recordatorio`) viven exclusivamente en IndexedDB
  del navegador y nunca tocan esta tabla — ver `frontend/src/offline/`.
