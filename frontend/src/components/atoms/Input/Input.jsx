import styles from './Input.module.css';

/**
 * Campo de entrada base. Puro, sin validaciones de negocio.
 * La lógica de validación vive en el molecule/organism que lo use.
 */
export default function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  required = false,
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      className={styles.input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      maxLength={maxLength}
      required={required}
    />
  );
}
