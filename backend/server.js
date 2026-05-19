require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Asistencia QR PostgreSQL funcionando' });
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, documento_identidad } = req.body;
    const result = await pool.query(
      'SELECT id, codigo_estudiante, nombre, documento_identidad, email, rol, qr_code FROM usuarios WHERE email=$1 AND documento_identidad=$2',
      [email, documento_identidad]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });
    res.json({ usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { codigo_estudiante, nombre, documento_identidad, email, rol = 'estudiante' } = req.body;
    if (!codigo_estudiante || !nombre || !documento_identidad || !email) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const qrCode = `QR-${codigo_estudiante}-${uuidv4()}`;
    const result = await pool.query(
      `INSERT INTO usuarios (codigo_estudiante, nombre, documento_identidad, email, rol, qr_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, codigo_estudiante, nombre, documento_identidad, email, rol, qr_code`,
      [codigo_estudiante, nombre, documento_identidad, email, rol, qrCode]
    );
    res.status(201).json({ usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/asistencias', async (req, res) => {
  try {
    const { qr_code } = req.body;
    const userResult = await pool.query('SELECT * FROM usuarios WHERE qr_code=$1', [qr_code]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'QR no válido' });
    const usuario = userResult.rows[0];

    const existeHoy = await pool.query(
      'SELECT id FROM asistencias WHERE usuario_id=$1 AND fecha=CURRENT_DATE',
      [usuario.id]
    );
    if (existeHoy.rows.length > 0) return res.status(409).json({ error: 'Este usuario ya registró asistencia hoy' });

    const asistenciaResult = await pool.query(
      `INSERT INTO asistencias (usuario_id, fecha, hora)
       VALUES ($1, CURRENT_DATE, CURRENT_TIME)
       RETURNING id, usuario_id, fecha, hora, registrado_en`,
      [usuario.id]
    );
    res.status(201).json({
      mensaje: 'El usuario ya está registrado en el sistema',
      usuario,
      asistencia: asistenciaResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/asistencias/usuario/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.fecha,
        a.hora,
        a.registrado_en,
        u.nombre
      FROM asistencias a
      INNER JOIN usuarios u ON u.id = a.usuario_id
      WHERE a.usuario_id = $1
      ORDER BY a.registrado_en DESC
      `,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/asistencias', async (req, res) => {
  try {
    const { fecha = '', persona = '' } = req.query;

    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.fecha,
        a.hora,
        a.registrado_en,
        u.nombre,
        u.codigo_estudiante,
        u.documento_identidad,
        u.email
      FROM asistencias a
      INNER JOIN usuarios u ON u.id = a.usuario_id
      WHERE ($1 = '' OR a.fecha::text = $1)
      AND (
        $2 = ''
        OR LOWER(u.nombre) LIKE LOWER($3)
        OR LOWER(u.codigo_estudiante) LIKE LOWER($3)
        OR LOWER(u.documento_identidad) LIKE LOWER($3)
        OR LOWER(u.email) LIKE LOWER($3)
      )
      ORDER BY a.registrado_en DESC
      `,
      [fecha, persona, `%${persona}%`]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/asistencias/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM asistencias WHERE id=$1',
      [req.params.id]
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`));
