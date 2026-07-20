import { useMemo, useState } from 'react';
import Button from '../../atoms/Button/Button';
import {
  calcularDisponible,
  estaPorAcabarse,
  totalTomas,
} from '../../../features/paciente/medicineAvailability';
import styles from './SolicitarPedidoForm.module.css';

/**
 * Recibe `recetas` (documentos con items) desde la page — el organism no
 * sabe de HTTP ni de mocks, solo pinta lo que le pasan (Atomic Design).
 */
export default function SolicitarPedidoForm({
  recetas = [],
  direccionDefault,
  onCancelar,
  onConfirmar,
  deshabilitado = false,
}) {
  const medicinas = useMemo(
    () =>
      recetas
        .flatMap((receta) => receta.items)
        .filter((item) => item.activa)
        .map((item) => {
          const { disponible } = calcularDisponible(item);
          const total = item.cantidadTotal ?? totalTomas(item);
          return { item, disponible, total, sugerido: estaPorAcabarse(disponible) };
        }),
    [recetas]
  );

  const [seleccion, setSeleccion] = useState(() =>
    Object.fromEntries(medicinas.map((m) => [m.item.id, m.sugerido]))
  );
  const [direccion, setDireccion] = useState(direccionDefault);
  const [editandoDireccion, setEditandoDireccion] = useState(false);

  const toggleMedicina = (id) => {
    setSeleccion((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const medicamentosSeleccionados = medicinas
      .filter((m) => seleccion[m.item.id])
      .map((m) => m.item);
    onConfirmar?.({ direccion, medicamentos: medicamentosSeleccionados });
  };

  const haySeleccion = Object.values(seleccion).some(Boolean);

  return (
    <form className={styles.card} onSubmit={handleSubmit} aria-label="Solicitar nueva entrega">
      <h2 className={styles.titulo}>Solicitar nueva entrega</h2>
      <p className={styles.subtitulo}>
        Ya marcamos las medicinas que se te están por acabar. Puedes agregar o quitar las que quieras.
      </p>

      <ul className={styles.lista}>
        {medicinas.map(({ item, disponible, total, sugerido }) => (
          <li key={item.id} className={styles.item}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={!!seleccion[item.id]}
                onChange={() => toggleMedicina(item.id)}
              />
              <span>
                <span className={styles.nombre}>{item.medicamento.nombre}</span>
                <span className={styles.disponible}>
                  {disponible} de {total} disponibles
                  {sugerido && <span className={styles.badgeSugerido}>Se está acabando</span>}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className={styles.direccionBloque}>
        <p className={styles.direccionLabel}>Dirección de entrega</p>
        {editandoDireccion ? (
          <input
            className={styles.direccionInput}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            aria-label="Dirección de entrega"
          />
        ) : (
          <p className={styles.direccionTexto}>{direccion}</p>
        )}
        <button
          type="button"
          className={styles.cambiarDireccion}
          onClick={() => setEditandoDireccion((v) => !v)}
        >
          {editandoDireccion ? 'Usar esta dirección' : 'Cambiar dirección para esta entrega'}
        </button>
      </div>

      <div className={styles.acciones}>
        <button type="button" className={styles.cancelar} onClick={onCancelar}>
          Cancelar
        </button>
        <Button type="submit" disabled={!haySeleccion || deshabilitado}>
          {deshabilitado ? 'Enviando…' : 'Confirmar pedido'}
        </Button>
      </div>
    </form>
  );
}
