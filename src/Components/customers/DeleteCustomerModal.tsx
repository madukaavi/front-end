import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export interface DeleteProduct {
  _id: string;
  description: string;
  unitPrice: number;
  qtyOnHand: number;
}

interface DeleteProductModalProps {
  open: boolean;
  product: DeleteProduct | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const DeleteProductModal = ({
  open,
  product,
  loading = false,
  onClose,
  onConfirm,
}: DeleteProductModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            boxShadow: "0 20px 50px rgba(0,0,0,0.20)",
          },
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
        Delete Product
      </DialogTitle>

      <DialogContent sx={{ pt: "8px !important" }}>
        <Typography
          sx={{
            fontSize: 14,
            color: "#6b7280",
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to delete this product?
        </Typography>

        {product && (
          <Box
            sx={{
              mt: 2,
              px: 1.5,
              py: 1.25,
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
              {product.description}
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              Rs.{" "}
              {Number(product.unitPrice).toLocaleString("en-LK", {
                minimumFractionDigits: 2,
              })}{" "}
              • Qty: {product.qtyOnHand}
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
          onClick={onClose}
          disabled={loading}
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
          onClick={onConfirm}
          disabled={loading}
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
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductModal;