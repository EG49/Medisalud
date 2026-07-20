import { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import styles from './RepartidorRegisterForm.module.css';

const initialState = {
  nombre: '',
  apellidos: '',
  cedula: '',
  celular: '',
  vehiculo: '',
  zonaCobertura: '',
};

export default function RepartidorRegisterForm({ onRegistrarse, onIrALogin }) {
  const [datos, setDatos] = useState(initialState);

  const handleChange = (campo) => (event) => {
    setDatos((prev) => ({ ...prev, [campo]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegistrarse?.(datos);
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit} aria-label="Registro de repartidor">
      <h1 className={styles.title}>Registro de repartidor</h1>
      <p className={styles.subtitle}>
        Con tu cuenta podrás recibir y entregar pedidos de medicina.
      </p>

      <div className={styles.fields}>
        <FormField
          id="repartidor-nombre"
          label="Nombre:"
          layout="inline"
          value={datos.nombre}
          onChange={handleChange('nombre')}
          autoComplete="given-name"
          required
        />
        <FormField
          id="repartidor-apellidos"
          label="Apellidos:"
          layout="inline"
          value={datos.apellidos}
          onChange={handleChange('apellidos')}
          autoComplete="family-name"
          required
        />
        <FormField
          id="repartidor-cedula"
          label="Cédula:"
          layout="inline"
          value={datos.cedula}
          onChange={handleChange('cedula')}
          inputMode="numeric"
          required
        />
        <FormField
          id="repartidor-celular"
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
          id="repartidor-vehiculo"
          label="Vehículo:"
          layout="inline"
          value={datos.vehiculo}
          onChange={handleChange('vehiculo')}
          placeholder="Ej. Moto"
          required
        />
        <FormField
          id="repartidor-zona"
          label="Zona de cobertura:"
          layout="inline"
          value={datos.zonaCobertura}
          onChange={handleChange('zonaCobertura')}
          placeholder="Ej. Norte de Guayaquil"
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
