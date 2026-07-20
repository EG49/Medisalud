import { Download } from 'lucide-react';
import Button from '../../atoms/Button/Button';
import styles from './ExamenCard.module.css';

const formatoFecha = (isoDate) =>
  new Date(isoDate).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export default function ExamenCard({ examen }) {
  const { tipo, fecha, laboratorio, medico, resultadoSimple, archivoUrl } = examen;

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.tipo}>{tipo}</h3>
        <p className={styles.meta}>
          {formatoFecha(fecha)} · {laboratorio}
        </p>
      </header>

      <p className={styles.resultado}>{resultadoSimple}</p>

      <p className={styles.medico}>Solicitado por {medico.nombre}</p>

      <a href={archivoUrl} download className={styles.descarga}>
        <Button variant="outline">
          <span className={styles.descargaContenido}>
            <Download size={18} aria-hidden="true" />
            Descargar informe
          </span>
        </Button>
      </a>
    </article>
  );
}
