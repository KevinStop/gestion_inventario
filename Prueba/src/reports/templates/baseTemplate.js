const PDFGenerator = require("../utils/pdfGenerator");
const ReportFormatters = require("../utils/formatters");
const moment = require("moment");

class BaseReportTemplate {
  constructor(title, subtitle = "") {
    this.title = title;
    this.subtitle = subtitle;
    this.pdfGenerator = new PDFGenerator();
    this.formatter = ReportFormatters;
  }

  // Inicializar el reporte con la estructura básica
  async initializeReport() {
    const doc = this.pdfGenerator.initializeDocument().addHeader(this.title);

    // Agregar subtítulo si existe
    if (this.subtitle) {
      doc.doc.fontSize(14).text(this.subtitle, { align: "center" }).moveDown();
    }

    return doc;
  }

  // Agregar sección de resumen si es necesario
  addSummarySection(doc, summaryData) {
    doc.doc.fontSize(12).text("Resumen:", { underline: true }).moveDown(0.5);

    for (const [key, value] of Object.entries(summaryData)) {
      doc.doc.fontSize(10).text(`${key}: ${value}`).moveDown(0.2);
    }

    doc.doc.moveDown();
    return doc;
  }

  // Agregar una tabla con datos
  addDataTable(doc, headers, data, options = {}) {
    const defaultOptions = {
      width: 495,
      rowHeight: 20, // Reducido de 25 a 20
      fontSize: 9,
      headerColor: "#E4E4E4",
      zebraColor: "#F9F9F9",
      textColor: "#000000",
      padding: 4, // Reducido de 8 a 4
      margin: 50,
    };

    const tableOptions = { ...defaultOptions, ...options };
    const columnWidth = tableOptions.width / headers.length;

    // Posición inicial de la tabla
    const startY = doc.doc.y;

    // Dibujar encabezados
    headers.forEach((header, i) => {
      doc.doc
        .rect(
          tableOptions.margin + i * columnWidth,
          startY,
          columnWidth,
          tableOptions.rowHeight
        )
        .fillColor(tableOptions.headerColor)
        .fill();

      doc.doc
        .fillColor(tableOptions.textColor)
        .fontSize(tableOptions.fontSize)
        .text(
          header,
          tableOptions.margin + i * columnWidth + tableOptions.padding,
          startY + tableOptions.padding / 2,
          {
            width: columnWidth - 2 * tableOptions.padding,
            align: "left",
          }
        );
    });

    // Actualizar posición Y después de los encabezados
    doc.doc.y = startY + tableOptions.rowHeight;

    // Dibujar filas
    data.forEach((row, rowIndex) => {
      // Verificar si necesitamos una nueva página
      if (doc.doc.y + tableOptions.rowHeight > doc.doc.page.height - 100) {
        doc.doc.addPage();
        doc.doc.y = 50;
      }

      const rowStartY = doc.doc.y;

      // Color de fondo para filas alternas
      if (options.zebra && rowIndex % 2 === 1) {
        doc.doc
          .rect(
            tableOptions.margin,
            rowStartY,
            tableOptions.width,
            tableOptions.rowHeight
          )
          .fillColor(tableOptions.zebraColor)
          .fill();
      }

      // Dibujar celdas
      row.forEach((cell, colIndex) => {
        doc.doc
          .fillColor(tableOptions.textColor)
          .fontSize(tableOptions.fontSize)
          .text(
            cell?.toString() || "",
            tableOptions.margin + colIndex * columnWidth + tableOptions.padding,
            rowStartY + tableOptions.padding / 2,
            {
              width: columnWidth - 2 * tableOptions.padding,
              align: "left",
            }
          );
      });

      doc.doc.y = rowStartY + tableOptions.rowHeight;
    });

    doc.doc.moveDown(0.5); // Reducido el espacio después de la tabla
    return doc;
  }

  // Agregar notas al pie si es necesario
  addNotes(doc, notes) {
    if (!notes || notes.length === 0) return doc;

    doc.doc
      .moveDown()
      .fontSize(10)
      .text("Notas:", { underline: true })
      .moveDown(0.5);

    notes.forEach((note) => {
      doc.doc.text(`• ${note}`, { indent: 20 }).moveDown(0.2);
    });

    return doc;
  }

  // Finalizar el reporte
  finalizeReport(doc) {
    return doc.getDocument();
  }

  // Método para validar los datos antes de generar el reporte
  validateReportData(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error("No hay datos disponibles para generar el reporte");
    }
    return true;
  }

  // Método para manejar errores durante la generación
  handleReportError(error) {
    console.error("Error generando reporte:", error);
    throw new Error(`Error al generar el reporte: ${error.message}`);
  }

  // Método para generar el nombre del archivo
  generateFileName(prefix = "reporte") {
    const timestamp = moment().format("YYYYMMDD-HHmmss");
    return `${prefix}_${timestamp}.pdf`;
  }
}

module.exports = BaseReportTemplate;
