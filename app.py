# -*- coding: utf-8 -*-
# Archivo: app.py
# Versión: 2.2.0 (Railway)

import os
from dotenv import load_dotenv
from flask import Flask, render_template, session, jsonify
from flask_session import Session
from Log_PeakSport import log_error, log_success

load_dotenv()

# Importar configuración
from config import SECRET_KEY, FLASK_ENV, DEBUG, SQLALCHEMY_CONFIG

# Importar db desde conexión
from Modelo_de_Datos_PostgreSQL_y_CRUD.conexion_postgres import db

# Importar modelos
from Modelo_de_Datos_PostgreSQL_y_CRUD import (
    Usuarios, 
    Productos, 
    Producto_Imagenes, 
    Categorias
)
from Modelo_de_Datos_PostgreSQL_y_CRUD.associations import producto_categorias

# ============================
# CREAR APP
# ============================

app = Flask(__name__)

# Aplicar configuración de BD
for key, value in SQLALCHEMY_CONFIG.items():
    app.config[key] = value

# Configuración adicional
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = SECRET_KEY
app.config['PERMANENT_SESSION_LIFETIME'] = 1800
app.config['DEBUG'] = DEBUG

# Inicializar db
db.init_app(app)

# Inicializar sesiones
Session(app)

print("\n" + "="*70)
print("🚀 INICIALIZANDO PEAKSPORT CON RAILWAY")
print("="*70)
print(f"📍 Entorno: {FLASK_ENV}")
print(f"📍 Debug: {DEBUG}")
print(f"📍 Base de datos: {SQLALCHEMY_CONFIG['SQLALCHEMY_DATABASE_URI'][:50]}...")
print("="*70 + "\n")

log_success("✅ Base de datos configurada correctamente")

# ============================
# IMPORTACIÓN DE BLUEPRINTS
# ============================

from login.main import bp_login
from Cliente.principal.main import bp_cliente_principal
from Apis.producto_main import bp_productos
from Administrador.principal.main import bp_administrador_principal

# ============================
# REGISTRO DE BLUEPRINTS
# ============================

app.register_blueprint(bp_login, url_prefix='/login')
app.register_blueprint(bp_cliente_principal, url_prefix='/cliente/principal')
app.register_blueprint(bp_productos, url_prefix='/api/productos')
app.register_blueprint(bp_administrador_principal, url_prefix='/administrador/principal')

log_success("✅ Blueprints registrados correctamente")

# ============================
# RUTAS PRINCIPALES
# ============================

@app.route('/')
def pagina_principal():
    """Pantalla pública principal"""
    try:
        logged = bool(session.get('logged_in'))
        usuario_nombre = session.get('usuario_nombre') if logged else None
        return render_template(
            'pagina_principal.html', 
            logged=logged, 
            usuario_nombre=usuario_nombre
        )
    except Exception as e:
        log_error(f"[public] pagina_principal error: {e}")
        return "<h1>Error cargando la página</h1>", 500


@app.route('/health')
def health_check():
    """Endpoint para verificar salud de la aplicación"""
    try:
        # Verificar conexión a BD
        with app.app_context():
            result = db.session.execute("SELECT 1")
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'version': '2.2.0',
            'environment': FLASK_ENV
        }), 200
        
    except Exception as e:
        log_error(f"[health_check] error: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500


@app.route('/test-db')
def test_db_route():
    """Ruta para probar conexión a BD"""
    try:
        with app.app_context():
            result = db.session.execute("SELECT version()")
            version = result.fetchone()[0]
        
        return jsonify({
            'status': 'success',
            'message': 'Conexión a Railway exitosa',
            'version': version.split(',')[0]
        }), 200
            
    except Exception as e:
        log_error(f"[test_db_route] error: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


# ============================
# MANEJADORES DE ERRORES
# ============================

@app.errorhandler(404)
def pagina_no_encontrada(error):
    """Página 404"""
    try:
        return render_template('404.html'), 404
    except:
        return "<h1>404 - Página no encontrada</h1>", 404


@app.errorhandler(500)
def error_servidor(error):
    """Página 500"""
    log_error(f"[500] Error del servidor: {error}")
    try:
        return render_template('500.html'), 500
    except:
        return "<h1>500 - Error del servidor</h1>", 500


# ============================
# CONTEXTO DE TEMPLATES
# ============================

@app.context_processor
def inject_config():
    """Inyectar variables globales en templates"""
    return {
        'app_name': 'PeakSport',
        'app_version': '2.2.0',
        'logged_in': session.get('logged_in', False),
        'usuario_nombre': session.get('usuario_nombre', ''),
        'environment': FLASK_ENV
    }


# ============================
# COMANDOS CLI
# ============================

@app.cli.command()
def test_conexion():
    """Comando: flask test-conexion - Prueba conexión a Railway"""
    with app.app_context():
        print("\n🔍 Probando conexión a Railway...")
        try:
            result = db.session.execute("SELECT version()")
            version = result.fetchone()[0]
            print(f"✅ Conexión exitosa")
            print(f"   {version.split(',')[0]}")
        except Exception as e:
            print(f"❌ Error: {e}")


@app.cli.command()
def crear_tablas():
    """Comando: flask crear-tablas - Crea todas las tablas en Railway"""
    with app.app_context():
        print("\n📦 Creando tablas en Railway...")
        try:
            db.create_all()
            print("✅ Tablas creadas correctamente")
        except Exception as e:
            print(f"❌ Error: {e}")


# ============================
# INICIO DE LA APLICACIÓN
# ============================

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚀 INICIANDO PEAKSPORT")
    print("="*70)
    print(f"📍 Host: 0.0.0.0")
    print(f"📍 Puerto: 2323")
    print(f"📍 Entorno: {FLASK_ENV}")
    print(f"📍 Debug: {DEBUG}")
    print("="*70 + "\n")
    
    app.run(
        debug=DEBUG,
        host="0.0.0.0",
        port=2323,
        use_reloader=True
    )