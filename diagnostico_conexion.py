# diagnóstico_conexión.py
# Script para diagnosticar problemas de conexión a Supabase

import os
import socket
import subprocess
import sys
from dotenv import load_dotenv

load_dotenv()

print("\n" + "="*70)
print("🔧 DIAGNÓSTICO DE CONEXIÓN A SUPABASE")
print("="*70)

# 1. Verificar .env
print("\n1️⃣  VERIFICANDO .env")
print("-" * 70)

postgres_uri = os.getenv('POSTGRES_URI')
if postgres_uri:
    print("✅ POSTGRES_URI encontrada")
    # Ocultar contraseña
    uri_visible = postgres_uri[:30] + "***" + postgres_uri[-40:]
    print(f"   {uri_visible}")
else:
    print("❌ POSTGRES_URI no está en .env")
    sys.exit(1)

# 2. Probar DNS
print("\n2️⃣  PROBANDO DNS")
print("-" * 70)

host = "db.isdxcadkundexodzsjfl.supabase.co"
print(f"Resolviendo: {host}")

try:
    ip = socket.gethostbyname(host)
    print(f"✅ DNS resuelto correctamente")
    print(f"   IP: {ip}")
except socket.gaierror as e:
    print(f"❌ ERROR DE DNS: {e}")
    print("\n⚠️  ESTO SIGNIFICA:")
    print("   Tu computadora NO puede conectarse a Supabase")
    print("\n🔴 POSIBLES SOLUCIONES:")
    print("""
   1️⃣  PROBLEMA DE INTERNET:
       - Verifica que tienes conexión (abre Google en el navegador)
       - Si está lento, reinicia el router
       - Intenta con datos móviles
    
   2️⃣  PROBLEMA DE FIREWALL:
       - Comprueba si estás en red corporativa
       - Desactiva temporalmente el antivirus
       - Pide a TI que abra puerto 5432 a db.isdxcadkundexodzsjfl.supabase.co
    
   3️⃣  PROBLEMA DE DNS DEL SISTEMA:
       - Abre PowerShell como Admin y ejecuta:
         ipconfig /flushdns
       - Cambia DNS a 8.8.8.8 (Google DNS)
       
   4️⃣  PROBLEMA DE VPN/PROXY:
       - Si usas VPN, desactívala temporalmente
       - Si estás detrás de proxy, configúralo en las credenciales
""")
    sys.exit(1)

# 3. Probar puerto 5432
print("\n3️⃣  PROBANDO PUERTO 5432 (PostgreSQL)")
print("-" * 70)

try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(5)
    
    print(f"Conectando a {host}:5432...")
    result = sock.connect_ex((host, 5432))
    sock.close()
    
    if result == 0:
        print("✅ Puerto 5432 accesible")
    else:
        print("❌ Puerto 5432 NO accesible")
        print("\n⚠️  POSIBLES CAUSAS:")
        print("   - Firewall bloqueando")
        print("   - Red corporativa con restricciones")
        print("   - Supabase no está respondiendo")
except Exception as e:
    print(f"❌ Error: {e}")

# 4. Probar ping básico a Google
print("\n4️⃣  PROBANDO CONEXIÓN A INTERNET GENERAL")
print("-" * 70)

try:
    # Comando diferente según SO
    if sys.platform == "win32":
        result = subprocess.run(
            ["ping", "-n", "1", "8.8.8.8"],
            capture_output=True,
            timeout=5
        )
    else:
        result = subprocess.run(
            ["ping", "-c", "1", "8.8.8.8"],
            capture_output=True,
            timeout=5
        )
    
    if result.returncode == 0:
        print("✅ Internet funcionando (puedes alcanzar Google DNS)")
    else:
        print("❌ NO tienes conexión a internet")
        print("\n💡 SOLUCIONES:")
        print("   - Verifica tu conexión WiFi/Ethernet")
        print("   - Reinicia el router")
        print("   - Contacta a tu ISP")
except Exception as e:
    print(f"⚠️  No se pudo probar: {e}")

# 5. Resumen final
print("\n" + "="*70)
print("📋 DIAGNÓSTICO FINAL")
print("="*70)

print("""
✅ SI EL DNS SE RESOLVIÓ:
   - El problema está en Supabase o firewall
   - Intenta desde otra red (cafetería, móvil)
   - Verifica que el proyecto en Supabase no está pausado

❌ SI EL DNS NO SE RESOLVIÓ (Host desconocido):
   - Tienes problema de conectividad o firewall
   - Ejecuta esto en PowerShell (como Admin):
     ipconfig /flushdns
   - Luego intenta de nuevo

💡 PRÓXIMO PASO:
   Si todo está bien pero aún falla, ejecuta:
   python -m pip install --upgrade psycopg2-binary
   Luego intenta de nuevo
""")

print("="*70)