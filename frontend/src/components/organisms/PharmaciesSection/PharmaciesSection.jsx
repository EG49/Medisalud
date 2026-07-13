import styles from './PharmaciesSection.module.css';

const FARMACIAS = [
  { nombre: 'Fybeca', archivo: 'fybeca.png' },
  { nombre: 'Farmacias EC', archivo: 'farmaciasec.png' },
  { nombre: 'Medicity', archivo: 'medicity.png' },
  { nombre: 'Sana Sana', archivo: 'sanasana.png' },
  { nombre: 'Santa Martha', archivo: 'santamartha.png' },
  { nombre: 'Cruz Azul', archivo: 'cruzazul.png' },
  { nombre: "Pharmacy's", archivo: 'pharmacys.png' },
  { nombre: 'Farmaliv', archivo: 'farmaliv.png' },
  { nombre: 'Aliada', archivo: 'aliada-08.png' },
];

export default function PharmaciesSection() {
  return (
    <section className={styles.section} aria-label="Farmacias aliadas">
      <h2 className={styles.titulo}>¡Todas estas farmacias a un clic de distancia!</h2>
      <p className={styles.subtitulo}>
        Trabajamos con cadenas farmacéuticas reconocidas para ofrecer disponibilidad y confianza.
      </p>

      <div className={styles.grid}>
        {FARMACIAS.map((farmacia) => (
          <div key={farmacia.archivo} className={styles.logoCard}>
            <img src={`/assets/farmacias/${farmacia.archivo}`} alt={farmacia.nombre} />
          </div>
        ))}
      </div>
    </section>
  );
}
