import { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import styles from './LoginForm.module.css';

/**
 * Formulario de acceso: cédula + celular + código de verificación (OTP).
 * No maneja password tradicional -- pensado para adultos mayores,
 * el código llega por SMS al celular registrado.
 *
 * onEnviarCodigo / onIniciarSesion / onRegistrarse se inyectan desde la page,
 * que a su vez los conecta con api/authApi.js. El organism no sabe de HTTP.
 */
export default function LoginForm({ onEnviarCodigo, onIniciarSesion, onRegistrarse }) {
  const [cedula, setCedula] = useState('');
  const [celular, setCelular] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  const handleEnviarCodigo = async () => {
    await onEnviarCodigo?.({ cedula, celular });
    setCodigoEnviado(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onIniciarSesion?.({ cedula, celular, codigo });
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">
      <FormField
        id="cedula"
        label="Cédula de identidad:"
        name="cedula"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
        inputMode="numeric"
        autoComplete="off"
        placeholder="0000000000"
        required
      />

      <div className={styles.row}>
        <FormField
          id="celular"
          label="Número celular:"
          name="celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="09XXXXXXXX"
          required
        />
        <Button type="button" variant="outline" onClick={handleEnviarCodigo}>
          Enviar código
        </Button>
      </div>

      <FormField
        id="codigo"
        label="Código de verificación:"
        name="codigo"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        inputMode="numeric"
        maxLength={6}
        placeholder="Código enviado por SMS"
        required
      />
      {codigoEnviado && (
        <p className={styles.hint} role="status">Código enviado a tu celular.</p>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="primary" onClick={onRegistrarse}>
          Registrarse
        </Button>
        <Button type="submit" variant="primary">
          Iniciar sesión
        </Button>
      </div>
    </form>
  );
}
