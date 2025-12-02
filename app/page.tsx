import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { Header } from '@/components/Header';

const TreeCanvas = dynamic(() => import('@/components/TreeCanvas'), { ssr: false });

export default function Page() {
  return (
    <main className={styles.main}>
      <Header />
      <section className={styles.hero}>
        <TreeCanvas />
      </section>
    </main>
  );
}

