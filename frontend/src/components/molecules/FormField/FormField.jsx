import Input from '../../atoms/Input/Input';
import styles from './FormField.module.css';

/**
 * Combina label + input (Atomic Design: molecule).
 * El label queda asociado al input vía htmlFor/id para lectores de pantalla.
 */
export default function FormField({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  required,
  layout = 'stacked',
}) {
  const fieldClass = layout === 'inline' ? `${styles.field} ${styles.inline}` : styles.field;

  return (
    <div className={fieldClass}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
}
