import { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import AvatarUpload from '../../atoms/AvatarUpload/AvatarUpload';
import Button from '../../atoms/Button/Button';
import styles from './RegisterForm.module.css';

const initialState = {
  nombre: '',
  apellidos: '',
  cedula: '',
  fechaNacimiento: '',
  celular: '',
};

/**
 * Formulario de registro. Recoge los datos base del Usuario (ver modelo de datos).
 * La foto se sube como File aparte; el resto viaja como JSON.
 */
export default function RegisterForm({ onRegistrarse, onIrALogin }) {
  const [datos, setDatos] = useState(initialState);
  const [foto, setFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (campo) => (event) => {
    setDatos((prev) => ({ ...prev, [campo]: event.target.value }));
  };

  const handleFoto = (file) => {
    setFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegistrarse?.({ ...datos, foto });
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit} aria-label="Formulario de registro">
      <h1 className={styles.title}>REGÍSTRATE CON NOSOTROS</h1>
      <p className={styles.subtitle}>Tan fácil como saber tu cédula y número celular</p>

      <div className={styles.content}>
        <AvatarUpload previewUrl={previewUrl} onChange={handleFoto} />

        <div className={styles.fields}>
          <FormField
            id="nombre"
            label="Nombre:"
            layout="inline"
            value={datos.nombre}
            onChange={handleChange('nombre')}
            autoComplete="given-name"
            required
          />
          <FormField
            id="apellidos"
            label="Apellidos:"
            layout="inline"
            value={datos.apellidos}
            onChange={handleChange('apellidos')}
            autoComplete="family-name"
            required
          />
          <FormField
            id="cedula"
            label="CI:"
            layout="inline"
            value={datos.cedula}
            onChange={handleChange('cedula')}
            inputMode="numeric"
            required
          />
          <FormField
            id="fechaNacimiento"
            label="Fecha de nacimiento:"
            layout="inline"
            type="date"
            value={datos.fechaNacimiento}
            onChange={handleChange('fechaNacimiento')}
            required
          />
          <FormField
            id="celular"
            label="Celular:"
            layout="inline"
            type="tel"
            value={datos.celular}
            onChange={handleChange('celular')}
            inputMode="tel"
            autoComplete="tel"
            required
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.linkAction} onClick={onIrALogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
        <Button type="submit">Registrarse</Button>
      </div>
    </form>
  );
}
