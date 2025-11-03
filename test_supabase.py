# test_supabase.py
from app import create_app, db
from Modelo_de_Datos_PostgreSQL_y_CRUD import Usuarios, Productos

app = create_app('production')

with app.app_context():
    try:
        # Probar conexión
        db.session.execute("SELECT 1")
        print("✓ Conexión a Supabase exitosa")
        
        # Crear tablas
        db.create_all()
        print("✓ Tablas creadas")
        
        # Contar registros
        usuario_count = Usuarios.query.count()
        producto_count = Productos.query.count()
        
        print(f"✓ Usuarios en BD: {usuario_count}")
        print(f"✓ Productos en BD: {producto_count}")
        
    except Exception as e:
        print(f"✗ Error: {e}")