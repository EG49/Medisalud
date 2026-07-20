import { useEffect, useRef, useState } from 'react';
import Header from '../../organisms/Header/Header';
import Footer from '../../organisms/Footer/Footer';
import Button from '../../atoms/Button/Button';
import StepCard from '../../organisms/StepCard/StepCard';
import BenefitsSection from '../../organisms/BenefitsSection/BenefitsSection';
import PharmaciesSection from '../../organisms/PharmaciesSection/PharmaciesSection';
import styles from './PublicHomePage.module.css';
import { publicUrl } from '../../../lib/publicUrl';

const SECCIONES = ['#inicio', '#como-funciona', '#servicio', '#contactos'];

export default function PublicHomePage({ onIngresar, onRegistrarse, scrollTargetInicial }) {
  const [activeHref, setActiveHref] = useState(scrollTargetInicial ?? '#inicio');
  const observadorRef = useRef(null);

  useEffect(() => {
    if (scrollTargetInicial) {
      // Pequeño delay: hay que esperar a que el DOM de la sección exista.
      const id = setTimeout(() => {
        document.querySelector(scrollTargetInicial)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(id);
    }
  }, [scrollTargetInicial]);

  useEffect(() => {
    const elementos = SECCIONES
      .map((href) => document.querySelector(href))
      .filter(Boolean);

    observadorRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    elementos.forEach((el) => observadorRef.current.observe(el));
    return () => observadorRef.current?.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Header onIngresar={onIngresar} onRegistrarse={onRegistrarse} activeHref={activeHref} />

      <main>
        <section id="inicio" className={styles.hero}>
          <div className={styles.heroTexto}>
            <h1 className={styles.heroTitulo}>Tu salud al alcance de un clic</h1>
            <p className={styles.heroSubtitulo}>
              Conectamos a adultos mayores con farmacias, recetas médicas y servicios de salud
              de forma sencilla y segura.
            </p>
            <div className={styles.heroBotones}>
              <Button onClick={onIngresar}>Ver mis resultados</Button>
              <Button variant="outline" onClick={onRegistrarse}>
                Únete a nosotros
              </Button>
            </div>
          </div>
          <img src={publicUrl('assets/landing-hero.png')} alt="" className={styles.heroImagen} />
        </section>

        <section id="como-funciona" className={styles.pasos}>
          <h2 className={styles.pasosTitulo}>¿Cómo funciona?</h2>
          <div className={styles.pasosGrid}>
            <StepCard
              titulo="Regístrate"
              descripcion="Ingresa tu cédula y número celular."
              imagenSrc={publicUrl('assets/paso-registrarte.png')}
            />
            <StepCard
              titulo="Busca Medicamento"
              descripcion="Encuentra medicamentos disponibles en farmacias cercanas."
              imagenSrc={publicUrl('assets/paso-buscar-medicamento.png')}
            />
            <StepCard
              titulo="Recibe Asistencia"
              descripcion="Gestionamos el acceso a tus medicamentos y servicios de salud."
              imagenSrc={publicUrl('assets/paso-recibir-asistencia.png')}
            />
          </div>
        </section>

        <BenefitsSection />

        <section className={styles.consulta}>
          <div className={styles.consultaTexto}>
            <h2 className={styles.consultaTitulo}>Consulta tus resultados médicos de forma simple</h2>
            <p className={styles.consultaSubtitulo}>
              Accede a tus exámenes de laboratorio, recetas médicas y ordena tus medicamentos
              desde la comodidad de tu hogar.
            </p>
          </div>
          <img src={publicUrl('assets/consulta-doctor.png')} alt="" className={styles.consultaImagen} />
        </section>

        <PharmaciesSection />
      </main>

      <div id="contactos">
        <Footer />
      </div>
    </div>
  );
}
