"""Prueba contra API y MySQL locales. Crea registros con sufijo único, sin borrar datos existentes.
Requiere APF3_ADMIN_EMAIL y APF3_ADMIN_PASSWORD de una cuenta ADMIN ya creada.
Ejecutar: python verificar_integracion.py
"""
import concurrent.futures, datetime, json, os, time, urllib.request, urllib.error
BASE=os.getenv('APF3_API_URL','http://localhost:8080')
results=[]
def call(method,path,body=None,token=None):
    headers={'Content-Type':'application/json'}
    if token: headers['Authorization']='Bearer '+token
    req=urllib.request.Request(BASE+path,data=json.dumps(body).encode() if body is not None else None,headers=headers,method=method)
    try:
        with urllib.request.urlopen(req,timeout=30) as r: return r.status,json.loads(r.read() or b'null')
    except urllib.error.HTTPError as e: return e.code,json.loads(e.read() or b'null')
def check(name,actual,expected):
    assert actual==expected,(name,actual,expected)
    results.append(name);print('OK:',name)
def main():
    suffix=str(time.time_ns());password='PruebaAPF3_2026!'
    email='cliente_'+suffix+'@example.com'
    status,u=call('POST','/api/auth/registro',dict(nombre='Cliente APF3',email=email,password=password));check('Registro CLIENTE',status,201)
    status,l=call('POST','/api/auth/login',dict(email=email,password=password));check('Login CLIENTE',status,200);client=l['token']
    status,admin=call('POST','/api/auth/login',dict(email=os.environ['APF3_ADMIN_EMAIL'],password=os.environ['APF3_ADMIN_PASSWORD']));check('Login ADMIN',status,200);token=admin['token']
    check('Mi perfil requiere JWT',call('GET','/api/auth/me')[0],401)
    status,me=call('GET','/api/auth/me',token=client);check('Mi perfil identifica comprador',me['id'],u['id'])
    check('Entradas generales restringidas',call('GET','/api/entradas',token=client)[0],403)
    event=dict(nombre='Prueba APF3 '+suffix,lugar='Lima',fecha=str(datetime.date.today()+datetime.timedelta(days=60)),capacidad=5,activo=True)
    check('Crear evento sin JWT',call('POST','/api/eventos',event)[0],401)
    check('Crear evento como CLIENTE',call('POST','/api/eventos',event,client)[0],403)
    check('Validación backend',call('POST','/api/eventos',{**event,'capacidad':0},token)[0],400)
    status,e=call('POST','/api/eventos',event,token);check('Crear evento ADMIN',status,201);eid=e['id']
    status,found=call('GET','/api/eventos/buscar?fecha='+event['fecha']);check('Consulta JPQL fecha',eid in [x['id'] for x in found],True)
    check('Compra para otro usuario rechazada',call('POST','/api/entradas',dict(usuarioId=u['id']+10000,eventoId=eid,cantidad=1),client)[0],403)
    buy=dict(usuarioId=u['id'],eventoId=eid,cantidad=4)
    with concurrent.futures.ThreadPoolExecutor(2) as pool: answers=list(pool.map(lambda _:call('POST','/api/entradas',buy,client),range(2)))
    check('Dos compras simultáneas: una aceptada y otra rechazada',sorted(x[0] for x in answers),[201,400])
    check('Capacidad inferior a ventas rechazada',call('PUT','/api/eventos/'+str(eid),{**event,'capacidad':3},token)[0],400)
    check('Comprar último cupo',call('POST','/api/entradas',{**buy,'cantidad':1},client)[0],201)
    check('Evento agotado cerrado',call('GET','/api/eventos/'+str(eid))[1]['activo'],False)
    check('No reactivar sin cupos',call('PUT','/api/eventos/'+str(eid),event,token)[1]['activo'],False)
    status,mine=call('GET','/api/entradas/mis',token=client);check('Listado propio',status,200)
    check('Sin sobreventa real en MySQL',sum(x['cantidad'] for x in mine if x['evento']['id']==eid),5)
    check('No se filtra contraseña',any('password' in x['usuario'] for x in mine),False)
    check('No borrar evento con ventas',call('DELETE','/api/eventos/'+str(eid),token=token)[0],409)
    status,other=call('POST','/api/auth/registro',dict(nombre='Otro',email='otro_'+suffix+'@example.com',password=password));_,login=call('POST','/api/auth/login',dict(email='otro_'+suffix+'@example.com',password=password))
    check('Aislamiento entre compradores',call('GET','/api/entradas/mis',token=login['token'])[1],[])
    _,temp=call('POST','/api/eventos',{**event,'nombre':'Eliminar '+suffix},token);tid=temp['id']
    check('Editar evento',call('PUT','/api/eventos/'+str(tid),{**event,'nombre':'Editado APF3'},token)[0],200)
    check('Borrar evento sin ventas',call('DELETE','/api/eventos/'+str(tid),token=token)[0],204)
    check('Evento borrado devuelve 404',call('GET','/api/eventos/'+str(tid))[0],404)
    print('\nTOTAL:',len(results),'comprobaciones aprobadas. Evento persistente:',eid)
if __name__=='__main__':main()
