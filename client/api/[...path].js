export default async function handler(req, res) {
  const backendUrl = process.env.API_BASE_URL;

  if (!backendUrl) {
    return res.status(500).json({
      message: "API_BASE_URL environment variable is missing.",
    });
  }

  try {
    const incomingUrl = new URL(
      req.url,
      `http://${req.headers.host || "localhost"}`,
    );

    // Remove the initial /api prefix.
    const apiPath = incomingUrl.pathname.replace(/^\/api/, "");

    // Build the Render backend URL.
    const targetUrl = `${backendUrl.replace(/\/+$/, "")}/api${apiPath}${incomingUrl.search}`;

    const headers = new Headers();

    if (req.headers["content-type"]) {
      headers.set("Content-Type", req.headers["content-type"]);
    }

    if (req.headers.accept) {
      headers.set("Accept", req.headers.accept);
    }

    const options = {
      method: req.method,
      headers,
    };

    // Forward request body for POST, PUT, PATCH, etc.
    if (!["GET", "HEAD"].includes(req.method)) {
      if (Buffer.isBuffer(req.body)) {
        options.body = req.body;
      } else if (typeof req.body === "string") {
        options.body = req.body;
      } else if (req.body !== undefined) {
        options.body = JSON.stringify(req.body);
      }
    }

    const backendResponse = await fetch(targetUrl, options);

    // Preserve response headers required by PDF downloads.
    const contentType = backendResponse.headers.get("content-type");

    const contentDisposition = backendResponse.headers.get(
      "content-disposition",
    );

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    if (contentDisposition) {
      res.setHeader("Content-Disposition", contentDisposition);
    }

    const data = Buffer.from(await backendResponse.arrayBuffer());

    return res.status(backendResponse.status).send(data);
  } catch (error) {
    console.error("Vercel API proxy error:", error);

    return res.status(502).json({
      message: "Unable to connect to the backend server.",
    });
  }
}
