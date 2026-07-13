import FarmaciaBadge from '../../atoms/FarmaciaBadge/FarmaciaBadge';
import styles from './PedidoHistorialCard.module.css';

const ETIQUETA_ESTADO = {
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const formatoFecha = (isoDate) =>
  new Date(isoDate).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });

export default function PedidoHistorialCard({ pedido }) {
  const farmaciasUnicas = [
    ...new Map(pedido.items.map((item) => [item.farmacia.nombre, item.farmacia])).values(),
  ];

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.fecha}>{formatoFecha(pedido.fecha)}</span>
        <span
          className={
            pedido.estado === 'cancelado'
              ? `${styles.estado} ${styles.estadoCancelado}`
              : styles.estado
          }
        >
          {ETIQUETA_ESTADO[pedido.estado] ?? pedido.estado}
        </span>
      </div>

      <p className={styles.medicinas}>
        {pedido.items.map((item) => item.medicamentoNombre).join(', ')}
      </p>

      <div className={styles.farmacias}>
        {farmaciasUnicas.map((farmacia) => (
          <FarmaciaBadge key={farmacia.nombre} farmacia={farmacia} />
        ))}
      </div>
    </article>
  );
}
