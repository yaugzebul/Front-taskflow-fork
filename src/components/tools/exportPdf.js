import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Capture un élément HTML et le télécharge en PDF
 * @param {string} elementId - L'id de la div à capturer (ex: 'kanban-board')
 */
export const generatePDF = async (elementId) => {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error("L'élément avec l'ID " + elementId + " est introuvable.");
        return;
    }

    try {
        // 1. Création du canvas (l'image de ton interface)
        const canvas = await html2canvas(element, {
            scale: 2, // Meilleure résolution
            useCORS: true, // Autorise les images externes si besoin
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');

        // 2. Initialisation du PDF en format Paysage (l) pour un Kanban
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // 3. Ajout de l'image au PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // 4. Téléchargement
        pdf.save(`TaskFlow-Export-${new Date().toLocaleDateString()}.pdf`);

    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
    }
};