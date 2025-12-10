import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FinancialReportData {
    summary: {
        total_revenue: number;
        total_expenses: number;
        net_profit: number;
        operational_expenses?: number;
        salaries?: number;
    };
    recent_sales: Array<{
        sale_code: string;
        customer_name: string;
        sale_date: string;
        total_amount_ngn: number;
    }>;
    recent_expenses: Array<{
        description: string;
        expense_date: string;
        amount_ngn: number;
    }>;
}

export const generateFinancialReport = (data: FinancialReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Section
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('TaniTrack', 14, 22);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Financial Summary Report', 14, 32);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const today = new Date();
    doc.text(`Generated: ${today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, 14, 38);

    // Draw a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 42, pageWidth - 14, 42);

    // Summary Section
    let yPos = 52;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Financial Overview', 14, yPos);

    yPos += 8;

    const profitMargin = data.summary.total_revenue > 0
        ? ((data.summary.net_profit / data.summary.total_revenue) * 100).toFixed(1)
        : '0.0';

    // Calculate operational expenses (total - salaries if available)
    const operationalExpenses = data.summary.operational_expenses || data.summary.total_expenses;
    const salaries = data.summary.salaries || 0;

    // Summary table with improved formatting
    const summaryRows = [
        ['Total Revenue', `N${data.summary.total_revenue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ];

    // Add expense breakdown if salaries exist
    if (salaries > 0) {
        summaryRows.push(
            ['Operational Expenses', `N${operationalExpenses.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
            ['Worker Salaries', `N${salaries.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
            ['Total Expenses', `N${data.summary.total_expenses.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
        );
    } else {
        summaryRows.push(
            ['Total Expenses', `N${data.summary.total_expenses.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
        );
    }

    summaryRows.push(
        ['Gross Profit', `N${data.summary.net_profit.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ['Profit Margin', `${profitMargin}%`]
    );

    autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Amount (N)']],
        body: summaryRows,
        theme: 'grid',
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'left'
        },
        styles: {
            fontSize: 10,
            cellPadding: 4
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80, halign: 'left' },
            1: { halign: 'right', cellWidth: 80 }
        },
        margin: { left: 14, right: 14 }
    });

    // Recent Sales Section
    yPos = (doc as any).lastAutoTable.finalY + 18;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Recent Sales (Last 10 Transactions)', 14, yPos);

    yPos += 6;

    if (data.recent_sales.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No sales recorded yet', 14, yPos + 10);
        yPos += 20;
    } else {
        autoTable(doc, {
            startY: yPos,
            head: [['Customer', 'Date', 'Amount (N)']],
            body: data.recent_sales.map(sale => [
                sale.customer_name || 'Unknown',
                new Date(sale.sale_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                `N${Number(sale.total_amount_ngn).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [34, 197, 94],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 80, overflow: 'linebreak' },
                1: { cellWidth: 45, halign: 'center' },
                2: { halign: 'right', cellWidth: 45 }
            },
            margin: { left: 14, right: 14 }
        });
        yPos = (doc as any).lastAutoTable.finalY;
    }

    // Recent Expenses Section
    yPos += 18;

    // Check if we need a new page
    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Recent Expenses (Last 10 Entries)', 14, yPos);

    yPos += 6;

    if (data.recent_expenses.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No expenses recorded yet', 14, yPos + 10);
    } else {
        autoTable(doc, {
            startY: yPos,
            head: [['Description', 'Date', 'Amount (N)']],
            body: data.recent_expenses.map(expense => [
                expense.description || 'No description',
                new Date(expense.expense_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                `N${Number(expense.amount_ngn).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [239, 68, 68],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 100, overflow: 'linebreak' },
                1: { cellWidth: 35, halign: 'center' },
                2: { halign: 'right', cellWidth: 35 }
            },
            margin: { left: 14, right: 14 }
        });
    }

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);

        // Page number
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );

        // Company name in footer
        doc.text(
            'TaniTrack Hatchery Management',
            14,
            doc.internal.pageSize.getHeight() - 10
        );
    }

    // Save the PDF
    const fileName = `TaniTrack_Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
// Sales Report Interfaces and Generator
interface SalesReportData {
    period: {
        start_date: string;
        end_date: string;
    };
    summary: {
        total_sales: number;
        total_quantity: number;
        total_revenue: number;
        avg_sale_value: number;
    };
    top_customers: Array<{
        customer_name: string;
        purchase_count: number;
        total_spent: number;
    }>;
    sales_by_batch: Array<{
        batch_code: string;
        sales_count: number;
        total_quantity: number;
        total_revenue: number;
    }>;
    transactions: Array<{
        sale_date: string;
        customer_name: string;
        batch_code: string;
        quantity_sold: number;
        price_per_piece_ngn: number;
        total_amount_ngn: number;
        payment_status: string;
    }>;
}

export const generateSalesReport = (data: SalesReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Section
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green color for sales
    doc.text('TaniTrack', 14, 22);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Sales Report', 14, 32);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const today = new Date();
    const startDate = new Date(data.period.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const endDate = new Date(data.period.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    doc.text(`Period: ${startDate} - ${endDate}`, 14, 38);
    doc.text(`Generated: ${today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, 14, 43);

    // Draw a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 47, pageWidth - 14, 47);

    // Sales Summary Section
    let yPos = 57;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Sales Summary', 14, yPos);

    yPos += 8;

    autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
            ['Total Sales', Number(data.summary.total_sales).toLocaleString()],
            ['Total Quantity Sold', Number(data.summary.total_quantity || 0).toLocaleString()],
            ['Total Revenue', `N${Number(data.summary.total_revenue || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`],
            ['Average Sale Value', `N${Number(data.summary.avg_sale_value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`],
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [34, 197, 94],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'left'
        },
        styles: {
            fontSize: 10,
            cellPadding: 4
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80, halign: 'left' },
            1: { halign: 'right', cellWidth: 80 }
        },
        margin: { left: 14, right: 14 }
    });

    // Top Customers Section
    yPos = (doc as any).lastAutoTable.finalY + 18;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Top Customers', 14, yPos);

    yPos += 6;

    if (data.top_customers.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No customer data available', 14, yPos + 10);
        yPos += 20;
    } else {
        autoTable(doc, {
            startY: yPos,
            head: [['Customer', 'Purchases', 'Total Spent (N)']],
            body: data.top_customers.map(customer => [
                customer.customer_name || 'Unknown',
                Number(customer.purchase_count).toLocaleString(),
                `N${Number(customer.total_spent).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [34, 197, 94],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 80, overflow: 'linebreak' },
                1: { cellWidth: 40, halign: 'center' },
                2: { halign: 'right', cellWidth: 50 }
            },
            margin: { left: 14, right: 14 }
        });
        yPos = (doc as any).lastAutoTable.finalY;
    }

    // Sales by Batch Section
    yPos += 18;

    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Sales by Batch', 14, yPos);

    yPos += 6;

    if (data.sales_by_batch.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No batch data available', 14, yPos + 10);
        yPos += 20;
    } else {
        autoTable(doc, {
            startY: yPos,
            head: [['Batch', 'Sales', 'Quantity', 'Revenue (N)']],
            body: data.sales_by_batch.map(batch => [
                batch.batch_code || 'Unknown',
                Number(batch.sales_count).toLocaleString(),
                `${Number(batch.total_quantity).toLocaleString()} fish`,
                `N${Number(batch.total_revenue).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [34, 197, 94],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 40, halign: 'center' },
                3: { halign: 'right', cellWidth: 50 }
            },
            margin: { left: 14, right: 14 }
        });
        yPos = (doc as any).lastAutoTable.finalY;
    }

    // Detailed Transactions Section
    yPos += 18;

    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Sales Transactions', 14, yPos);

    yPos += 6;

    if (data.transactions.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No transactions in this period', 14, yPos + 10);
    } else {
        autoTable(doc, {
            startY: yPos,
            head: [['Date', 'Customer', 'Batch', 'Qty', 'Amount (N)']],
            body: data.transactions.map(txn => [
                new Date(txn.sale_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                txn.customer_name || 'Unknown',
                txn.batch_code || 'N/A',
                Number(txn.quantity_sold).toLocaleString(),
                `N${Number(txn.total_amount_ngn).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [34, 197, 94],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 8
            },
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: 28 },
                1: { cellWidth: 50, overflow: 'linebreak' },
                2: { cellWidth: 30 },
                3: { cellWidth: 20, halign: 'center' },
                4: { halign: 'right', cellWidth: 42 }
            },
            margin: { left: 14, right: 14 }
        });
    }

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);

        // Page number
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );

        // Company name in footer
        doc.text(
            'TaniTrack Hatchery Management',
            14,
            doc.internal.pageSize.getHeight() - 10
        );
    }

    // Save the PDF
    const fileName = `TaniTrack_Sales_Report_${data.period.start_date}_to_${data.period.end_date}.pdf`;
    doc.save(fileName);
};
// Production Report Interfaces and Generator
interface ProductionReportData {
    summary: {
        active_batches: number;
        total_batches: number;
        total_fish_stock: number;
        survival_rate: number;
    };
    stages: Array<{
        current_stage: string;
        batch_count: number;
        total_fish: number;
    }>;
    batches: Array<{
        batch_code: string;
        current_stage: string;
        current_count: number;
        initial_count: number;
        start_date: string;
        tank_name: string;
        status: string;
        days_in_production: number;
        survival_rate: number;
    }>;
}

export const generateProductionReport = (data: ProductionReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Section
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(147, 51, 234); // Purple color for production
    doc.text('TaniTrack', 14, 22);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Production Report', 14, 32);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const today = new Date();
    doc.text(`Generated: ${today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, 14, 38);

    // Draw a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 42, pageWidth - 14, 42);

    // Production Summary Section
    let yPos = 52;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Production Overview', 14, yPos);

    yPos += 8;

    autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
            ['Active Batches', Number(data.summary.active_batches).toLocaleString()],
            ['Total Batches', Number(data.summary.total_batches).toLocaleString()],
            ['Total Fish Stock', Number(data.summary.total_fish_stock).toLocaleString()],
            ['Overall Survival Rate', `${Number(data.summary.survival_rate).toFixed(1)}%`],
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [147, 51, 234],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'left'
        },
        styles: {
            fontSize: 10,
            cellPadding: 4
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80, halign: 'left' },
            1: { halign: 'right', cellWidth: 80 }
        },
        margin: { left: 14, right: 14 }
    });

    // Batches by Stage Section
    yPos = (doc as any).lastAutoTable.finalY + 18;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Batches by Growth Stage', 14, yPos);

    yPos += 6;

    if (data.stages.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No active batches', 14, yPos + 10);
        yPos += 20;
    } else {
        autoTable(doc, {
            startY: yPos,
            head: [['Stage', 'Batches', 'Total Fish']],
            body: data.stages.map(stage => [
                stage.current_stage,
                Number(stage.batch_count).toLocaleString(),
                Number(stage.total_fish).toLocaleString()
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [147, 51, 234],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 50, halign: 'center' },
                2: { halign: 'right', cellWidth: 60 }
            },
            margin: { left: 14, right: 14 }
        });
        yPos = (doc as any).lastAutoTable.finalY;
    }

    // Batch Performance Details Section
    yPos += 18;

    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Batch Performance Details', 14, yPos);

    yPos += 6;

    if (data.batches.length === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('No active batches to display', 14, yPos + 10);
    } else {
        autoTable(doc, {
            startY: yPos,
            head: [['Batch', 'Stage', 'Tank', 'Count', 'Days', 'Survival %']],
            body: data.batches.map(batch => [
                batch.batch_code,
                batch.current_stage,
                batch.tank_name || 'N/A',
                Number(batch.current_count).toLocaleString(),
                Number(batch.days_in_production),
                `${Number(batch.survival_rate).toFixed(1)}%`
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [147, 51, 234],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 8
            },
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 30 },
                2: { cellWidth: 35, overflow: 'linebreak' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 20, halign: 'center' },
                5: { cellWidth: 25, halign: 'right' }
            },
            margin: { left: 14, right: 14 }
        });
    }

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);

        // Page number
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );

        // Company name in footer
        doc.text(
            'TaniTrack Hatchery Management',
            14,
            doc.internal.pageSize.getHeight() - 10
        );
    }

    // Save the PDF
    const fileName = `TaniTrack_Production_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
