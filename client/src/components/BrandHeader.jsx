import { FileCheck2, ShieldCheck } from "lucide-react";
import styles from "./BrandHeader.module.css";

export default function BrandHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}><span>V</span></div>
        <div>
          <div className={styles.brandName}>VELOOP REWARDS</div>
          <div className={styles.brandSub}>INTERNSHIP OPERATIONS</div>
        </div>
      </div>
      <div className={styles.secure}><ShieldCheck size={15} /> INTERNAL GENERATOR</div>
    </header>
  );
}
