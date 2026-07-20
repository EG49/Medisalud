// Reemplaza a src/lib/publicUrl.js durante las pruebas Jest.
module.exports = { publicUrl: (ruta) => '/' + String(ruta).replace(/^\//, '') };
