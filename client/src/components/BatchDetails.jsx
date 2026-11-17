import { CalendarDays, Layers3 } from "lucide-react";
import styles from "./BatchDetails.module.css";

export default function BatchDetails({ groupName, setGroupName }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Batch details</h2>
        <p className="mt-1 text-xs text-slate-500">
          The group name appears only in the Batch / Record field on page 1.
        </p>
      </div>
      <label className={styles.field}>
        <span>
          <Layers3 size={14} /> Group / batch name
        </span>
        <input
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          placeholder="e.g. VELoop Rewards Internship GPT A:B"
          maxLength={90}
        />
      </label>
      <div className={styles.dateNote}>
        <CalendarDays size={16} />
        <div>
          <strong>Record & signing dates are automatic</strong>
          <small>
            Today's date is applied by the server using Asia/Kolkata time when
            you generate the PDF.
          </small>
        </div>
      </div>
    </section>
  );
}
