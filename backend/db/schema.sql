-- Esquema completo MediSalud -- PostgreSQL
-- Orden respeta las dependencias de foreign key (no se puede crear una tabla
-- que referencia otra que todavía no existe).

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- habilita gen_random_uuid()

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE rol_usuario AS ENUM ('paciente', 'medico', 'repartidor', 'cuidador', 'admin');
CREATE TYPE estado_cuidador AS ENUM ('pendiente_solicitud', 'pendiente_invitacion', 'aprobado');
CREATE TYPE iniciado_por AS ENUM ('paciente', 'cuidador');
CREATE TYPE zona_cuerpo AS ENUM ('cabeza', 'torax', 'abdomen', 'brazo_izq', 'brazo_der', 'pierna_izq', 'pierna_der', 'general');
CREATE TYPE estado_pedido AS ENUM ('solicitado', 'confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado');
CREATE TYPE tipo_notificacion AS ENUM ('pedido', 'receta', 'cuidador');

-- ============================================================
-- IDENTIDAD Y ROLES
-- ============================================================
CREATE TABLE usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    celular VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    rol rol_usuario NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE perfil_paciente (
    usuario_id UUID PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    fecha_nacimiento DATE,
    direccion VARCHAR(255),
    contacto_emergencia_nombre VARCHAR(150),
    contacto_emergencia_telefono VARCHAR(20),
    alergias TEXT
);

CREATE TABLE perfil_medico (
    usuario_id UUID PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    especialidad VARCHAR(100),
    num_licencia VARCHAR(50)
);

CREATE TABLE perfil_repartidor (
    usuario_id UUID PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    vehiculo VARCHAR(100),
    zona_cobertura VARCHAR(150)
);

-- ============================================================
-- CUIDADORES (invitación bidireccional)
-- ============================================================
CREATE TABLE paciente_cuidador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES perfil_paciente(usuario_id) ON DELETE CASCADE,
    cuidador_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    relacion VARCHAR(50),
    autorizado_pedidos BOOLEAN NOT NULL DEFAULT FALSE,
    estado estado_cuidador NOT NULL,
    iniciado_por iniciado_por NOT NULL,
    UNIQUE (paciente_id, cuidador_id)
);

-- ============================================================
-- HISTORIAL CLÍNICO
-- ============================================================
CREATE TABLE historial_medico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES perfil_paciente(usuario_id) ON DELETE CASCADE,
    medico_id UUID NOT NULL REFERENCES perfil_medico(usuario_id),
    fecha DATE NOT NULL,
    diagnostico TEXT,
    notas TEXT
);

CREATE TABLE examen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES perfil_paciente(usuario_id) ON DELETE CASCADE,
    medico_id UUID NOT NULL REFERENCES perfil_medico(usuario_id),
    tipo VARCHAR(150) NOT NULL,
    zona_cuerpo zona_cuerpo NOT NULL,
    fecha DATE NOT NULL,
    laboratorio VARCHAR(150),
    resultado_simple TEXT,
    archivo_url VARCHAR(255)
);

-- ============================================================
-- MEDICINAS Y RECETAS (documento con items)
-- ============================================================
CREATE TABLE medicamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    presentacion VARCHAR(150),
    descripcion_uso TEXT,
    requiere_receta BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE receta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES perfil_paciente(usuario_id) ON DELETE CASCADE,
    medico_id UUID NOT NULL REFERENCES perfil_medico(usuario_id),
    hospital VARCHAR(150),
    fecha_emision DATE NOT NULL,
    indicaciones_extra TEXT
);

CREATE TABLE receta_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receta_id UUID NOT NULL REFERENCES receta(id) ON DELETE CASCADE,
    medicamento_id UUID NOT NULL REFERENCES medicamento(id),
    cantidad_total INTEGER NOT NULL,
    frecuencia_horas INTEGER NOT NULL,
    duracion_dias INTEGER NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    indicaciones TEXT,
    activa BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- FARMACIAS Y PEDIDOS
-- ============================================================
CREATE TABLE farmacia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    logo_url VARCHAR(255),
    direccion VARCHAR(255),
    telefono_contacto VARCHAR(20)
);

CREATE TABLE pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES perfil_paciente(usuario_id) ON DELETE CASCADE,
    cuidador_id UUID REFERENCES usuario(id),
    repartidor_id UUID REFERENCES perfil_repartidor(usuario_id),
    direccion_entrega VARCHAR(255) NOT NULL,
    estado estado_pedido NOT NULL DEFAULT 'solicitado',
    creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
    entregado_en TIMESTAMP
);

CREATE TABLE pedido_detalle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
    receta_item_id UUID NOT NULL REFERENCES receta_item(id),
    farmacia_id UUID NOT NULL REFERENCES farmacia(id),
    cantidad_solicitada INTEGER NOT NULL
);

-- ============================================================
-- NOTIFICACIONES (solo pedido/receta/cuidador -- NO recordatorios)
-- ============================================================
CREATE TABLE notificacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destinatario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    paciente_relacionado_id UUID NOT NULL REFERENCES perfil_paciente(usuario_id) ON DELETE CASCADE,
    tipo tipo_notificacion NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices útiles para las consultas más frecuentes del frontend
CREATE INDEX idx_receta_paciente ON receta(paciente_id);
CREATE INDEX idx_receta_item_receta ON receta_item(receta_id);
CREATE INDEX idx_examen_paciente ON examen(paciente_id);
CREATE INDEX idx_pedido_paciente ON pedido(paciente_id);
CREATE INDEX idx_pedido_estado ON pedido(estado);
CREATE INDEX idx_notificacion_destinatario ON notificacion(destinatario_id, leida);
