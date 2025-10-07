"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import styles from "./home.module.css"

export default function Home() {
  return (
    <main className={styles.container}>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.hero}
      >
        <h1 className={styles.title}>Atlante UI Design</h1>
        <p className={styles.subtitle}>
          Um sistema de design moderno, acessível e elegante — feito para
          construir interfaces com consistência e identidade.
        </p>

        <div className={styles.buttons}>
          <Link href="/development/installation" className={styles.primaryButton}>
            Começar
          </Link>
          <Link
            href="https://github.com/Atlante-TI/atlante-ui"
            target="_blank"
            className={styles.secondaryButton}
          >
            GitHub
          </Link>
        </div>
      </motion.section>

      <section className={styles.features}>
        {[
          {
            title: "Design Consistente",
            desc: "Componentes que seguem a identidade visual da Atlante para garantir harmonia.",
          },
          {
            title: "Foco em Acessibilidade",
            desc: "Construído para oferecer uma ótima experiência em qualquer contexto.",
          },
          {
            title: "Altamente Personalizável",
            desc: "Adapte facilmente cores, tipografia e espaçamento conforme o seu projeto.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={styles.card}
          >
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </section>
    </main>
  )
}
