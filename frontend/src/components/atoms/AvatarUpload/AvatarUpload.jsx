import { useRef } from 'react';
import styles from './AvatarUpload.module.css';

/**
 * Selector de foto de perfil (círculo + botón "Añadir foto").
 * previewUrl viene del padre (organism), este átomo no guarda estado propio
 * de archivo, solo dispara onChange con el File seleccionado.
 */
export default function AvatarUpload({ previewUrl, onChange, label = 'Añadir foto' }) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onChange?.(file);
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.circle}
        onClick={() => inputRef.current?.click()}
        aria-label={previewUrl ? 'Cambiar foto de perfil' : 'Añadir foto de perfil'}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Foto de perfil" className={styles.image} />
        ) : (
          <span className={styles.plus} aria-hidden="true">+</span>
        )}
      </button>

      <button type="button" className={styles.label} onClick={() => inputRef.current?.click()}>
        {label}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
    </div>
  );
}
