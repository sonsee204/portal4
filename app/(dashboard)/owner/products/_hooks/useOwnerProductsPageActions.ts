/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { useCallback, useState } from 'react';
import {
  useOwnerCategoryMutations,
  useOwnerProductMutations,
  type VenueCategoryNode,
  type VenueProductNode,
} from '@/hooks/owner';
import { ProductStatus } from '@/graphql/generated';
import {
  EMPTY_CATEGORY_FORM,
  EMPTY_IMPORT_STOCK_FORM,
  EMPTY_PRODUCT_FORM,
} from './owner-products-page.constants';
import type { OwnerProductsPageData } from './useOwnerProductsPageData';

export type ProductFormState = typeof EMPTY_PRODUCT_FORM;
export type CategoryFormState = typeof EMPTY_CATEGORY_FORM;
export type ImportStockFormState = typeof EMPTY_IMPORT_STOCK_FORM;

export interface ImportStockMarginAnalysis {
  currentPrice: number;
  estimatedAvgCost: number;
  importPrice: number;
  quantity: number;
}

export interface ProductStatusToggleTarget {
  productId: string;
  productName: string;
  action: 'publish' | 'unpublish';
}

export function useOwnerProductsPageActions(data: OwnerProductsPageData) {
  const {
    venueId,
    setViewTab,
    setStatusFilter,
    setSearchQuery,
    productsLoadMore,
    categoriesLoadMore,
    refetchAll,
  } = data;

  const productMutations = useOwnerProductMutations();
  const categoryMutations = useOwnerCategoryMutations();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VenueProductNode | null>(
    null,
  );
  const [productForm, setProductForm] = useState<ProductFormState>(
    EMPTY_PRODUCT_FORM,
  );

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<VenueCategoryNode | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(
    EMPTY_CATEGORY_FORM,
  );

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [statusToggleTarget, setStatusToggleTarget] =
    useState<ProductStatusToggleTarget | null>(null);

  const [importStockModalOpen, setImportStockModalOpen] = useState(false);
  const [importStockTarget, setImportStockTarget] =
    useState<VenueProductNode | null>(null);
  const [importStockForm, setImportStockForm] = useState<ImportStockFormState>(
    EMPTY_IMPORT_STOCK_FORM,
  );
  const [importMarginModalOpen, setImportMarginModalOpen] = useState(false);
  const [importMarginAnalysis, setImportMarginAnalysis] =
    useState<ImportStockMarginAnalysis | null>(null);

  const handleViewTabChange = useCallback(
    (value: string) => {
      setViewTab(value as 'products' | 'categories');
      setStatusFilter('ALL');
      setSearchQuery('');
    },
    [setViewTab, setStatusFilter, setSearchQuery],
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
    },
    [setStatusFilter],
  );

  const openCreateProduct = useCallback(() => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    setProductModalOpen(true);
  }, []);

  const openEditProduct = useCallback((product: VenueProductNode) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      sku: product.sku ?? '',
      unit: product.unit ?? 'cái',
      price: String(product.price),
      stockQuantity: String(product.stockQuantity ?? 0),
      lowStockThreshold: String(product.lowStockThreshold ?? 5),
      categoryId: product.category?._id ?? '',
    });
    setProductModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setProductModalOpen(false);
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT_FORM);
  }, []);

  const handleProductSubmit = useCallback(async () => {
    if (!venueId || !productForm.name.trim() || !productForm.categoryId) return;

    const price = parseInt(productForm.price, 10);
    if (Number.isNaN(price)) return;

    if (editingProduct) {
      await productMutations.updateProduct({
        productId: editingProduct._id,
        name: productForm.name.trim(),
        sku: productForm.sku.trim() || undefined,
        unit: productForm.unit.trim() || 'cái',
        price,
        categoryId: productForm.categoryId,
        stockQuantity: parseInt(productForm.stockQuantity, 10) || 0,
        lowStockThreshold: parseInt(productForm.lowStockThreshold, 10) || 5,
      });
    } else {
      await productMutations.createProduct({
        venueId,
        name: productForm.name.trim(),
        sku: productForm.sku.trim() || undefined,
        unit: productForm.unit.trim() || 'cái',
        price,
        categoryId: productForm.categoryId,
        stockQuantity: parseInt(productForm.stockQuantity, 10) || 0,
        lowStockThreshold: parseInt(productForm.lowStockThreshold, 10) || 5,
      });
    }

    closeProductModal();
    refetchAll();
  }, [
    venueId,
    productForm,
    editingProduct,
    productMutations,
    closeProductModal,
    refetchAll,
  ]);

  const handleDeleteProduct = useCallback(async () => {
    if (!deleteProductId) return;
    await productMutations.deleteProduct(deleteProductId);
    setDeleteProductId(null);
    refetchAll();
  }, [deleteProductId, productMutations, refetchAll]);

  const handlePublishProduct = useCallback(
    async (productId: string) => {
      await productMutations.publishProduct(productId);
      refetchAll();
    },
    [productMutations, refetchAll],
  );

  const handleUnpublishProduct = useCallback(
    async (productId: string) => {
      await productMutations.unpublishProduct(productId);
      refetchAll();
    },
    [productMutations, refetchAll],
  );

  const openStatusToggleDialog = useCallback((product: VenueProductNode) => {
    setStatusToggleTarget({
      productId: product._id,
      productName: product.name,
      action:
        product.status === ProductStatus.Active ? 'unpublish' : 'publish',
    });
  }, []);

  const closeStatusToggleDialog = useCallback(() => {
    if (productMutations.mutationLoading) return;
    setStatusToggleTarget(null);
  }, [productMutations.mutationLoading]);

  const handleStatusToggleConfirm = useCallback(async () => {
    if (!statusToggleTarget) return;

    if (statusToggleTarget.action === 'publish') {
      await handlePublishProduct(statusToggleTarget.productId);
    } else {
      await handleUnpublishProduct(statusToggleTarget.productId);
    }
    setStatusToggleTarget(null);
  }, [handlePublishProduct, handleUnpublishProduct, statusToggleTarget]);

  const openImportStock = useCallback((product?: VenueProductNode) => {
    setImportStockTarget(product ?? null);
    setImportStockForm({
      ...EMPTY_IMPORT_STOCK_FORM,
      productId: product?._id ?? '',
      importPrice:
        product?.lastImportPrice != null
          ? String(product.lastImportPrice)
          : '',
    });
    setImportMarginAnalysis(null);
    setImportMarginModalOpen(false);
    setImportStockModalOpen(true);
  }, []);

  const closeImportStockModal = useCallback(() => {
    setImportStockModalOpen(false);
    setImportStockTarget(null);
    setImportStockForm(EMPTY_IMPORT_STOCK_FORM);
    setImportMarginAnalysis(null);
    setImportMarginModalOpen(false);
  }, []);

  const closeImportMarginModal = useCallback(() => {
    setImportMarginModalOpen(false);
    setImportMarginAnalysis(null);
  }, []);

  const openCreateCategory = useCallback(() => {
    setEditingCategory(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setCategoryModalOpen(true);
  }, []);

  const openEditCategory = useCallback((category: VenueCategoryNode) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      displayOrder: String(category.displayOrder ?? 0),
    });
    setCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
  }, []);

  const handleCategorySubmit = useCallback(async () => {
    if (!venueId || !categoryForm.name.trim()) return;

    if (editingCategory) {
      await categoryMutations.updateCategory({
        categoryId: editingCategory._id,
        name: categoryForm.name.trim(),
        displayOrder: parseInt(categoryForm.displayOrder, 10) || 0,
      });
    } else {
      await categoryMutations.createCategory({
        venueId,
        name: categoryForm.name.trim(),
        displayOrder: parseInt(categoryForm.displayOrder, 10) || 0,
      });
    }

    closeCategoryModal();
    refetchAll();
  }, [
    venueId,
    categoryForm,
    editingCategory,
    categoryMutations,
    closeCategoryModal,
    refetchAll,
  ]);

  const handleDeleteCategory = useCallback(async () => {
    if (!deleteCategoryId) return;
    await categoryMutations.deleteCategory(deleteCategoryId);
    setDeleteCategoryId(null);
    refetchAll();
  }, [deleteCategoryId, categoryMutations, refetchAll]);

  return {
    productCreating: productMutations.creating,
    productUpdating: productMutations.updating,
    productDeleting: productMutations.deleting,
    productPublishing: productMutations.publishing,
    productUnpublishing: productMutations.unpublishing,
    productMutationLoading: productMutations.mutationLoading,
    categoryCreating: categoryMutations.creating,
    categoryUpdating: categoryMutations.updating,
    categoryDeleting: categoryMutations.deleting,
    categoryMutationLoading: categoryMutations.mutationLoading,
    mutationLoading:
      productMutations.mutationLoading || categoryMutations.mutationLoading,
    handleViewTabChange,
    handleStatusFilterChange,
    handleProductsLoadMore: () => void productsLoadMore(),
    handleCategoriesLoadMore: () => void categoriesLoadMore(),
    productModalOpen,
    editingProduct,
    productForm,
    setProductForm,
    openCreateProduct,
    openEditProduct,
    closeProductModal,
    handleProductSubmit,
    deleteProductId,
    setDeleteProductId,
    handleDeleteProduct,
    handlePublishProduct,
    handleUnpublishProduct,
    statusToggleTarget,
    openStatusToggleDialog,
    closeStatusToggleDialog,
    handleStatusToggleConfirm,
    importStockModalOpen,
    importStockTarget,
    importStockForm,
    setImportStockForm,
    openImportStock,
    closeImportStockModal,
    importMarginModalOpen,
    setImportMarginModalOpen,
    importMarginAnalysis,
    setImportMarginAnalysis,
    closeImportMarginModal,
    categoryModalOpen,
    editingCategory,
    categoryForm,
    setCategoryForm,
    openCreateCategory,
    openEditCategory,
    closeCategoryModal,
    handleCategorySubmit,
    deleteCategoryId,
    setDeleteCategoryId,
    handleDeleteCategory,
  };
}

export type OwnerProductsPageActions = ReturnType<
  typeof useOwnerProductsPageActions
>;
