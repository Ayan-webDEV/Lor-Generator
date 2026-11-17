import { Mail, UserRound, BriefcaseBusiness, Fingerprint } from "lucide-react";
import styles from "./InternFields.module.css";

const fields = [
  {
    key: "name",
    label: "Full name",
    placeholder: "Intern full name",
    icon: UserRound,
  },
  {
    key: "internId",
    label: "Intern ID",
    placeholder: "VLRINT20260XXXX",
    icon: Fingerprint,
  },
  {
    key: "email",
    label: "Email address",
    placeholder: "intern@example.com",
    icon: Mail,
    type: "email",
  },
  {
    key: "domain",
    label: "Internship domain",
    placeholder: "e.g. Frontend Developer",
    icon: BriefcaseBusiness,
  },
];

export default function InternFields({ index, intern, onChange }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.number}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <strong>Intern {index + 1}</strong>
          <small>Selection record details</small>
        </div>
        <span className={styles.approved}>APPROVED</span>
      </div>
      <div className={styles.fields}>
        {fields.map(({ key, label, placeholder, icon: Icon, type }) => (
          <label key={key} className={styles.field}>
            <span>
              <Icon size={13} /> {label}
            </span>
            <input
              type={type || "text"}
              value={intern[key]}
              onChange={(event) => onChange(key, event.target.value)}
              placeholder={placeholder}
              maxLength={
                key === "email"
                  ? 160
                  : key === "name"
                    ? 90
                    : key === "domain"
                      ? 70
                      : 40
              }
              required
            />
            {key === "email" && (
              <small>Automatically masked in the generated PDF.</small>
            )}
          </label>
        ))}
      </div>
    </article>
  );
}
