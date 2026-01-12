import { PDFService } from '../services/pdfService.js';
import { EmailService } from '../services/emailService.js';
import { DashboardService } from '../services/dashboardService.js';
import { InvoiceTimelineService } from '../services/invoiceTimelineService.js';
import Order from '../models/Order.js';

export const generateBusinessReport = async (req, res) => {
  try {
    const { businessInfo } = req.body;

    // Get dashboard data
    const dashboardData = await DashboardService.getDashboardData();

    // Generate PDF
    const pdfBuffer = await PDFService.generateBusinessReport(dashboardData, businessInfo);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${businessInfo.businessName}-Report-${new Date().toISOString().split('T')[0]}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report',
      error: error.message
    });
  }
};

export const generateInvoicePDF = async (req, res) => {
  try {
    const { cartItems, customerInfo, businessInfo, totals, orderId } = req.body;

    // Create order data structure for PDF generation
    const orderData = {
      orderNumber: `INV-${Date.now()}`,
      products: cartItems.map(item => ({
        product: { name: item.name },
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totals.total,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      createdAt: new Date()
    };

    // Generate PDF
    const pdfBuffer = await PDFService.generateInvoice(orderData, businessInfo);

    // Add timeline event if orderId is provided
    if (orderId) {
      try {
        await InvoiceTimelineService.addPdfGeneratedEvent(orderId, req.user._id);
      } catch (timelineError) {
        console.error('Timeline PDF event failed:', timelineError);
      }
    }

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice-${orderData.orderNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Invoice PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoice PDF',
      error: error.message
    });
  }
};

export const emailInvoice = async (req, res) => {
  try {
    const { cartItems, customerInfo, businessInfo, totals, orderId } = req.body;

    if (!customerInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Customer email is required'
      });
    }

    // Create order data structure for PDF generation
    const orderData = {
      orderNumber: `INV-${Date.now()}`,
      products: cartItems.map(item => ({
        product: { name: item.name },
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totals.total,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      createdAt: new Date()
    };

    // Generate PDF
    const pdfBuffer = await PDFService.generateInvoice(orderData, businessInfo);

    // Send email with PDF attachment
    const emailResult = await EmailService.sendInvoiceEmail(
      customerInfo.email,
      customerInfo.name,
      businessInfo,
      pdfBuffer,
      orderData.orderNumber
    );

    // Add timeline event if orderId is provided
    if (orderId && emailResult.success) {
      try {
        await InvoiceTimelineService.addEmailEvent(orderId, customerInfo.email, req.user._id);
      } catch (timelineError) {
        console.error('Timeline email event failed:', timelineError);
      }
    }

    if (emailResult.success) {
      res.json({
        success: true,
        message: `Invoice sent successfully to ${customerInfo.email}`,
        orderNumber: orderData.orderNumber,
        previewUrl: emailResult.previewUrl // For test emails
      });
    } else {
      res.status(500).json({
        success: false,
        message: emailResult.message,
        error: emailResult.error
      });
    }

  } catch (error) {
    console.error('Email invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending invoice email',
      error: error.message
    });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { businessInfo } = req.body;

    // Get order data
    const order = await Order.findById(orderId)
      .populate('products.product', 'name sku category')
      .populate('createdBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate PDF
    const pdfBuffer = await PDFService.generateInvoice(order, businessInfo);

    // Add timeline event
    try {
      await InvoiceTimelineService.addPdfGeneratedEvent(orderId, req.user._id);
    } catch (timelineError) {
      console.error('Timeline PDF event failed:', timelineError);
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice-${order.orderNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoice',
      error: error.message
    });
  }
};

export const previewBusinessReport = async (req, res) => {
  try {
    const { businessInfo } = req.body;

    // Get dashboard data
    const dashboardData = await DashboardService.getDashboardData();

    // Generate PDF
    const pdfBuffer = await PDFService.generateBusinessReport(dashboardData, businessInfo);

    // Set response headers for inline viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF preview',
      error: error.message
    });
  }
};