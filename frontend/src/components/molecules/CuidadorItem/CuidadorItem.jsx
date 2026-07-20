import styles from './CuidadorItem.module.css';

/**
 * estado: 'vinculado' | 'solicitud_recibida' | 'invitacion_enviada'
 * Un mismo componente para los 3 casos -- solo cambian las acciones disponibles.
 */
export default function CuidadorItem({ estado, nombre, relacion, onAprobar, onRechazar, onQuitar, onCancelarInvitacion }) {
  return (
    <li className={styles.item}>
      <div className={styles.avatar} aria-hidden="true">
        {nombre?.[0]?.toUpperCase() ?? '?'}
      </div>

      <div className={styles.info}>
        <p className={styles.nombre}>{nombre}</p>
        {relacion && <p className={styles.relacion}>{relacion}</p>}
        {estado === 'invitacion_enviada' && <p className={styles.pendiente}>Invitación pendiente</p>}
        {estado === 'solicitud_recibida' && <p className={styles.pendiente}>Solicitó acceso a tu cuenta</p>}
      </div>

      <div className={styles.acciones}>
        {estado === 'vinculado' && (
          <button type="button" className={styles.quitar} onClick={onQuitar}>
            Quitar acceso
          </button>
        )}
        {estado === 'solicitud_recibida' && (
          <>
            <button type="button" className={styles.rechazar} onClick={onRechazar}>
              Rechazar
            </button>
            <button type="button" className={styles.aprobar} onClick={onAprobar}>
              Aprobar
            </button>
          </>
        )}
        {estado === 'invitacion_enviada' && (
          <button type="button" className={styles.rechazar} onClick={onCancelarInvitacion}>
            Cancelar
          </button>
        )}
      </div>
    </li>
  );
}
