import { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import styles from './MedicoRegisterForm.module.css';

const initialState = {
  nombre: '',
  apellidos: '',
  cedula: '',
  celular: '',
  especialidad: '',
  numLicencia: '',
};

export default function MedicoRegisterForm({ onRegistrarse, onIrALogin }) {
  const [datos, setDatos] = useState(initialState);

  const handleChange = (campo) => (event) => {
    setDatos((prev) => ({ ...prev, [campo]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegistrarse?.(datos);
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit} aria-label="Registro de médico">
      <h1 className={styles.title}>Registro de médico</h1>
      <p className={styles.subtitle}>
        Con tu cuenta podrás emitir recetas y registrar exámenes de tus pacientes.
      </p>

      <div className={styles.fields}>
        <FormField
          id="medico-nombre"
          label="Nombre:"
          layout="inline"
          value={datos.nombre}
          onChange={handleChange('nombre')}
          autoComplete="given-name"
          required
        />
        <FormField
          id="medico-apellidos"
          label="Apellidos:"
          layout="inline"
          value={datos.apellidos}
          onChange={handleChange('apellidos')}
          autoComplete="family-name"
          required
        />
        <FormField
          id="medico-cedula"
          label="Cédula:"
          layout="inline"
          value={datos.cedula}
          onChange={handleChange('cedula')}
          inputMode="numeric"
          required
        />
        <FormField
          id="medico-celular"
          label="Celular:"
          layout="inline"
          type="tel"
          value={datos.celular}
          onChange={handleChange('celular')}
          inputMode="tel"
          autoComplete="tel"
          required
        />
        <FormField
          id="medico-especialidad"
          label="Especialidad:"
          layout="inline"
          value={datos.especialidad}
          onChange={handleChange('especialidad')}
          placeholder="Ej. Medicina General"
          required
        />
        <FormField
          id="medico-licencia"
          label="N° de licencia:"
          layout="inline"
          value={datos.numLicencia}
          onChange={handleChange('numLicencia')}
          placeholder="Ej. MG-12345"
          required
        />
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
