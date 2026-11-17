import { FileCheck2, ShieldCheck, Workflow } from "lucide-react";
import BrandHeader from "./components/BrandHeader.jsx";
import GeneratorForm from "./components/GeneratorForm.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <BrandHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-blue-700">
              <FileCheck2 size={14} /> Document operations
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              LOR Selection Record Generator
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Generate official batch selection records using the original
              VELOOP PDF templates. Choose the fixed intern capacity, enter the
              records, and download the finished PDF.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-semibold text-emerald-800 sm:self-auto">
            <ShieldCheck size={14} /> Template-preserving workflow
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(18,31,56,.05)] sm:p-6">
            <GeneratorForm />
          </section>
          <aside className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <Workflow size={16} className="text-blue-700" />
                <strong className="text-xs">Workflow</strong>
              </div>
              <ol className="space-y-3 text-[11px] leading-relaxed text-slate-600">
                <li>
                  <b className="mr-2 text-blue-700">01</b> Select the 3, 6, or 8
                  intern PDF.
                </li>
                <li>
                  <b className="mr-2 text-blue-700">02</b> Enter the group name
                  and intern details.
                </li>
                <li>
                  <b className="mr-2 text-blue-700">03</b> Server masks emails
                  and applies today's date.
                </li>
                <li>
                  <b className="mr-2 text-blue-700">04</b> Download the selected
                  original PDF with replacements.
                </li>
              </ol>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <strong className="text-xs text-slate-800">
                Standalone manual generator
              </strong>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Enter the batch details and intern records here, then generate
                and download your finished PDF.
              </p>
            </div>
          </aside>
        </div>
        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-4 text-[10px] text-slate-400 sm:flex-row">
          <span>VELOOP REWARDS · INTERNAL DOCUMENT GENERATOR</span>
          <span>Original templates · Asia/Kolkata date handling</span>
        </footer>
      </main>
    </div>
  );
}
