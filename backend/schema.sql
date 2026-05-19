CREATE DATABASE asistencia_qr;

-- Ejecuta lo siguiente dentro de la base de datos asistencia_qr:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_estudiante TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  documento_identidad TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL DEFAULT 'estudiante' CHECK (rol IN ('admin', 'estudiante')),
  qr_code TEXT UNIQUE NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asistencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME NOT NULL DEFAULT CURRENT_TIME,
  registrado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (codigo_estudiante, nombre, documento_identidad, email, rol, qr_code)
VALUES ('ADMIN001', 'Administrador Demo', '123456', 'admin@demo.com', 'admin', 'QR-ADMIN001')
ON CONFLICT (email) DO NOTHING;
