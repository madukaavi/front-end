import { useMemo } from "react";

import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

import { storage } from "../utils/storage";

import useCustomers from "../Hooks/useCustomers";
import useProducts from "../Hooks/useProducts";
import useOrders from "../Hooks/useOrders";

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

const Dashboard = () => {
  const user = storage.getUser();

  const fullName = user?.fullName?.trim() || "User";

  const { customers } = useCustomers();
  const { products } = useProducts();
  const { orders } = useOrders();

  /*
   * Total sales
   */
  const totalSales = useMemo(() => {
    return orders.reduce(
      (total: number, order: Order) =>
        total + Number(order.totalCost || 0),
      0
    );
  }, [orders]);

  /*
   * Recent orders
   * Latest 5 orders
   */
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a: Order, b: Order) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  /*
   * Find customer name
   * Backend order.customer contains customer ID
   */
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(
      (item: Customer) => item._id === customerId
    );

    return customer?.name || customerId || "Unknown";
  };

  /*
   * Format money
   */
  const formatCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /*
   * Format date
   */
  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* =========================
          GREETING
      ========================== */}
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 25,
              sm: 28,
              md: 30,
            },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#111827",
          }}
        >
          Good Morning, {fullName} 👋
        </Typography>

        <Typography
          sx={{
            mt: 0.6,
            fontSize: 13,
            color: "#64748b",
          }}
        >
          Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* =========================
          STAT CARDS
      ========================== */}
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
        {/* CUSTOMERS */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            minHeight: 160,
          }}
        >
          <CardContent
            sx={{
              p: 3,
              "&:last-child": {
                pb: 3,
              },
            }}
          >
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
                lineHeight: 1.2,
                color: "#111827",
              }}
            >
              {customers.length}
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

        {/* PRODUCTS */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            minHeight: 160,
          }}
        >
          <CardContent
            sx={{
              p: 3,
              "&:last-child": {
                pb: 3,
              },
            }}
          >
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
                lineHeight: 1.2,
                color: "#111827",
              }}
            >
              {products.length}
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

        {/* ORDERS */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            minHeight: 160,
          }}
        >
          <CardContent
            sx={{
              p: 3,
              "&:last-child": {
                pb: 3,
              },
            }}
          >
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
                lineHeight: 1.2,
                color: "#111827",
              }}
            >
              {orders.length}
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

        {/* SALES */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            minHeight: 160,
          }}
        >
          <CardContent
            sx={{
              p: 3,
              "&:last-child": {
                pb: 3,
              },
            }}
          >
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
                fontSize: {
                  xs: 24,
                  md: 28,
                },
                fontWeight: 700,
                lineHeight: 1.2,
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

      {/* =========================
          RECENT ORDERS
      ========================== */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
          mb: 3,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 2.5,
            py: 2.2,
            borderBottom: "1px solid #eef2f7",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Recent Orders
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            Your latest orders
          </Typography>
        </Box>

        {/* EMPTY */}
        {recentOrders.length === 0 ? (
          <Box
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "#94a3b8",
              }}
            >
              No orders available
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #eef2f7",
                      py: 1.5,
                      px: 2.5,
                    }}
                  >
                    Order ID
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #eef2f7",
                      py: 1.5,
                    }}
                  >
                    Date
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #eef2f7",
                      py: 1.5,
                    }}
                  >
                    Customer
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #eef2f7",
                      py: 1.5,
                      px: 2.5,
                    }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentOrders.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* ORDER ID */}
                    <TableCell
                      sx={{
                        fontSize: 13,
                        color: "#64748b",
                        py: 1.6,
                        px: 2.5,
                      }}
                    >
                      #{order._id.slice(-6)}
                    </TableCell>

                    {/* DATE */}
                    <TableCell
                      sx={{
                        fontSize: 13,
                        color: "#64748b",
                        py: 1.6,
                      }}
                    >
                      {formatDate(order.date)}
                    </TableCell>

                    {/* CUSTOMER */}
                    <TableCell
                      sx={{
                        fontSize: 13,
                        color: "#64748b",
                        py: 1.6,
                      }}
                    >
                      {getCustomerName(order.customer)}
                    </TableCell>

                    {/* TOTAL */}
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#111827",
                        py: 1.6,
                        px: 2.5,
                      }}
                    >
                      {formatCurrency(order.totalCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Dashboard;