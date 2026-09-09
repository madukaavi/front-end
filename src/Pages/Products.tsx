import { useState } from "react";

import { Box } from "@mui/material";

import PageHeader from "../Components/dashboard/PageHeader";
import ProductTable from "../Components/products/ProductTable";
import ProductForm from "../Components/products/ProductForm";
import DeleteProductModal from "../Components/customers/DeleteCustomerModal";

import useProducts from "../Hooks/useProducts";

export interface Product {
  _id: string;
  description: string;
  unitPrice: number;
  qtyOnHand: number;
}

const Products = () => {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [openForm, setOpenForm] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // Add
  const handleAdd = () => {
    setSelectedProduct(null);
    setOpenForm(true);
  };

  // Edit
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  // Close form
  const handleClose = () => {
    setOpenForm(false);
    setSelectedProduct(null);
  };

  // Submit
  const handleSubmit = async (
    data: Omit<Product, "_id">
  ) => {
    if (selectedProduct) {
      await updateProduct(
        selectedProduct._id,
        data
      );
    } else {
      await createProduct(data);
    }

    handleClose();
  };

  // Open delete modal
  const handleDeleteClick = (id: string) => {
    const product = products.find(
      (item) => item._id === id
    );

    if (!product) return;

    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const handleDeleteCancel = () => {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(true);

      await deleteProduct(
        productToDelete._id
      );

      setDeleteModalOpen(false);
      setProductToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle="Manage your products"
        buttonText="Add Product"
        onButtonClick={handleAdd}
      />

      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ProductForm
        open={openForm}
        product={selectedProduct}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <DeleteProductModal
        open={deleteModalOpen}
        product={productToDelete}
        loading={deleteLoading}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Products;