/**
 * Export Service for Diagram Export Functionality
 * Supports PDF, PNG, SVG, and Visio formats
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class ExportService {
  /**
   * Export diagram as PNG
   * @param {HTMLElement} element - DOM element to export
   * @param {string} filename - Output filename
   */
  async exportToPNG(element, filename = 'diagram.png') {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      return { success: true, message: 'PNG exported successfully' };
    } catch (error) {
      console.error('PNG export error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Export diagram as PDF
   * @param {HTMLElement} element - DOM element to export
   * @param {string} filename - Output filename
   */
  async exportToPDF(element, filename = 'diagram.pdf') {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(filename);

      return { success: true, message: 'PDF exported successfully' };
    } catch (error) {
      console.error('PDF export error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Export diagram as SVG
   * @param {HTMLElement} element - DOM element to export
   * @param {string} filename - Output filename
   */
  async exportToSVG(element, filename = 'diagram.svg') {
    try {
      // Find SVG element within the container
      const svgElement = element.querySelector('svg');
      
      if (!svgElement) {
        throw new Error('No SVG element found in the diagram');
      }

      // Clone and serialize the SVG
      const svgClone = svgElement.cloneNode(true);
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);

      // Add XML declaration and DOCTYPE
      const svgBlob = new Blob(
        ['<?xml version="1.0" encoding="UTF-8"?>\n', svgString],
        { type: 'image/svg+xml;charset=utf-8' }
      );

      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      return { success: true, message: 'SVG exported successfully' };
    } catch (error) {
      console.error('SVG export error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Export diagram as Visio (VDX format)
   * @param {Object} diagramData - Diagram data structure
   * @param {string} filename - Output filename
   */
  async exportToVisio(diagramData, filename = 'diagram.vdx') {
    try {
      // Generate VDX XML format
      const vdxXML = this.generateVDXXML(diagramData);

      const blob = new Blob([vdxXML], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      return { success: true, message: 'Visio file exported successfully' };
    } catch (error) {
      console.error('Visio export error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Generate VDX XML format for Visio
   * @param {Object} diagramData - Diagram data
   * @returns {string} VDX XML string
   */
  generateVDXXML(diagramData) {
    // Simplified VDX format
    const { nodes = [], edges = [], title = 'AD Topology' } = diagramData;

    let shapesXML = '';
    let connectionsXML = '';

    // Generate shapes
    nodes.forEach((node, index) => {
      const x = (index % 5) * 2;
      const y = Math.floor(index / 5) * 2;
      
      shapesXML += `
        <Shape ID='${index + 1}' Type='Shape' Master='0'>
          <XForm>
            <PinX>${x}</PinX>
            <PinY>${y}</PinY>
            <Width>1.5</Width>
            <Height>0.75</Height>
          </XForm>
          <Text>${this.escapeXML(node.label || node.name || node.id)}</Text>
        </Shape>`;
    });

    // Generate connections
    edges.forEach((edge, index) => {
      connectionsXML += `
        <Connect FromSheet='${edge.from}' ToSheet='${edge.to}' />`;
    });

    return `<?xml version='1.0' encoding='UTF-8'?>
<VisioDocument xmlns='http://schemas.microsoft.com/visio/2003/core'>
  <DocumentProperties>
    <Title>${this.escapeXML(title)}</Title>
  </DocumentProperties>
  <Pages>
    <Page ID='0' Name='Page-1'>
      <Shapes>
        ${shapesXML}
      </Shapes>
      <Connects>
        ${connectionsXML}
      </Connects>
    </Page>
  </Pages>
</VisioDocument>`;
  }

  /**
   * Escape XML special characters
   * @param {string} str - Input string
   * @returns {string} Escaped string
   */
  escapeXML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Export all formats
   * @param {HTMLElement} element - DOM element to export
   * @param {Object} diagramData - Diagram data
   * @param {string} baseFilename - Base filename without extension
   */
  async exportAll(element, diagramData, baseFilename = 'diagram') {
    const results = {
      png: await this.exportToPNG(element, `${baseFilename}.png`),
      pdf: await this.exportToPDF(element, `${baseFilename}.pdf`),
      svg: await this.exportToSVG(element, `${baseFilename}.svg`),
      visio: await this.exportToVisio(diagramData, `${baseFilename}.vdx`)
    };

    return results;
  }
}

export default new ExportService();
