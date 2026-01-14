// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const poppler = require("pdf-poppler");
// const archiver = require("archiver");

// const app = express();
// // app.use(cors());
// app.use(cors({
//   origin: "*"
// }));

// app.use(express.json());

// const uploadDir = "uploads";
// const outputDir = "output";
// const zipDir = "zips";

// [uploadDir, outputDir, zipDir].forEach(dir => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir);
// });

// app.use("/output", express.static(outputDir));

// const upload = multer({ dest: uploadDir });

// /* =========================
//    PDF → IMAGES ONLY
// ========================= */
// app.post("/convert", upload.single("pdf"), async (req, res) => {
//   try {
//     const pdfId = Date.now().toString();

//     const options = {
//       format: "png",
//       out_dir: outputDir,
//       out_prefix: pdfId
//     };

//     console.log("Starting PDF conversion...");
//     await poppler.convert(req.file.path, options);
//     console.log("PDF converted");

//     const images = fs
//       .readdirSync(outputDir)
//       .filter(f => f.startsWith(pdfId))
//       .map(img => `/output/${img}`);

//     res.json({ images });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Conversion failed" });
//   }
// });

// /* =========================
//    CREATE ZIP (selected / all)
// ========================= */
// app.post("/download-zip", async (req, res) => {
//   const { images, selected } = req.body;

//   const filesToZip =
//     selected && selected.length > 0 ? selected : images;

//   console.log("Zipping files:", filesToZip);

//   const zipName = `images_${Date.now()}.zip`;
//   const zipPath = path.join(zipDir, zipName);

//   const archive = archiver("zip");
//   const output = fs.createWriteStream(zipPath);

//   archive.pipe(output);

//   filesToZip.forEach(img => {
//     const fileName = img.replace("/output/", "");
//     archive.file(path.join(outputDir, fileName), { name: fileName });
//   });

//   await archive.finalize();

//   res.json({ zipName });
// });

// /* =========================
//    DOWNLOAD ZIP
// ========================= */
// app.get("/download/:zip", (req, res) => {
//   const zipPath = path.join(zipDir, req.params.zip);
//   if (!fs.existsSync(zipPath)) return res.sendStatus(404);
//   res.download(zipPath);
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Backend running on port ${PORT}`);
// });





const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { exec } = require("child_process");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const uploadDir = "uploads";
const outputDir = "output";
const zipDir = "zips";

[uploadDir, outputDir, zipDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

app.use("/output", express.static(outputDir));

const upload = multer({ dest: uploadDir });

/* =========================
   POPPLER CLI FUNCTION
========================= */
const convertPdfToImages = (pdfPath, outputDir, prefix) => {
  return new Promise((resolve, reject) => {
    const cmd = `pdftoppm -png "${pdfPath}" "${path.join(outputDir, prefix)}"`;

    exec(cmd, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};

/* =========================
   PDF → IMAGES
========================= */
app.post("/convert", upload.single("pdf"), async (req, res) => {
  try {
    const pdfId = Date.now().toString();
    const pdfPath = req.file.path;

    console.log("Starting PDF conversion...");
    await convertPdfToImages(pdfPath, outputDir, pdfId);
    console.log("PDF converted");

    const images = fs
      .readdirSync(outputDir)
      .filter(f => f.startsWith(pdfId))
      .map(img => `/output/${img}`);

    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Conversion failed" });
  }
});

/* =========================
   CREATE ZIP (Selected / All)
========================= */
app.post("/download-zip", async (req, res) => {
  try {
    const { images, selected } = req.body;

    const filesToZip =
      selected && selected.length > 0 ? selected : images;

    const zipName = `images_${Date.now()}.zip`;
    const zipPath = path.join(zipDir, zipName);

    const archive = archiver("zip");
    const output = fs.createWriteStream(zipPath);

    archive.pipe(output);

    filesToZip.forEach(img => {
      const fileName = img.replace("/output/", "");
      archive.file(path.join(outputDir, fileName), { name: fileName });
    });

    await archive.finalize();

    res.json({ zipName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zip failed" });
  }
});

/* =========================
   DOWNLOAD ZIP
========================= */
app.get("/download/:zip", (req, res) => {
  const zipPath = path.join(zipDir, req.params.zip);
  if (!fs.existsSync(zipPath)) return res.sendStatus(404);
  res.download(zipPath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
