"""Pruebas de autenticación y registro por rol.

En modo TESTING el endpoint /auth/enviar-codigo devuelve el código en
`codigoDev`, así que el flujo completo se puede probar sin SMS real.
"""

PACIENTE = {
    "nombre": "María",
    "apellidos": "Fernández",
    "cedula": "0912345678",
    "celular": "0991234567",
    "fecha_nacimiento": "1954-03-12",
}


def registrar(client, datos, rol=None):
    cuerpo = dict(datos)
    if rol:
        cuerpo["rol"] = rol
    return client.post("/api/auth/registro", json=cuerpo)


def pedir_codigo(client, cedula, celular):
    resp = client.post("/api/auth/enviar-codigo", json={"cedula": cedula, "celular": celular})
    return resp, resp.get_json().get("codigoDev")


def test_registro_y_login(client):
    assert registrar(client, PACIENTE).status_code == 201

    resp, codigo = pedir_codigo(client, PACIENTE["cedula"], PACIENTE["celular"])
    assert resp.status_code == 200
    assert codigo is not None

    login = client.post(
        "/api/auth/login",
        json={"cedula": PACIENTE["cedula"], "celular": PACIENTE["celular"], "codigo": codigo},
    )
    assert login.status_code == 200
    cuerpo = login.get_json()
    assert cuerpo["usuario"]["nombre"] == "María"
    assert cuerpo["usuario"]["rol"] == "paciente"
    assert cuerpo["token"]  # el token protege el resto de la API


def test_login_con_codigo_incorrecto_falla(client):
    registrar(client, PACIENTE)
    pedir_codigo(client, PACIENTE["cedula"], PACIENTE["celular"])

    login = client.post(
        "/api/auth/login",
        json={"cedula": PACIENTE["cedula"], "celular": PACIENTE["celular"], "codigo": "000000"},
    )
    assert login.status_code == 401
    assert "no es correcto" in login.get_json()["message"]


def test_el_codigo_solo_sirve_una_vez(client):
    registrar(client, PACIENTE)
    _, codigo = pedir_codigo(client, PACIENTE["cedula"], PACIENTE["celular"])
    credenciales = {
        "cedula": PACIENTE["cedula"],
        "celular": PACIENTE["celular"],
        "codigo": codigo,
    }

    assert client.post("/api/auth/login", json=credenciales).status_code == 200
    assert client.post("/api/auth/login", json=credenciales).status_code == 400


def test_login_de_cuenta_inexistente(client):
    resp = client.post(
        "/api/auth/enviar-codigo", json={"cedula": "0000000000", "celular": "0000000000"}
    )
    assert resp.status_code == 404


def test_no_se_puede_repetir_cedula_ni_celular(client):
    assert registrar(client, PACIENTE).status_code == 201

    misma_cedula = {**PACIENTE, "celular": "0999999999"}
    assert registrar(client, misma_cedula).status_code == 409

    mismo_celular = {**PACIENTE, "cedula": "0999999999"}
    assert registrar(client, mismo_celular).status_code == 409


def test_registro_paciente_sin_campos_obligatorios(client):
    resp = registrar(client, {"nombre": "Sin", "apellidos": "Datos"})
    assert resp.status_code == 400
    assert "Faltan campos" in resp.get_json()["message"]


def test_registro_medico(client):
    resp = registrar(
        client,
        {
            "nombre": "Carlos",
            "apellidos": "Andrade",
            "cedula": "0911111111",
            "celular": "0991111111",
            "especialidad": "Medicina General",
            "num_licencia": "MG-12345",
        },
        rol="medico",
    )
    assert resp.status_code == 201
    assert resp.get_json()["rol"] == "medico"


def test_registro_repartidor(client):
    resp = registrar(
        client,
        {
            "nombre": "Juan",
            "apellidos": "Pérez",
            "cedula": "0922222222",
            "celular": "0992222222",
            "vehiculo": "Moto",
            "zona_cobertura": "Norte de Guayaquil",
        },
        rol="repartidor",
    )
    assert resp.status_code == 201
    assert resp.get_json()["rol"] == "repartidor"


def test_registro_admin_publico_esta_bloqueado(client):
    resp = registrar(
        client,
        {
            "nombre": "Intento",
            "apellidos": "No autorizado",
            "cedula": "0933333333",
            "celular": "0993333333",
        },
        rol="admin",
    )
    assert resp.status_code == 403
    assert "no puede registrarse" in resp.get_json()["message"]


def test_ruta_dedicada_por_rol(client):
    resp = client.post(
        "/api/auth/registro/medico",
        json={
            "nombre": "Elena",
            "apellidos": "Ríos",
            "cedula": "0944444444",
            "celular": "0994444444",
            "especialidad": "Cardiología",
            "num_licencia": "CA-999",
        },
    )
    assert resp.status_code == 201
    assert resp.get_json()["rol"] == "medico"
