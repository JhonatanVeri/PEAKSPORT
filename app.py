# -------------------------------------------------------------
# Archivo: app.py
# Descripción: Punto de entrada principal de la aplicación Flask
#              - Registra blueprints
#              - Inicializa conexión a PostgreSQL (Supabase)
# Autor: Carlos Andrés Jiménez Sarmiento (CJ)
# Contacto: carloscjdev@gmail.com, cjimenez@consultoria.comunit.co
# Versión: 2.1.0 (Supabase)
# Última actualización: 2025-11-02
# -------------------------------------------------------------

# ============================
# LIBRERÍAS E IMPORTACIONES
# ============================
import os
from dotenv import load_dotenv
from flask import Flask, render_template, session, jsonify
from flask_session import Session
from Log_PeakSport import log_error
from Modelo_de_Datos_PostgreSQL_y_CRUD.conexion_postgres import PostgreSQLConnection
from config import SECRET_KEY

# Registra todos los modelos/mappers en el metadata
from Modelo_de_Datos_PostgreSQL_y_CRUD import (
    Usuarios, 
    Productos, 
    Producto_Imagenes, 
    Categorias
)
from Modelo_de_Datos_PostgreSQL_y_CRUD.associations import producto_categorias

# Cargar variables del .env
load_dotenv()

# ============================
# INICIALIZACIÓN DE LA APP Y CONEXIÓN
# ============================

app = Flask(__name__)

# ============================
# CONFIGURACIÓN SUPABASE
# ============================

# Obtener URI según el entorno
ENV = os.getenv('FLASK_ENV', 'development')

if ENV == 'production':
    # En producción, usar connection pool
    POSTGRES_URI = os.getenv('POSTGRES_POOL_URI')
    print("🔧 Modo PRODUCCIÓN - Usando Connection Pool")
else:
    # En desarrollo, usar URI directa
    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print("🔧 Modo DESARROLLO - Usando URI directa")

if not POSTGRES_URI:
    print("❌ ERROR: No se encontró POSTGRES_URI ni POSTGRES_POOL_URI en .env")
    raise Exception("Base de datos no configurada")

# Configuración de SQLAlchemy para Supabase
app.config['SQLALCHEMY_DATABASE_URI'] = POSTGRES_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
    'connect_args': {
        'connect_timeout': 10,
        'sslmode': 'require'
    }
}

# Logging de SQL en desarrollo
if ENV == 'development':
    app.config['SQLALCHEMY_ECHO'] = False

print(f"✅ Conectando a Supabase...")

# ============================
# INICIALIZAR CONEXIÓN PostgreSQL
# ============================

conexion_pg = PostgreSQLConnection()
conexion_pg.init_app(app)

print("✅ PostgreSQL Connection inicializada")

# ============================
# CONFIGURACIÓN DE SESIONES
# ============================

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = SECRET_KEY or 'dev-key-change-in-production'
app.config['PERMANENT_SESSION_LIFETIME'] = 1800  # 30 minutos
Session(app)

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

print("✅ Blueprints registrados")

# ============================
# RUTAS PRINCIPALES
# ============================

@app.route('/')
def pagina_principal():
    """
    Pantalla pública (no requiere sesión).
    Si hay sesión, se muestra el nombre y opciones; de lo contrario, botones de ingresar/registrar.
    """
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
    """
    Health check endpoint para verificar que la app está viva
    """
    try:
        # Intentar hacer una consulta simple
        result = conexion_pg.engine.execute("SELECT 1")
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'version': '2.1.0',
            'environment': ENV
        }), 200
    except Exception as e:
        log_error(f"[health_check] error: {e}")
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500


# ============================
# MANEJADORES DE ERRORES
# ============================

@app.errorhandler(404)
def pagina_no_encontrada(error):
    """Manejo de rutas no encontradas"""
    try:
        return render_template('404.html'), 404
    except:
        return "<h1>404 - Página no encontrada</h1>", 404


@app.errorhandler(500)
def error_servidor(error):
    """Manejo de errores del servidor"""
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
        'app_version': '2.1.0',
        'logged_in': session.get('logged_in', False),
        'usuario_nombre': session.get('usuario_nombre', ''),
        'environment': ENV
    }


# ============================
# CLI COMMANDS
# ============================

@app.cli.command()
def test_db():
    """Comando: flask test-db - Prueba conexión a Supabase"""
    try:
        print("\n🔍 Probando conexión a Supabase...")
        result = conexion_pg.engine.execute("SELECT version()")
        version = result.fetchone()[0]
        print(f"✅ Conexión exitosa!")
        print(f"📊 {version.split(',')[0]}")
    except Exception as e:
        log_error(f"[test_db] error: {e}")
        print(f"❌ Error: {e}")


# ============================
# INICIO DE LA APLICACIÓN
# ============================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 INICIANDO PEAKSPORT")
    print("="*60)
    print(f"📍 Host: 0.0.0.0")
    print(f"📍 Puerto: 2323")
    print(f"📍 Entorno: {ENV}")
    print(f"📍 Debug: {ENV == 'development'}")
    print("="*60 + "\n")
    
    app.run(
        debug=(ENV == 'development'),
        host="0.0.0.0",
        port=2323,
        use_reloader=True
    )