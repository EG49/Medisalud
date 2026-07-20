import { Check } from 'lucide-react';
import { ESTADOS_PEDIDO } from '../../../features/paciente/mockPedidos';
import styles from './OrderTracker.module.css';

export default function OrderTracker({ estadoActual }) {
  const indiceActual = ESTADOS_PEDIDO.findIndex((e) => e.id === estadoActual);

  return (
    <ol className={styles.tracker} aria-label="Estado del pedido">
      {ESTADOS_PEDIDO.map((estado, index) => {
        const completado = index < indiceActual;
        const actual = index === indiceActual;
        const circuloClase = [
          styles.circulo,
          completado ? styles.completado : '',
          actual ? styles.actual : '',
        ].join(' ').trim();

        return (
          <li key={estado.id} className={styles.paso}>
            <span className={circuloClase} aria-hidden="true">
              {completado ? <Check size={16} /> : index + 1}
            </span>
            <span className={actual ? `${styles.label} ${styles.labelActual}` : styles.label}>
              {estado.label}
            </span>
            {index < ESTADOS_PEDIDO.length - 1 && (
              <span
                className={completado ? `${styles.linea} ${styles.lineaCompletada}` : styles.linea}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
