import { useState } from 'react';
import CuidadorItem from '../../molecules/CuidadorItem/CuidadorItem';
import Button from '../../atoms/Button/Button';
import styles from './CuidadoresSection.module.css';

export default function CuidadoresSection({
  vinculados,
  solicitudesRecibidas,
  invitacionesEnviadas,
  onAprobar,
  onRechazar,
  onQuitar,
  onCancelarInvitacion,
  onInvitar,
}) {
  const [mostrarInvitar, setMostrarInvitar] = useState(false);
  const [identificador, setIdentificador] = useState('');

  const handleInvitar = (event) => {
    event.preventDefault();
    if (!identificador.trim()) return;
    onInvitar?.(identificador.trim());
    setIdentificador('');
    setMostrarInvitar(false);
  };

  const hayPendientes = solicitudesRecibidas.length > 0 || invitacionesEnviadas.length > 0;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>Cuidadores vinculados</h2>
        {!mostrarInvitar && (
          <button type="button" className={styles.invitarBtn} onClick={() => setMostrarInvitar(true)}>
            + Invitar cuidador
          </button>
        )}
      </div>

      {mostrarInvitar && (
        <form className={styles.formulario} onSubmit={handleInvitar}>
          <label htmlFor="identificadorCuidador" className={styles.formLabel}>
            Cédula o celular de la persona a invitar
          </label>
          <div className={styles.formFila}>
            <input
              id="identificadorCuidador"
              className={styles.formInput}
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              placeholder="Ej. 0991234567"
            />
            <Button type="submit">Enviar invitación</Button>
          </div>
          <button type="button" className={styles.formCancelar} onClick={() => setMostrarInvitar(false)}>
            Cancelar
          </button>
        </form>
      )}

      {vinculados.length > 0 ? (
        <ul className={styles.lista}>
          {vinculados.map((c) => (
            <CuidadorItem
              key={c.id}
              estado="vinculado"
              nombre={c.nombre}
              relacion={c.relacion}
              onQuitar={() => onQuitar(c.id)}
            />
          ))}
        </ul>
      ) : (
        <p className={styles.vacio}>Todavía no tienes cuidadores vinculados.</p>
      )}

      {hayPendientes && (
        <div className={styles.pendientesBloque}>
          <p className={styles.pendientesTitulo}>Pendientes</p>
          <ul className={styles.lista}>
            {solicitudesRecibidas.map((s) => (
              <CuidadorItem
                key={s.id}
                estado="solicitud_recibida"
                nombre={s.nombre}
                relacion={s.relacion}
                onAprobar={() => onAprobar(s.id)}
                onRechazar={() => onRechazar(s.id)}
              />
            ))}
            {invitacionesEnviadas.map((i) => (
              <CuidadorItem
                key={i.id}
                estado="invitacion_enviada"
                nombre={i.destinatario}
                onCancelarInvitacion={() => onCancelarInvitacion(i.id)}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
