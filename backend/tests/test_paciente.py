"""Pruebas de las rutas protegidas del paciente (token + permisos por rol)."""

PACIENTE = {
    "nombre": "María",
    "apellidos": "Fernández",
    "cedula": "0912345678",
    "celular": "0991234567",
    "fecha_nacimiento": "1954-03-12",
}

MEDICO = {
    "rol": "medico",
    "nombre": "Carlos",
    "apellidos": "Andrade",
    "cedula": "0911111111",
    "celular": "0991111111",
    "especialidad": "Medicina General",
    "num_licencia": "MG-12345",
}


def autenticar(client, datos):
    client.post("/api/auth/registro", json=datos)
    codigo = client.post(
        "/api/auth/enviar-codigo",
        json={"cedula": datos["cedula"], "celular": datos["celular"]},
    ).get_json()["codigoDev"]
    cuerpo = client.post(
        "/api/auth/login",
        json={"cedula": datos["cedula"], "celular": datos["celular"], "codigo": codigo},
    ).get_json()
    return {"Authorization": f"Bearer {cuerpo['token']}"}


def test_sin_token_no_se_accede(client):
    assert client.get("/api/paciente/recetas").status_code == 401


def test_token_invalido_es_rechazado(client):
    resp = client.get("/api/paciente/recetas", headers={"Authorization": "Bearer no-es-un-token"})
    assert resp.status_code == 401


def test_paciente_ve_su_perfil_y_listas_vacias(client):
    auth = autenticar(client, PACIENTE)

    perfil = client.get("/api/paciente/perfil", headers=auth).get_json()
    assert perfil["nombre"] == "María"
    assert perfil["cedula"] == "0912345678"

    assert client.get("/api/paciente/recetas", headers=auth).get_json() == []
    assert client.get("/api/paciente/examenes", headers=auth).get_json() == []
    pedidos = client.get("/api/paciente/pedidos", headers=auth).get_json()
    assert pedidos == {"activo": None, "historial": []}


def test_paciente_actualiza_su_perfil(client):
    auth = autenticar(client, PACIENTE)
    resp = client.put(
        "/api/paciente/perfil",
        json={"direccion": "Cdla. Alborada", "alergias": "Penicilina"},
        headers=auth,
    )
    assert resp.status_code == 200
    assert resp.get_json()["direccion"] == "Cdla. Alborada"


def test_un_medico_no_entra_a_rutas_de_paciente(client):
    auth = autenticar(client, MEDICO)
    assert client.get("/api/paciente/recetas", headers=auth).status_code == 403


def test_medico_crea_receta_y_el_paciente_la_ve(client):
    auth_paciente = autenticar(client, PACIENTE)
    auth_medico = autenticar(client, MEDICO)

    pacientes = client.get("/api/medico/pacientes", headers=auth_medico).get_json()
    assert len(pacientes) == 1
    paciente_id = pacientes[0]["id"]

    receta = client.post(
        "/api/medico/recetas",
        json={
            "pacienteId": paciente_id,
            "hospital": "Hospital Clínica Kennedy",
            "items": [
                {
                    "medicamento": {"nombre": "Paracetamol", "presentacion": "Tableta 500mg"},
                    "cantidadTotal": 10,
                    "frecuenciaHoras": 12,
                    "duracionDias": 5,
                }
            ],
        },
        headers=auth_medico,
    )
    assert receta.status_code == 201

    recetas = client.get("/api/paciente/recetas", headers=auth_paciente).get_json()
    assert len(recetas) == 1
    assert recetas[0]["items"][0]["medicamento"]["nombre"] == "Paracetamol"

    # La receta generó una notificación para el paciente
    notificaciones = client.get("/api/paciente/notificaciones", headers=auth_paciente).get_json()
    assert any(n["tipo"] == "receta" for n in notificaciones)
