from flask import Blueprint
from Cliente.principal.controlador import registrar_rutas
 
bp_cliente_principal = Blueprint('cliente_principal', __name__)

registrar_rutas(bp_cliente_principal)