import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import type { Order } from "../../Hooks/useOrders";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void | Promise<void>;
}

const OrderTable = ({
  orders,
  loading,
  onEdit,
  onDelete,
}: OrderTableProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  // --------------------------------
  // Open Delete Modal
  // --------------------------------
  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  // --------------------------------
  // Close Delete Modal
  // --------------------------------
  const handleDeleteClose = () => {
    if (deleting) return;

    setDeleteOpen(false);
    setSelectedOrder(null);
  };

  // --------------------------------
  // Confirm Delete
  // --------------------------------
  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;

    try {
      setDeleting(true);

      await onDelete(selectedOrder._id);

      setDeleteOpen(false);
      setSelectedOrder(null);
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #f3f4f6",
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              <TableCell sx={headCellStyle}>Order ID</TableCell>
              <TableCell sx={headCellStyle}>Date</TableCell>
              <TableCell sx={headCellStyle}>Customer</TableCell>
              <TableCell sx={headCellStyle}>Products</TableCell>
              <TableCell sx={headCellStyle}>Total</TableCell>

              <TableCell
                sx={{
                  ...headCellStyle,
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[1, 2, 3, 4, 5].map((row) => (
              <TableRow key={row}>
                {[1, 2, 3, 4, 5, 6].map((cell) => (
                  <TableCell key={cell}>
                    <Skeleton
                      variant="text"
                      width={cell === 6 ? 80 : "70%"}
                      height={24}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // --------------------------------
  // Empty State
  // --------------------------------
  if (orders.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #f3f4f6",
          borderRadius: 3,
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            px: 2,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <ShoppingCartOutlinedIcon
              sx={{
                fontSize: 30,
                color: "#9ca3af",
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            No orders found
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 13,
              color: "#9ca3af",
            }}
          >
            There are no orders available.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <>
      {/* ==============================
          ORDER TABLE
      ============================== */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #f3f4f6",
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              <TableCell sx={headCellStyle}>Order ID</TableCell>

              <TableCell sx={headCellStyle}>Date</TableCell>

              <TableCell sx={headCellStyle}>Customer</TableCell>

              <TableCell sx={headCellStyle}>Products</TableCell>

              <TableCell sx={headCellStyle}>Total</TableCell>

              <TableCell
                sx={{
                  ...headCellStyle,
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                hover
                sx={{
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                {/* Order ID */}
                <TableCell sx={bodyCellStyle}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    #{order._id.slice(-6)}
                  </Typography>
                </TableCell>

                {/* Date */}
                <TableCell sx={bodyCellStyle}>
                  {new Date(order.date).toLocaleDateString("en-LK")}
                </TableCell>

                {/* Customer */}
                <TableCell sx={bodyCellStyle}>
                  {order.customer || "-"}
                </TableCell>

                {/* Products */}
                <TableCell sx={bodyCellStyle}>
                  {Array.isArray(order.products)
                    ? order.products.length
                    : 0}
                </TableCell>

                {/* Total */}
                <TableCell sx={bodyCellStyle}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Rs.{" "}
                    {Number(order.totalCost || 0).toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    textAlign: "center",
                  }}
                >
                  {/* Edit */}
                  <IconButton
                    size="small"
                    onClick={() => onEdit(order)}
                    sx={{
                      mr: 0.5,
                      color: "#6b7280",
                      "&:hover": {
                        bgcolor: "#f3f4f6",
                        color: "#111827",
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  {/* Delete */}
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(order)}
                    sx={{
                      color: "#6b7280",
                      "&:hover": {
                        bgcolor: "#fef2f2",
                        color: "#dc2626",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ==============================
          DELETE ORDER MODAL
      ============================== */}

      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            p: 1,
            boxShadow: "0 20px 50px rgba(0,0,0,0.20)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 19,
            fontWeight: 700,
            color: "#111827",
            pb: 1,
          }}
        >
          Delete Order
        </DialogTitle>

        <DialogContent sx={{ pt: "8px !important" }}>
          <Typography
            sx={{
              fontSize: 14,
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete this order?
          </Typography>

          {selectedOrder && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Order #{selectedOrder._id.slice(-6)}
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 12,
                  color: "#9ca3af",
                }}
              >
                Total: Rs.{" "}
                {Number(selectedOrder.totalCost || 0).toLocaleString(
                  "en-LK",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,
            pb: 2,
            pt: 1.5,
            gap: 1,
          }}
        >
          <Button
            onClick={handleDeleteClose}
            disabled={deleting}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              borderColor: "#d1d5db",
              borderRadius: 2,
              px: 2.5,
              "&:hover": {
                borderColor: "#9ca3af",
                bgcolor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmDelete}
            disabled={deleting}
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              bgcolor: "#ef4444",
              borderRadius: 2,
              px: 2.5,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#dc2626",
                boxShadow: "none",
              },
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// --------------------------------
// Table Header Style
// --------------------------------

const headCellStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#9ca3af",
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
  borderBottom: "1px solid #e5e7eb",
  py: 2,
  px: 2.5,
};

// --------------------------------
// Table Body Style
// --------------------------------

const bodyCellStyle = {
  fontSize: 14,
  color: "#6b7280",
  borderBottom: "1px solid #f9fafb",
  py: 2,
  px: 2.5,
  whiteSpace: "nowrap" as const,
};

// --------------------------------
// Default Export
// --------------------------------

export default OrderTable;