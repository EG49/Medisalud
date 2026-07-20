"""Error de API con código HTTP. Los services lanzan ApiError y el handler
global (registrado en app/__init__.py) lo convierte en JSON {message: ...},
que es lo que frontend/src/api/httpClient.js espera leer cuando !response.ok."""


class ApiError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
