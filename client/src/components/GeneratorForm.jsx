import { useEffect, useMemo, useState } from "react";
import { Download, LoaderCircle, Sparkles } from "lucide-react";
import { fetchTemplates, generatePdf } from "../services/lorApi.js";
import TemplateSelector from "./TemplateSelector.jsx";
import BatchDetails from "./BatchDetails.jsx";
import InternFields from "./InternFields.jsx";
import styles from "./GeneratorForm.module.css";

const EMPTY = { name: "", internId: "", email: "", domain: "" };

export default function GeneratorForm() {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState("3");
  const [groupName, setGroupName] = useState("");
  const [interns, setInterns] = useState(
    Array.from({ length: 3 }, () => ({ ...EMPTY })),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchTemplates()
      .then((data) => setTemplates(data.templates))
      .catch((err) => setError(err.message));
  }, []);

  const selected = useMemo(
    () => templates.find((item) => item.id === template),
    [templates, template],
  );

  function chooseTemplate(id) {
    setTemplate(id);
    const count = Number(id);
    setInterns(
      Array.from({ length: count }, (_, index) => ({
        ...(interns[index] || EMPTY),
      })),
    );
    setError("");
    setSuccess("");
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return "";
    });
  }

  function updateIntern(index, key, value) {
    setInterns((current) =>
      current.map((intern, i) =>
        i === index ? { ...intern, [key]: value } : intern,
      ),
    );
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!selected)
      return setError("Templates are still loading. Please try again.");
    if (!groupName.trim()) return setError("Enter a group / batch name.");
    const emptyIndex = interns.findIndex((intern) =>
      Object.values(intern).some((value) => !String(value).trim()),
    );
    if (emptyIndex !== -1)
      return setError(`Complete all four fields for Intern ${emptyIndex + 1}.`);

    setLoading(true);
    try {
      const result = await generatePdf({ template, groupName, interns });
      const url = URL.createObjectURL(result.blob);
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setSuccess("Your PDF has been generated and downloaded.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-6">
      <TemplateSelector
        templates={templates}
        selected={template}
        onSelect={chooseTemplate}
      />
      <div className={styles.separator} />
      <BatchDetails groupName={groupName} setGroupName={setGroupName} />
      <div className={styles.separator} />
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Intern details</h2>
            <p className="mt-1 text-xs text-slate-500">
              Enter exactly {selected?.internCount || Number(template)} intern
              records for this template.
            </p>
          </div>
          <span className={styles.count}>
            {interns.length} / {selected?.internCount || Number(template)}
          </span>
        </div>
        <div className="space-y-3">
          {interns.map((intern, index) => (
            <InternFields
              key={`${template}-${index}`}
              index={index}
              intern={intern}
              onChange={(key, value) => updateIntern(index, key, value)}
            />
          ))}
        </div>
      </section>

      {error && (
        <div role="alert" className={styles.error}>
          {error}
        </div>
      )}
      {success && (
        <div role="status" className={styles.success}>
          {success}
        </div>
      )}

      <div className={styles.submitArea}>
        <div className="flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-amber-600" />
          Original PDF pages and styling are retained. Only the requested text
          fields are replaced.
        </div>
        <button
          type="submit"
          disabled={loading || !selected}
          className={styles.submit}
        >
          {loading ? (
            <LoaderCircle className="animate-spin" size={17} />
          ) : (
            <Download size={17} />
          )}
          {loading ? "Generating PDF..." : "Generate & Download PDF"}
        </button>
      </div>

      {previewUrl && (
        <section className={styles.preview}>
          <div className="flex items-center justify-between gap-3">
            <strong>Generated PDF preview</strong>
            <a href={previewUrl} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          </div>
          <iframe title="Generated LOR PDF preview" src={previewUrl} />
        </section>
      )}
    </form>
  );
}
