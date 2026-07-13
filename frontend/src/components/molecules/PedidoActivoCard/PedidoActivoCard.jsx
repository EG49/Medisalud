import OrderTracker from '../../organisms/OrderTracker/OrderTracker';
import FarmaciaBadge from '../../atoms/FarmaciaBadge/FarmaciaBadge';
import styles from './PedidoActivoCard.module.css';

function tiempoDesde(isoDate) {
  const minutos = Math.round((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (minutos < 1) return 'justo ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  return `hace ${horas} h`;
}

export default function PedidoActivoCard({ pedido, sinConexion = false }) {
  const farmaciasUnicas = [
    ...new Map(pedido.items.map((item) => [item.farmacia.nombre, item.farmacia])).values(),
  ];

  return (
    <section className={styles.card} aria-label="Pedido actual">
      <h2 className={styles.titulo}>Tu pedido actual</h2>

      <OrderTracker estadoActual={pedido.estado} />

      <div className={styles.info}>
        {pedido.repartidor && (
          <p className={styles.infoLinea}>
            <strong>Repartidor:</strong> {pedido.repartidor.nombre}
          </p>
        )}
        <p className={styles.infoLinea}>
          <strong>Dirección:</strong> {pedido.direccionEntrega}
        </p>

        <div className={styles.farmacias}>
          <span className={styles.farmaciasLabel}>Tus medicinas vienen de:</span>
          {farmaciasUnicas.map((farmacia) => (
            <FarmaciaBadge key={farmacia.nombre} farmacia={farmacia} />
          ))}
        </div>
      </div>

      <p className={sinConexion ? `${styles.actualizado} ${styles.sinConexion}` : styles.actualizado}>
        {sinConexion
          ? 'Sin conexión — mostrando el último dato guardado'
          : `Actualizado ${tiempoDesde(pedido.actualizadoEn)}`}
      </p>
    </section>
  );
}
