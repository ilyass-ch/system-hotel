const PDFDocument = require('pdfkit');

const generateInvoice = (invoice, path) => {
    let doc = new PDFDocument({ size: 'A4', margin: 50 });

    doc.pipe(fs.createWriteStream(path));

    doc.fontSize(20).text('Invoice', { align: 'center' });

    doc.fontSize(14).text(`Transaction ID: ${invoice.transactionId}`);
    doc.text(`Transaction Date: ${invoice.transactionDate}`);
    doc.text(`Amount: ${invoice.amount}`);
    doc.text(`Payment Method: ${invoice.paymentMethod}`);
    doc.text(`Reservation ID: ${invoice.reservation._id}`);
    doc.text(`Reservation Details: ${invoice.reservation.details}`); // Add more details as needed

    doc.end();
};

module.exports = generateInvoice;
