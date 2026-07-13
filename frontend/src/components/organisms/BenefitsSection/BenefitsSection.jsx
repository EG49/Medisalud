import { Smile, ShieldCheck, FileHeart, BellRing, Users } from 'lucide-react';
import styles from './BenefitsSection.module.css';

const BENEFICIOS = [
  { icon: Smile, texto: 'Fácil de usar' },
  { icon: ShieldCheck, texto: 'Información protegida' },
  { icon: FileHeart, texto: 'Historial médico digital' },
  { icon: BellRing, texto: 'Recordatorios de medicación' },
  { icon: Users, texto: 'Acceso para familiares y cuidadores' },
];

export default function BenefitsSection() {
  return (
    <section id="servicio" className={styles.section} aria-label="Beneficios">
      <h2 className={styles.titulo}>BENEFICIOS</h2>

      <div className={styles.contenido}>
        <ul className={styles.lista}>
          {BENEFICIOS.map(({ icon: Icon, texto }) => (
            <li key={texto} className={styles.item}>
              <Icon size={32} aria-hidden="true" />
              <span>{texto}</span>
            </li>
          ))}
        </ul>

        <img src="/assets/beneficios-ilustracion.png" alt="" className={styles.imagen} />
      </div>
    </section>
  );
}
