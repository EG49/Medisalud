import { useState } from 'react';
import FormField from '../FormField/FormField';
import Button from '../../atoms/Button/Button';
import styles from './EditableSection.module.css';

/**
 * Sección genérica de Perfil: modo lectura (texto) / modo edición (FormField por campo).
 * fields: [{ id, label, value, type, editable }]
 * No sabe nada del dominio (datos personales, alergias, etc.) -- reusable.
 */
export default function EditableSection({ title, fields, onSave }) {
  const [editando, setEditando] = useState(false);
  const [valores, setValores] = useState(
    Object.fromEntries(fields.map((f) => [f.id, f.value]))
  );

  const handleChange = (id) => (event) => {
    setValores((prev) => ({ ...prev, [id]: event.target.value }));
  };

  const handleGuardar = () => {
    onSave?.(valores);
    setEditando(false);
  };

  const handleCancelar = () => {
    setValores(Object.fromEntries(fields.map((f) => [f.id, f.value])));
    setEditando(false);
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>{title}</h2>
        {!editando && (
          <button type="button" className={styles.editarBtn} onClick={() => setEditando(true)}>
            Editar
          </button>
        )}
      </div>

      {editando ? (
        <div className={styles.formulario}>
          {fields.map((field) =>
            field.editable === false ? (
              <p key={field.id} className={styles.linea}>
                <span className={styles.label}>{field.label}</span>
                <span>{field.value}</span>
              </p>
            ) : (
              <FormField
                key={field.id}
                id={field.id}
                label={field.label}
                layout="inline"
                type={field.type ?? 'text'}
                value={valores[field.id]}
                onChange={handleChange(field.id)}
              />
            )
          )}
          <div className={styles.acciones}>
            <button type="button" className={styles.cancelar} onClick={handleCancelar}>
              Cancelar
            </button>
            <Button onClick={handleGuardar}>Guardar</Button>
          </div>
        </div>
      ) : (
        <dl className={styles.lista}>
          {fields.map((field) => (
            <div key={field.id} className={styles.linea}>
              <dt className={styles.label}>{field.label}</dt>
              <dd className={styles.valor}>{field.value || '—'}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
