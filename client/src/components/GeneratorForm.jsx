// import { useEffect, useMemo, useState } from "react";
// import { Download, LoaderCircle, Sparkles } from "lucide-react";
// import { fetchTemplates, generatePdf } from "../services/lorApi.js";
// import TemplateSelector from "./TemplateSelector.jsx";
// import BatchDetails from "./BatchDetails.jsx";
// import InternFields from "./InternFields.jsx";
// import styles from "./GeneratorForm.module.css";

// const EMPTY = { name: "", internId: "", email: "", domain: "" };

// export default function GeneratorForm() {
//   const [templates, setTemplates] = useState([]);
//   const [template, setTemplate] = useState("3");
//   const [groupName, setGroupName] = useState("");
//   const [interns, setInterns] = useState(
//     Array.from({ length: 3 }, () => ({ ...EMPTY })),
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [previewUrl, setPreviewUrl] = useState("");

//   useEffect(() => {
//     fetchTemplates()
//       .then((data) => setTemplates(data.templates))
//       .catch((err) => setError(err.message));
//   }, []);

//   const selected = useMemo(
//     () => templates.find((item) => item.id === template),
//     [templates, template],
//   );

//   function chooseTemplate(id) {
//     setTemplate(id);
//     const count = Number(id);
//     setInterns(
//       Array.from({ length: count }, (_, index) => ({
//         ...(interns[index] || EMPTY),
//       })),
//     );
//     setError("");
//     setSuccess("");
//     setPreviewUrl((old) => {
//       if (old) URL.revokeObjectURL(old);
//       return "";
//     });
//   }

//   function updateIntern(index, key, value) {
//     setInterns((current) =>
//       current.map((intern, i) =>
//         i === index ? { ...intern, [key]: value } : intern,
//       ),
//     );
//   }

//   async function handleGenerate(event) {
//     event.preventDefault();
//     setError("");
//     setSuccess("");
//     if (!selected)
//       return setError("Templates are still loading. Please try again.");
//     if (!groupName.trim()) return setError("Enter a group / batch name.");
//     const emptyIndex = interns.findIndex((intern) =>
//       Object.values(intern).some((value) => !String(value).trim()),
//     );
//     if (emptyIndex !== -1)
//       return setError(`Complete all four fields for Intern ${emptyIndex + 1}.`);

//     setLoading(true);
//     try {
//       const result = await generatePdf({ template, groupName, interns });
//       const url = URL.createObjectURL(result.blob);
//       setPreviewUrl((old) => {
//         if (old) URL.revokeObjectURL(old);
//         return url;
//       });
//       const anchor = document.createElement("a");
//       anchor.href = url;
//       anchor.download = result.fileName;
//       document.body.appendChild(anchor);
//       anchor.click();
//       anchor.remove();
//       setSuccess("Your PDF has been generated and downloaded.");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleGenerate} className="space-y-6">
//       <TemplateSelector
//         templates={templates}
//         selected={template}
//         onSelect={chooseTemplate}
//       />
//       <div className={styles.separator} />
//       <BatchDetails groupName={groupName} setGroupName={setGroupName} />
//       <div className={styles.separator} />
//       <section className="space-y-3">
//         <div className="flex items-end justify-between gap-3">
//           <div>
//             <h2 className="text-sm font-bold text-slate-900">Intern details</h2>
//             <p className="mt-1 text-xs text-slate-500">
//               Enter exactly {selected?.internCount || Number(template)} intern
//               records for this template.
//             </p>
//           </div>
//           <span className={styles.count}>
//             {interns.length} / {selected?.internCount || Number(template)}
//           </span>
//         </div>
//         <div className="space-y-3">
//           {interns.map((intern, index) => (
//             <InternFields
//               key={`${template}-${index}`}
//               index={index}
//               intern={intern}
//               onChange={(key, value) => updateIntern(index, key, value)}
//             />
//           ))}
//         </div>
//       </section>

//       {error && (
//         <div role="alert" className={styles.error}>
//           {error}
//         </div>
//       )}
//       {success && (
//         <div role="status" className={styles.success}>
//           {success}
//         </div>
//       )}

//       <div className={styles.submitArea}>
//         <div className="flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
//           <Sparkles size={14} className="mt-0.5 shrink-0 text-amber-600" />
//           Original PDF pages and styling are retained. Only the requested text
//           fields are replaced.
//         </div>
//         <button
//           type="submit"
//           disabled={loading || !selected}
//           className={styles.submit}
//         >
//           {loading ? (
//             <LoaderCircle className="animate-spin" size={17} />
//           ) : (
//             <Download size={17} />
//           )}
//           {loading ? "Generating PDF..." : "Generate & Download PDF"}
//         </button>
//       </div>

//       {previewUrl && (
//         <section className={styles.preview}>
//           <div className="flex items-center justify-between gap-3">
//             <strong>Generated PDF preview</strong>
//             <a href={previewUrl} target="_blank" rel="noreferrer">
//               Open in new tab
//             </a>
//           </div>
//           <iframe title="Generated LOR PDF preview" src={previewUrl} />
//         </section>
//       )}
//     </form>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  LoaderCircle,
  Sparkles,
  Plus,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { fetchTemplates, generatePdf } from "../services/lorApi.js";
import TemplateSelector from "./TemplateSelector.jsx";
import BatchDetails from "./BatchDetails.jsx";
import InternFields from "./InternFields.jsx";
import styles from "./GeneratorForm.module.css";

const EMPTY = {
  name: "",
  internId: "",
  email: "",
  domain: "",
};

export default function GeneratorForm() {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState("3");
  const [groupName, setGroupName] = useState("");

  const [interns, setInterns] = useState(
    Array.from({ length: 3 }, () => ({ ...EMPTY })),
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [allAdded, setAllAdded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  function resetGenerator() {
    setGroupName("");
    setTemplate("3");

    setInterns(Array.from({ length: 3 }, () => ({ ...EMPTY })));

    setActiveIndex(0);
    setAllAdded(false);

    setError("");
    setSuccess("");

    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return "";
    });
  }

  useEffect(() => {
    fetchTemplates()
      .then((data) => setTemplates(data.templates))
      .catch((err) => setError(err.message));
  }, []);

  const selected = useMemo(
    () => templates.find((item) => item.id === template),
    [templates, template],
  );

  const totalCount = selected?.internCount || Number(template);

  const addedCount = allAdded ? totalCount : activeIndex;
  const remainingCount = totalCount - addedCount;
  const progress = (addedCount / totalCount) * 100;

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function chooseTemplate(id) {
    const count = Number(id);

    setTemplate(id);

    setInterns((current) =>
      Array.from({ length: count }, (_, index) => ({
        ...(current[index] || EMPTY),
      })),
    );

    setActiveIndex(0);
    setAllAdded(false);

    clearMessages();

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

    clearMessages();
  }

  function validateIntern(intern, index) {
    const fields = [
      ["name", "Full name"],
      ["internId", "Intern ID"],
      ["email", "Email address"],
      ["domain", "Internship domain"],
    ];

    for (const [key, label] of fields) {
      if (!String(intern[key] || "").trim()) {
        setError(`Please enter ${label} for Intern ${index + 1}.`);
        return false;
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(intern.email.trim())) {
      setError(`Please enter a valid email for Intern ${index + 1}.`);
      return false;
    }

    return true;
  }

  function handleAddNext() {
    clearMessages();

    const currentIntern = interns[activeIndex];

    if (!validateIntern(currentIntern, activeIndex)) {
      return;
    }

    if (activeIndex === totalCount - 1) {
      setAllAdded(true);
      setSuccess("All intern records have been added successfully.");
      return;
    }

    setActiveIndex((current) => current + 1);
  }

  function handlePrevious() {
    clearMessages();
    setAllAdded(false);
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  async function handleGenerate(event) {
    event.preventDefault();

    clearMessages();

    if (!selected) {
      return setError("Templates are still loading. Please try again.");
    }

    if (!groupName.trim()) {
      return setError("Enter a group / batch name.");
    }

    if (!allAdded) {
      return setError("Please complete all intern records first.");
    }

    const emptyIndex = interns.findIndex((intern) =>
      Object.values(intern).some((value) => !String(value).trim()),
    );

    if (emptyIndex !== -1) {
      setAllAdded(false);
      setActiveIndex(emptyIndex);
      return setError(`Complete all four fields for Intern ${emptyIndex + 1}.`);
    }

    setLoading(true);

    try {
      const result = await generatePdf({
        template,
        groupName,
        interns,
      });

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
      setSuccess(
        "PDF generated and downloaded successfully! Ready for a new generation.",
      );

      // Reset the form after successful generation
      setTimeout(() => {
        resetGenerator();
      }, 1500);
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

      {/* Intern progress */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Intern details</h2>
            <p className="mt-1 text-xs text-slate-500">
              Add intern records one at a time.
            </p>
          </div>

          <span className={styles.count}>
            {addedCount} / {totalCount} added
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <strong className="block text-lg font-bold text-blue-700">
                {addedCount}
              </strong>
              <span className="text-[10px] font-medium text-blue-700">
                Added
              </span>
            </div>

            <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
              <strong className="block text-lg font-bold text-orange-700">
                {remainingCount}
              </strong>
              <span className="text-[10px] font-medium text-orange-700">
                Remaining
              </span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <strong className="block text-lg font-bold text-slate-800">
                {totalCount}
              </strong>
              <span className="text-[10px] font-medium text-slate-600">
                Total capacity
              </span>
            </div>
          </div>
        </div>

        {/* Current intern form */}
        {!allAdded ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Intern {activeIndex + 1}
                </h3>
                <p className="text-xs text-slate-500">
                  Step {activeIndex + 1} of {totalCount}
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
                {remainingCount} {remainingCount === 1 ? "slot" : "slots"} left
              </span>
            </div>

            <InternFields
              key={`${template}-${activeIndex}`}
              index={activeIndex}
              intern={interns[activeIndex]}
              onChange={(key, value) => updateIntern(activeIndex, key, value)}
            />

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={activeIndex === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleAddNext}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                {activeIndex === totalCount - 1 ? (
                  <>
                    <CheckCircle2 size={15} />
                    Finish Adding Interns
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Add Intern & Continue
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckCircle2 size={22} />
            </div>

            <h3 className="text-sm font-bold text-green-800">
              All Interns Added!
            </h3>

            <p className="mt-1 text-xs text-green-700">
              All {totalCount} intern records are ready for PDF generation.
            </p>

            <button
              type="button"
              onClick={handlePrevious}
              className="mt-3 text-xs font-semibold text-green-800 underline underline-offset-2"
            >
              Review or edit previous intern
            </button>
          </div>
        )}
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

      {/* PDF generation */}
      {allAdded && (
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
      )}

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
