import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import useCustomers from "../Hooks/useCustomers";
import useProducts from "../Hooks/useProducts";
import useOrders from "../Hooks/useOrders";

import { storage } from "../utils/storage";

interface Customer {
  _id: string;
  name: string;
  address: string;
  salary: number;
  contact: string;
}

interface Order {
  _id: string;
  date: string;
  totalCost: number;
  products: unknown[];
  customer: string;
}

const ORDERS_PER_PAGE = 5;

const Dashboard = () => {
  const { customers } = useCustomers();
  const { products } = useProducts();
  const { orders } = useOrders();

  const user = storage.getUser();

  const fullName = user?.fullName?.trim() || "User";

  const [page, setPage] = useState(1);

  /*
   * ----------------------------------------------------
   * CUSTOMER NAME
   * ----------------------------------------------------
   */

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(
      (item: Customer) => item._id === customerId
    );

    return customer?.name || customerId;
  };

  /*
   * ----------------------------------------------------
   * SORT ORDERS
   * Latest orders first
   * ----------------------------------------------------
   */

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a: Order, b: Order) => {
      return (
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      );
    });
  }, [orders]);

  /*
   * ----------------------------------------------------
   * PAGINATION
   * ----------------------------------------------------
   */

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / ORDERS_PER_PAGE)
  );

  const currentOrders = sortedOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  /*
   * ----------------------------------------------------
   * DASHBOARD TOTALS
   * ----------------------------------------------------
   */

  const totalCustomers = customers.length;

  const totalProducts = products.length;

  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (total: number, order: Order) =>
      total + Number(order.totalCost || 0),
    0
  );

  /*
   * ----------------------------------------------------
   * DATE FORMAT
   * ----------------------------------------------------
   */

  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US");
  };

  /*
   * ----------------------------------------------------
   * CURRENCY
   * ----------------------------------------------------
   */

  const formatCurrency = (amount: number) => {
    return `Rs. ${Number(amount || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  /*
   * ----------------------------------------------------
   * PRINT ORDER SUMMARY
   * ----------------------------------------------------
   */

  const handlePrint = () => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!printWindow) {
      return;
    }

    const rows = sortedOrders
      .map(
        (order: Order) => `
          <tr>
            <td>#${order._id.slice(-6)}</td>
            <td>${formatDate(order.date)}</td>
            <td>${getCustomerName(order.customer)}</td>
            <td style="text-align:right">
              ${formatCurrency(order.totalCost)}
            </td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Summary</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 40px;
              color: #111827;
              background: #ffffff;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
            }

            .title {
              font-size: 26px;
              font-weight: 700;
              margin: 0;
            }

            .subtitle {
              color: #64748b;
              font-size: 13px;
              margin-top: 6px;
            }

            .summary {
              display: flex;
              gap: 35px;
              margin-bottom: 30px;
            }

            .summary-item {
              border: 1px solid #e5e7eb;
              padding: 15px 20px;
              border-radius: 8px;
              min-width: 150px;
            }

            .summary-label {
              color: #64748b;
              font-size: 12px;
              margin-bottom: 7px;
            }

            .summary-value {
              font-size: 20px;
              font-weight: 700;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th {
              background: #f8fafc;
              text-align: left;
              font-size: 12px;
              color: #64748b;
              padding: 12px;
              border: 1px solid #e5e7eb;
            }

            td {
              padding: 12px;
              font-size: 13px;
              border: 1px solid #e5e7eb;
            }

            .total {
              text-align: right;
              font-weight: 700;
            }

            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>

        <body>

          <div class="header">
            <div>
              <h1 class="title">Order Summary</h1>
              <div class="subtitle">
                POSZ - Point of Sale
              </div>
            </div>

            <div>
              <strong>${fullName}</strong>
            </div>
          </div>

          <div class="summary">

            <div class="summary-item">
              <div class="summary-label">
                Total Orders
              </div>
              <div class="summary-value">
                ${totalOrders}
              </div>
            </div>

            <div class="summary-item">
              <div class="summary-label">
                Total Sales
              </div>
              <div class="summary-value">
                ${formatCurrency(totalSales)}
              </div>
            </div>

            <div class="summary-item">
              <div class="summary-label">
                Customers
              </div>
              <div class="summary-value">
                ${totalCustomers}
              </div>
            </div>

          </div>

          <table>

            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>CUSTOMER</th>
                <th style="text-align:right">
                  TOTAL
                </th>
              </tr>
            </thead>

            <tbody>
              ${
                rows ||
                `
                  <tr>
                    <td colspan="4" style="text-align:center">
                      No orders available
                    </td>
                  </tr>
                `
              }
            </tbody>

          </table>

        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  /*
   * ----------------------------------------------------
   * DOWNLOAD PDF
   * ----------------------------------------------------
   */

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    /*
     * Title
     */

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Order Summary", 14, 20);

    /*
     * Subtitle
     */

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("POSZ - Point of Sale", 14, 27);

    doc.text(`User: ${fullName}`, 14, 34);

    /*
     * Summary
     */

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    doc.text(
      `Total Orders: ${totalOrders}`,
      14,
      45
    );

    doc.text(
      `Total Customers: ${totalCustomers}`,
      75,
      45
    );

    doc.text(
      `Total Sales: ${formatCurrency(totalSales)}`,
      145,
      45
    );

    /*
     * Table
     */

    const tableRows = sortedOrders.map(
      (order: Order) => [
        `#${order._id.slice(-6)}`,
        formatDate(order.date),
        getCustomerName(order.customer),
        formatCurrency(order.totalCost),
      ]
    );

    autoTable(doc, {
      startY: 55,

      head: [
        [
          "ORDER ID",
          "DATE",
          "CUSTOMER",
          "TOTAL",
        ],
      ],

      body:
        tableRows.length > 0
          ? tableRows
          : [
              [
                "-",
                "-",
                "No orders available",
                "-",
              ],
            ],

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

      headStyles: {
        fontSize: 9,
        fontStyle: "bold",
      },

      columnStyles: {
        0: {
          cellWidth: 35,
        },
        1: {
          cellWidth: 35,
        },
        2: {
          cellWidth: 70,
        },
        3: {
          cellWidth: 40,
          halign: "right",
        },
      },
    });

    /*
     * Footer
     */

    const pageCount =
      (doc as any).internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(8);

      doc.text(
        `Generated by POSZ`,
        14,
        290
      );

      doc.text(
        `Page ${i} of ${pageCount}`,
        170,
        290
      );
    }

    /*
     * Download
     */

    doc.save("POSZ-Order-Summary.pdf");
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* =================================================
          DASHBOARD GREETING
          ================================================= */}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: {
              xs: 24,
              sm: 28,
              md: 30,
            },
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Good Morning, {fullName} 👋
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "#64748b",
          }}
        >
          Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* =================================================
          STAT CARDS
          ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        {/* Customers */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Total Customers
              </Typography>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111827",
                }}
              >
                <PeopleAltOutlinedIcon />
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {totalCustomers}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              All registered customers
            </Typography>
          </CardContent>
        </Card>

        {/* Products */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Total Products
              </Typography>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111827",
                }}
              >
                <Inventory2OutlinedIcon />
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {totalProducts}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              Products in inventory
            </Typography>
          </CardContent>
        </Card>

        {/* Orders */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Total Orders
              </Typography>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111827",
                }}
              >
                <ShoppingCartOutlinedIcon />
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {totalOrders}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              Orders placed
            </Typography>
          </CardContent>
        </Card>

        {/* Sales */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Total Sales
              </Typography>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111827",
                }}
              >
                <AttachMoneyOutlinedIcon />
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {formatCurrency(totalSales)}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              Total sales revenue
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* =================================================
          RECENT ORDERS
          ================================================= */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Header */}

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Recent Orders
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#94a3b8",
                mt: 0.4,
              }}
            >
              Your latest orders
            </Typography>
          </Box>

          {/* RIGHT SIDE BUTTONS */}

          <Stack
            direction="row"
            spacing={1}
          >
            <Button
              variant="outlined"
              startIcon={<PrintOutlinedIcon />}
              onClick={handlePrint}
              sx={{
                height: 38,
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
                borderColor: "#e2e8f0",
                borderRadius: 2,
                px: 1.8,

                "&:hover": {
                  borderColor: "#cbd5e1",
                  bgcolor: "#f8fafc",
                },
              }}
            >
              Print
            </Button>

            <Button
              variant="contained"
              startIcon={<PictureAsPdfOutlinedIcon />}
              onClick={handleDownloadPDF}
              sx={{
                height: 38,
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                bgcolor: "#2563eb",
                borderRadius: 2,
                px: 1.8,

                "&:hover": {
                  bgcolor: "#1d4ed8",
                },
              }}
            >
              PDF
            </Button>
          </Stack>
        </Box>

        {/* =================================================
            TABLE
            ================================================= */}

        {currentOrders.length > 0 ? (
          <>
            <TableContainer
              sx={{
                overflowX: "auto",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        py: 1.7,
                        px: 3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ORDER ID
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        py: 1.7,
                        whiteSpace: "nowrap",
                      }}
                    >
                      DATE
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        py: 1.7,
                      }}
                    >
                      CUSTOMER
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        py: 1.7,
                        px: 3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      TOTAL
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentOrders.map(
                    (order: Order) => (
                      <TableRow
                        key={order._id}
                        hover
                      >
                        <TableCell
                          sx={{
                            px: 3,
                            py: 1.8,
                            fontSize: 13,
                            color: "#64748b",
                          }}
                        >
                          #{order._id.slice(-6)}
                        </TableCell>

                        <TableCell
                          sx={{
                            py: 1.8,
                            fontSize: 13,
                            color: "#64748b",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(order.date)}
                        </TableCell>

                        <TableCell
                          sx={{
                            py: 1.8,
                            fontSize: 13,
                            color: "#64748b",
                          }}
                        >
                          {getCustomerName(
                            order.customer
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 3,
                            py: 1.8,
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#111827",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatCurrency(
                            order.totalCost
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* =================================================
                PAGINATION
                ================================================= */}

            {totalPages > 1 && (
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  size="small"
                  shape="rounded"
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          /* =================================================
             EMPTY STATE
             ================================================= */

          <Box
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#94a3b8",
                }}
              >
                No orders available
              </Typography>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Dashboard;