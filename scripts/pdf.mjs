// @ts-check

import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "url";

import PDFParser from "pdf2json";

/**
 * @param {string} filePath - The path to the PDF file.
 * @returns {Promise<import("pdf2json").Output>} - The parsed PDF data.
 */
async function parsePDFBuffer(filePath) {
  const pdfBuffer = await fs.readFile(filePath);
  const parser = new PDFParser();

  return new Promise((resolve, reject) => {
    parser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
    parser.on("pdfParser_dataReady", (data) => resolve(data));
    parser.parseBuffer(pdfBuffer);
  });
}

/**
 * Groups PDF text objects by similar y-values.
 * @param {Array<import("pdf2json").Text>} texts - The text objects to group.
 * @param {number} [tolerance=0.5] - The tolerance for grouping.
 * @returns {Array<{ y: number, text: string }>} - The grouped text.
 */
function groupTextByLine(texts, tolerance = 0.5) {
  // Sort texts first by y value so that items on the
  // same line are near each other, then by x value for
  // left-to-right order.
  const sorted = texts.slice().sort((a, b) => {
    return a.y === b.y ? a.x - b.x : a.y - b.y;
  });

  const lines = [];

  for (const textItem of sorted) {
    // If no groups exist or the current text's y doesn't
    // fall within tolerance of the last group's y, create
    // a new line.
    if (
      lines.length === 0 ||
      Math.abs(textItem.y - lines[lines.length - 1].y) > tolerance
    ) {
      lines.push({ y: textItem.y, items: [textItem] });
    } else {
      lines[lines.length - 1].items.push(textItem);
    }
  }

  return lines.map((line) => {
    const sortedItems = line.items.sort((a, b) => a.x - b.x);
    const lineText = sortedItems
      .map((item) => decodeURIComponent(item.R[0].T))
      .join(" ");
    return { y: line.y, text: lineText };
  });
}

/**
 * Main method that processes a PDF file.
 * @param {string} filePath - The PDF file path.
 */
async function main(filePath) {
  try {
    const parsedData = await parsePDFBuffer(filePath);

    if (parsedData.Pages) {
      parsedData.Pages.forEach((page, i) => {
        if (page.Texts) {
          const lines = groupTextByLine(page.Texts);
          console.log(`--- Page ${i + 1} ---`);
          lines.forEach((line) =>
            console.log(`y: ${line.y.toFixed(2)} ==> ${line.text}`),
          );
        }
      });
    }
  } catch (error) {
    console.error("Error parsing PDF:", error);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);

if (__filename === resolve(process.argv[1])) {
  if (!process.argv[2]) {
    console.error("\x1b[31mError: PDF file path argument is required\x1b[0m");
    process.exit(1);
  }

  if (!existsSync(process.argv[2])) {
    console.error("\x1b[31mError: Provided file path does not exist\x1b[0m");
    process.exit(1);
  }

  await main(process.argv[2]);
}
