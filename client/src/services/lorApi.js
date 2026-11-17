// // const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// // export async function fetchTemplates() {
// //   const response = await fetch(`${API_BASE_URL}/api/lor/templates`);

// //   if (!response.ok) {
// //     throw new Error("Could not load PDF templates.");
// //   }

// //   return response.json();
// // }

// // export async function generatePdf(payload) {
// //   const response = await fetch(`${API_BASE_URL}/api/lor/generate`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(payload),
// //   });

// //   if (!response.ok) {
// //     const error = await response.json().catch(() => ({}));
// //     throw new Error(error.message || "PDF generation failed.");
// //   }

// //   const blob = await response.blob();

// //   const disposition = response.headers.get("content-disposition") || "";

// //   const match = disposition.match(/filename="?([^"]+)"?/i);

// //   return {
// //     blob,
// //     fileName: match?.[1] || "VELOOP-LOR-Selection-Record.pdf",
// //   };
// // }

// export async function fetchTemplates() {
//   const response = await fetch("/api/lor/templates");

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));

//     throw new Error(error.message || "Could not load PDF templates.");
//   }

//   return response.json();
// }

// export async function generatePdf(payload) {
//   const response = await fetch("/api/lor/generate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));

//     throw new Error(error.message || "PDF generation failed.");
//   }

//   const blob = await response.blob();

//   const disposition = response.headers.get("content-disposition") || "";

//   const match = disposition.match(/filename="?([^"]+)"?/i);

//   return {
//     blob,
//     fileName: match?.[1] || "VELOOP-LOR-Selection-Record.pdf",
//   };
// }

const API_URL = __API_URL__;

export async function fetchTemplates() {
  const response = await fetch(`${API_URL}/lor/templates`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Could not load PDF templates.");
  }

  return response.json();
}

// export async function generatePdf(payload) {
//   const response = await fetch(`${API_URL}/lor/generate`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || "PDF generation failed.");
//   }

//   const blob = await response.blob();

//   const disposition = response.headers.get("content-disposition") || "";

//   const match = disposition.match(/filename="?([^"]+)"?/i);

//   return {
//     blob,
//     fileName: match?.[1] || "VELOOP-LOR-Selection-Record.pdf",
//   };
// }

export async function generatePdf(payload) {
  const response = await fetch(`${API_URL}/lor/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "PDF generation failed.");
  }

  const blob = await response.blob();
  console.log(payload);
  const safeBatchName = (payload.groupName || "VELOOP-LOR")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .trim();

  return {
    blob,
    fileName: `LOR-${safeBatchName}.pdf`,
  };
}
