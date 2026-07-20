def test_registro_y_login(client):
    registro = client.post(
        "/api/auth/registro",
        json={
            "nombre": "María",
            "apellidos": "Fernández",
            "cedula": "0912345678",
            "celular": "0991234567",
            "fecha_nacimiento": "1954-03-12",
        },
    )
    assert registro.status_code == 201

    codigo_resp = client.post(
        "/api/auth/enviar-codigo",
        json={"cedula": "0912345678", "celular": "0991234567"},
    )
    assert codigo_resp.status_code == 200

    # El código real no se puede leer desde el test (se "envía" por consola);
    # accedemos directo al almacén en memoria del servicio, igual que lo
    # haría el proveedor de SMS en producción.
    from app.services import auth_service

    codigo = auth_service._codigos_pendientes["0991234567"]["codigo"]

    login_resp = client.post(
        "/api/auth/login",
        json={"cedula": "0912345678", "celular": "0991234567", "codigo": codigo},
    )
    assert login_resp.status_code == 200
    assert login_resp.get_json()["nombre"] == "María"


def test_login_con_codigo_incorrecto_falla(client):
    client.post(
        "/api/auth/registro",
        json={
            "nombre": "Ana",
            "apellidos": "Ruiz",
            "cedula": "0900000000",
            "celular": "0980000000",
            "fecha_nacimiento": "1960-01-01",
        },
    )
    client.post(
        "/api/auth/enviar-codigo", json={"cedula": "0900000000", "celular": "0980000000"}
    )

    login_resp = client.post(
        "/api/auth/login",
        json={"cedula": "0900000000", "celular": "0980000000", "codigo": "000000"},
    )
    assert login_resp.status_code == 400
