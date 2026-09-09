import { useState } from "react";

import { Box } from "@mui/material";

import PageHeader from "../Components/dashboard/PageHeader";
import CustomerTable from "../Components/customers/CustomerTable";
import CustomerForm from "../Components/customers/CustomerForm";
import DeleteConfirmDialog from "../Components/common/ConfirmDialog";

import useCustomers from "../Hooks/useCustomers";

export interface Customer {
  _id: string;
  name: string;
  address: string;
  salary: number;
  contact: string;
}

const Customers = () => {
  const {
    customers,
    loading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [openForm, setOpenForm] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  // Add customer
  const handleAdd = () => {
    setSelectedCustomer(null);
    setOpenForm(true);
  };

  // Edit customer
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenForm(true);
  };

  // Close customer form
  const handleClose = () => {
    setOpenForm(false);
    setSelectedCustomer(null);
  };

  // Submit customer
  const handleSubmit = async (
    data: Omit<Customer, "_id">
  ) => {
    if (selectedCustomer) {
      await updateCustomer(
        selectedCustomer._id,
        data
      );
    } else {
      await createCustomer(data);
    }

    handleClose();
  };

  // Open delete modal
  const handleDeleteClick = (id: string) => {
    const customer = customers.find((customer) => customer._id === id);

    if (!customer) return;

    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const handleDeleteCancel = () => {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    try {
      setDeleteLoading(true);

      await deleteCustomer(customerToDelete._id);

      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Customers"
        subtitle="Manage your customers"
        buttonText="Add Customer"
        onButtonClick={handleAdd}
      />

      <CustomerTable
        customers={customers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <CustomerForm
        open={openForm}
        customer={selectedCustomer}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={deleteModalOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        loading={deleteLoading}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Customers;