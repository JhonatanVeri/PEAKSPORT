import os
from dotenv import load_dotenv

load_dotenv()

FLASK_ENV = os.getenv("FLASK_ENV", "development")

# Usar POSTGRES_URI de Railway
POSTGRES_URI = os.getenv("POSTGRES_URI")

if not POSTGRES_URI:
    POSTGRES_URI = "sqlite:///peaksport.db"  # Fallback local

SQLALCHEMY_CONFIG = {
    'SQLALCHEMY_DATABASE_URI': POSTGRES_URI,
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
}

# Solo agregar opciones si NO es SQLite
if not POSTGRES_URI.startswith('sqlite'):
    SQLALCHEMY_CONFIG['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True,
        'connect_args': {
            'connect_timeout': 10,
            'sslmode': 'require'
        }
    }

SECRET_KEY = os.getenv("SECRET_KEY", "dev-key-change-in-production")
DEBUG = FLASK_ENV == 'development'