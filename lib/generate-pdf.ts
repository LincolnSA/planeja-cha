/**
 * Função para gerar PDF com todas as informações do chá
 * 
 * IMPORTANTE: Para usar esta função, instale a biblioteca jsPDF:
 * yarn add jspdf
 */

import type { TeaCompleteData } from "@/actions/tea/get-tea-complete-data";

export async function generateTeaPDF(data: TeaCompleteData): Promise<void> {
  try {
    // Tentar importar jsPDF dinamicamente
    const { jsPDF } = await import("jspdf");
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 20;
    const lineHeight = 7;
    const sectionSpacing = 10;

    // Cores
    const primaryColor: [number, number, number] = [234, 88, 12]; // Terra cota (Orange-600) #ea580c
    const textColor: [number, number, number] = [0, 0, 0];
    const grayColor: [number, number, number] = [107, 114, 128];

    // Título principal
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(data.name, margin, yPosition);
    yPosition += lineHeight + 2;

    doc.setFontSize(12);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.text(`Organizado por: ${data.parentsName}`, margin, yPosition);
    yPosition += sectionSpacing + lineHeight;

    // Informações do evento
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.text("Informações do Evento", margin, yPosition);
    yPosition += lineHeight + 2;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${data.date}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Horário: ${data.time}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Local: ${data.location}`, margin, yPosition);
    yPosition += sectionSpacing;

    if (data.customMessage) {
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      const splitMessage = doc.splitTextToSize(data.customMessage, pageWidth - 2 * margin);
      doc.text(splitMessage, margin, yPosition);
      yPosition += lineHeight * splitMessage.length + sectionSpacing;
    }

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Convidados
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.text("Convidados", margin, yPosition);
    yPosition += lineHeight + 2;

    // Calcular totais
    const totalGuests = data.guests.length;
    const totalCompanions = data.guests.reduce((sum, guest) => sum + guest.companions.length, 0);
    const totalPeople = totalGuests + totalCompanions;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Total de Pessoas: ${totalPeople} (${totalGuests} convidados + ${totalCompanions} acompanhantes)`, margin, yPosition);
    yPosition += lineHeight + 2;

    data.guests.forEach((guest, index) => {
      // Verificar se precisa de nova página
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text(`${index + 1}. ${guest.name}`, margin, yPosition);
      yPosition += lineHeight;

      if (guest.companions.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...grayColor);
        doc.text("   Acompanhantes:", margin, yPosition);
        yPosition += lineHeight;
        
        guest.companions.forEach((companion) => {
          doc.text(`   - ${companion.name}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }

      if (guest.giftSelections.length > 0 || guest.customGifts.length > 0) {
        doc.setTextColor(...grayColor);
        doc.text("   Presentes:", margin, yPosition);
        yPosition += lineHeight;
        
        guest.giftSelections.forEach((selection) => {
          doc.text(`   - ${selection.gift.title}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });

        guest.customGifts.forEach((customGift) => {
          const giftText = `   - ${customGift.title}${customGift.description ? ` (${customGift.description})` : ""}`;
          doc.text(giftText, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }

      doc.setTextColor(...textColor);
      yPosition += 2;
    });

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Presentes
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.text("Lista de Presentes", margin, yPosition);
    yPosition += lineHeight + 2;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    data.gifts.forEach((gift) => {
      // Verificar se precisa de nova página
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      const remaining = gift.quantity - gift.chosen;
      doc.setTextColor(...textColor);
      doc.setFont("helvetica", "bold");
      doc.text(`${gift.title}`, margin, yPosition);
      yPosition += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      doc.text(`   ${gift.description}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`   Quantidade: ${gift.quantity} | Escolhidos: ${gift.chosen} | Disponíveis: ${remaining}`, margin + 5, yPosition);
      yPosition += lineHeight + 2;
      doc.setTextColor(...textColor);
    });

    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      doc.text(
        `Página ${i} de ${totalPages} - Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    // Salvar o PDF
    const fileName = `cha-de-bebe-${data.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    // Se jsPDF não estiver instalado, mostrar mensagem
    if (error instanceof Error && error.message.includes("Cannot find module")) {
      throw new Error("Biblioteca jsPDF não encontrada. Execute: yarn add jspdf");
    }
    throw error;
  }
}

