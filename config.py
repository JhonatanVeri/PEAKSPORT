import os
from dotenv import load_dotenv

load_dotenv()

# ============================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================

FLASK_ENV = os.getenv("FLASK_ENV", "development")

# URI según el entorno
if FLASK_ENV == 'production':
    # En producción, usar connection pool (puerto 6543)
    POSTGRES_URI = os.getenv("POSTGRES_POOL_URI")
else:
    # En desarrollo, usar URI directa (puerto 5432)
    POSTGRES_URI = os.getenv("POSTGRES_URI")

# Validar que existe la URI
if not POSTGRES_URI:
    raise ValueError("❌ POSTGRES_URI ni POSTGRES_POOL_URI están definidas en .env")

# ============================
# CONFIGURACIÓN DE SQLALCHEMY
# ============================

SQLALCHEMY_CONFIG = {
    'SQLALCHEMY_DATABASE_URI': POSTGRES_URI,
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'SQLALCHEMY_ENGINE_OPTIONS': {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True,
        'connect_args': {
            'connect_timeout': 10,
            'sslmode': 'require'
        }
    }
}

# En desarrollo, mostrar queries SQL
if FLASK_ENV == 'development':
    SQLALCHEMY_CONFIG['SQLALCHEMY_ECHO'] = False

# ============================
# SEGURIDAD
# ============================

SECRET_KEY = os.getenv("SECRET_KEY", "dev-key-change-in-production")

# ============================
# DEBUG
# ============================

DEBUG = FLASK_ENV == 'development'