# -*- coding: utf-8 -*-
"""
Blueprint: login
Rutas de autenticación (login/logout) y vista de login.
- GET  /            -> renderiza el formulario de login (loginFormulario.html)
- POST /auth/login  -> procesa credenciales, guarda sesión y redirige por rol
- POST /auth/logout -> limpia sesión y devuelve redirect a login
"""

from flask import  render_template, request, jsonify, session, redirect, url_for
from Modelo_de_Datos_PostgreSQL_y_CRUD.Usuarios import (
    verificar_credenciales, obtener_usuario_por_id
)
from Log_PeakSport import log_info, log_error, log_critical, log_warning



# =========================
# Helpers internos
# =========================
def _payload_json():
    """
    Normaliza el payload aceptando claves tanto en snake_case como en PascalCase
    (compat con tu front actual).
    """
    data = request.get_json(silent=True) or {}
    # Acepta ambas convenciones
    correo = data.get('correo') or data.get('Correo')
    contrasena = data.get('contrasena') or data.get('Contrasena')
    return correo, contrasena

def _redir_por_rol(rol: str):
    """
    Devuelve la URL de destino según el rol del usuario.
    ¡OJO! Usa endpoints reales y existentes.
    """
    if rol == 'Administrador':
        # Endpoint definido en administrador_principal.py
        return url_for('administrador_principal.vista_listado_productos')
    # Por defecto va a cliente
    # Endpoint definido en cliente_principal.py
    return url_for('cliente_principal.vista_cliente_principal')


# =========================
# Rutas
# =========================
def registrar_rutas(bp):
    """Registra las rutas del blueprint de login pasado como parámetro."""
    @bp.get('/')
    def vista_pantalla_login():
        """
        Renderiza el formulario de login.
        """
        try:
            return render_template('loginFormulario.html')
        except Exception as e:
            log_critical(f"[login] vista_pantalla_login: Error inesperado: {e}")
            # Fallback simple
            return "<h1>Error cargando la pantalla de login</h1>", 500


    @bp.post('/auth/login')
    def login_usuario_route():
        """
        Inicia sesión:
        - Verifica credenciales con `verificar_credenciales`
        - Persiste datos mínimos en `session`
        - Retorna JSON con `redirect` (URL) para que el front haga `window.location = ...`

        Request JSON esperado (se aceptan ambas variantes):
        {
            "correo": "user@dominio.com", "contrasena": "xxxx"
            // ó
            "Correo": "user@dominio.com", "Contrasena": "xxxx"
        }
        """
        try:
            correo, contrasena = _payload_json()

            if not correo or not contrasena:
                log_warning("[login] login_usuario_route: Faltan credenciales")
                return jsonify({'ok': False, 'error': 'Correo y contraseña son obligatorios'}), 400

            usuario = verificar_credenciales(correo, contrasena)
            if not usuario:
                log_warning(f"[login] login_usuario_route: Credenciales inválidas para {correo}")
                return jsonify({'ok': False, 'error': 'Credenciales inválidas'}), 401

            # Sesión segura y compacta
            session.clear()
            session['usuario_id'] = usuario.id
            session['usuario_correo'] = usuario.correo
            session['usuario_nombre'] = usuario.nombre_completo
            session['usuario_rol'] = usuario.rol
            session['logged_in'] = True

            destino = _redir_por_rol(usuario.rol)
            log_info(f"[login] login_usuario_route: Login exitoso para {correo} -> {destino}")

            return jsonify({'ok': True, 'redirect': destino}), 200

        except Exception as e:
            log_critical(f"[login] login_usuario_route: Error inesperado: {e}")
            return jsonify({'ok': False, 'error': 'Error interno del servidor'}), 500

    @bp.post('/auth/register')
    def registrar_usuario_route():
        """
        Crea usuario y devuelve {mensaje} o {error}.
        Espera JSON: {
        "Nombre_Completo": str,
        "Correo": str,
        "Fecha_Nacimiento": "YYYY-MM-DD",
        "Contrasena": str
        }
        """
        try:
            data = request.get_json(silent=True) or {}
            from Modelo_de_Datos_PostgreSQL_y_CRUD.Usuarios import crear_usuario
            obligatorio = ['Nombre_Completo', 'Correo', 'Fecha_Nacimiento', 'Contrasena']
            if not all(data.get(k) for k in obligatorio):
                return jsonify({'error': 'Faltan campos obligatorios'}), 400

            nuevo = crear_usuario(
                correo=data.get('Correo'),
                contrasena=data.get('Contrasena'),
                nombre_completo=data.get('Nombre_Completo'),
                fecha_nacimiento=data.get('Fecha_Nacimiento'),
                verificacion=False,
                rol='Cliente'
            )
            if not nuevo:
                return jsonify({'error': 'No se pudo crear el usuario'}), 400

            return jsonify({'mensaje': 'Usuario creado', 'id': nuevo.id}), 201
        except Exception as e:
            log_critical(f"[login] registrar_usuario_route: Error inesperado: {e}")
            return jsonify({'error': 'Error interno del servidor'}), 500


    @bp.route('/auth/logout', methods=['POST'])
    def logout_usuario_route():
        try:
            session.clear()
            log_info("logout_usuario: Sesión cerrada correctamente")
            return jsonify({
                "ok": True,
                "redirect": url_for('login.vista_pantalla_login')
            })
        except Exception as e:
            log_error(f"logout_usuario: {e}")
            # Igual forzamos ir al login si algo falla
            return jsonify({
                "ok": False,
                "redirect": url_for('login.vista_pantalla_login')
            }), 200



    @bp.get('/auth/me')
    def quien_soy():
        """
        Endpoint opcional para que el front conozca el estado de sesión.
        Útil para inicializar el cliente.
        """
        try:
            if not session.get('logged_in'):
                return jsonify({'logged_in': False}), 200
            return jsonify({
                'logged_in': True,
                'usuario_id': session.get('usuario_id'),
                'correo': session.get('usuario_correo'),
                'nombre': session.get('usuario_nombre'),
                'rol': session.get('usuario_rol')
            }), 200
        except Exception as e:
            log_error(f"[login] quien_soy: Error inesperado: {e}")
            return jsonify({'logged_in': False}), 200


    @bp.get('/dashboard')
    def dashboard():
        """
        Redirige al dashboard correspondiente según el rol.
        Protegido por verificación básica de sesión.
        """
        try:
            if not session.get('logged_in'):
                return redirect(url_for('login.vista_pantalla_login'))
            return redirect(_redir_por_rol(session.get('usuario_rol')))
        except Exception as e:
            log_critical(f"[login] dashboard: Error inesperado: {e}")
            return redirect(url_for('login.vista_pantalla_login'))
