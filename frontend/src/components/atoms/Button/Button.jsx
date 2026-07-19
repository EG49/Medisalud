import styles from './Button.module.css';

/**
 * Botón base del sistema de diseño.
 * variant: 'primary' | 'outline'
 * No contiene lógica de negocio (Atomic Design: átomo puro).
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) {
  const className = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
  ].join(' ').trim();

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
