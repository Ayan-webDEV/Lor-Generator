import { Check, FileText, Users } from "lucide-react";
import styles from "./TemplateSelector.module.css";

export default function TemplateSelector({ templates, selected, onSelect }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Choose the original PDF template</h2>
        <p className="mt-1 text-xs text-slate-500">Only the matching supplied PDF is used. Intern count is fixed by the template.</p>
      </div>
      <div className={styles.grid}>
        {templates.map((template) => {
          const active = selected === template.id;
          return (
            <button type="button" key={template.id} onClick={() => onSelect(template.id)}
              className={`${styles.option} ${active ? styles.active : ""}`}>
              <div className={styles.optionTop}>
                <span className={styles.icon}><FileText size={18} /></span>
                {active && <span className={styles.check}><Check size={13} /></span>}
              </div>
              <strong>{template.label}</strong>
              <span className={styles.detail}><Users size={13} /> Exactly {template.internCount} records</span>
              <span className={styles.filename}>{template.file}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
