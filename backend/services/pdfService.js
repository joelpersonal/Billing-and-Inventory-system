import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class PDFService {
  static async generateBusinessReport(reportData, businessInfo) {
    return new Promise((resolve, reject) => {
      try {
        // Create a new PDF document
        const doc = new PDFDocument({ 
          margin: 50,
          size: 'A4'
        });

        // Buffer to store PDF data
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });

        // Header
        doc.fontSize(20)
           .fillColor('#333333')
           .text(`${businessInfo.businessName} - Business Report`, 50, 50);

        doc.fontSize(10)
           .fillColor('#666666')
           .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 80);

        // Key Metrics
        let yPosition = 120;
        doc.fontSize(14)
           .fillColor('#333333')
           .text('Summary', 50, yPosition);

        yPosition += 30;
        doc.fontSize(11)
           .fillColor('#333333')
           .text(`Total Products: ${reportData.totalProducts?.total || 0}`, 50, yPosition)
           .text(`Stock Value: $${reportData.stockValue?.stockValue?.toLocaleString() || '0'}`, 50, yPosition + 20)
           .text(`Today's Sales: $${reportData.todaysSales?.todaySales?.toLocaleString() || '0'}`, 50, yPosition + 40)
           .text(`Low Stock Items: ${reportData.lowStock?.lowStockCount || 0}`, 50, yPosition + 60);

        // Product Categories
        yPosition += 100;
        if (reportData.productCategories?.categories?.length > 0) {
          doc.fontSize(14)
             .fillColor('#333333')
             .text('Product Categories', 50, yPosition);

          yPosition += 25;
          reportData.productCategories.categories.forEach((category, index) => {
            doc.fontSize(10)
               .fillColor('#666666')
               .text(`• ${category.name}: ${category.count} items`, 60, yPosition + (index * 15));
          });
          yPosition += (reportData.productCategories.categories.length * 15) + 20;
        }

        // Sales Data
        if (reportData.salesRevenue?.labels?.length > 0) {
          doc.fontSize(14)
             .fillColor('#333333')
             .text('Weekly Sales', 50, yPosition);

          yPosition += 25;
          reportData.salesRevenue.labels.forEach((label, index) => {
            const sales = reportData.salesRevenue.sales[index] || 0;
            const revenue = reportData.salesRevenue.revenue[index] || 0;
            
            doc.fontSize(10)
               .fillColor('#666666')
               .text(`${label}: ${sales} orders, $${revenue.toFixed(2)} revenue`, 60, yPosition + (index * 15));
          });
        }

        // Footer
        doc.fontSize(8)
           .fillColor('#999999')
           .text(`${businessInfo.businessName} | ${businessInfo.email} | ${businessInfo.phone}`, 50, 750);

        // Finalize the PDF
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateInvoice(orderData, businessInfo) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });

        // Invoice Header
        doc.fontSize(20)
           .fillColor('#333333')
           .text('INVOICE', 50, 50);

        doc.fontSize(10)
           .fillColor('#666666')
           .text(`Invoice #: ${orderData.orderNumber}`, 50, 80)
           .text(`Date: ${new Date(orderData.createdAt).toLocaleDateString()}`, 50, 95);

        // Business Info
        doc.fontSize(12)
           .fillColor('#333333')
           .text('From:', 50, 130);

        doc.fontSize(10)
           .fillColor('#666666')
           .text(businessInfo.businessName, 50, 150)
           .text(businessInfo.email, 50, 165)
           .text(businessInfo.phone, 50, 180);

        // Customer Info - Billing Details
        if (orderData.customerName || orderData.customerEmail || orderData.customerPhone) {
          doc.fontSize(12)
             .fillColor('#333333')
             .text('Bill To:', 300, 130);

          let customerY = 150;
          doc.fontSize(10)
             .fillColor('#666666');
          
          if (orderData.customerName) {
            doc.text(orderData.customerName, 300, customerY);
            customerY += 15;
          }
          
          if (orderData.customerEmail) {
            doc.text(orderData.customerEmail, 300, customerY);
            customerY += 15;
          }
          
          if (orderData.customerPhone) {
            doc.text(orderData.customerPhone, 300, customerY);
            customerY += 15;
          }
        }

        // Items
        let yPosition = 220;
        doc.fontSize(12)
           .fillColor('#333333')
           .text('Items:', 50, yPosition);

        yPosition += 25;
        let subtotal = 0;

        orderData.products.forEach((item) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          doc.fontSize(10)
             .fillColor('#666666')
             .text(`${item.product?.name || 'Product'} x ${item.quantity}`, 50, yPosition)
             .text(`$${item.price.toFixed(2)} each`, 300, yPosition)
             .text(`$${itemTotal.toFixed(2)}`, 450, yPosition);

          yPosition += 20;
        });

        // Totals
        yPosition += 20;
        const tax = subtotal * 0.18;
        
        doc.fontSize(11)
           .fillColor('#333333')
           .text(`Subtotal: $${subtotal.toFixed(2)}`, 350, yPosition)
           .text(`Tax (18%): $${tax.toFixed(2)}`, 350, yPosition + 20)
           .text(`Total: $${orderData.totalAmount.toFixed(2)}`, 350, yPosition + 40);

        // Footer
        doc.fontSize(8)
           .fillColor('#999999')
           .text('Thank you for your business!', 50, 700);

        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }
}