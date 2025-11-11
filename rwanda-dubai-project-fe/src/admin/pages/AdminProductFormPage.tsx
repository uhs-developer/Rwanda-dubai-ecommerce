import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "sonner";
import { useQuery, useMutation, gql } from 'urql';

// GraphQL queries and mutations
const GET_PRODUCT_FOR_EDIT = gql`
  query GetProductForEdit($id: ID!) {
    adminProduct(id: $id) {
      id
      name
      slug
      sku
      price
      originalPrice
      shortDescription
      description
      primaryImage
      category { id name }
      categories { id name }
      brand { id name }
      stockQuantity
      weight
      isActive
      isFeatured
    }
  }
`;

const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions {
    adminCategories(perPage: 100) {
      data { id name slug }
    }
    adminBrands { id name slug }
  }
`;

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      slug
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      slug
    }
  }
`;

interface ProductFormData {
  name: string;
  sku: string;
  slug: string;
  price: number | string;
  originalPrice?: number | string;
  costPrice?: number | string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  stockQuantity: number | string;
  weight?: number | string;
  isActive: boolean;
  isFeatured: boolean;
  primaryImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export default function AdminProductFormPage() {
  const { id } = useParams(); // Changed from slug to id
  const navigate = useNavigate();
  const isEdit = !!id; // Changed from slug to id
  const [loading, setLoading] = useState(false);
  const [skuEdited, setSkuEdited] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    slug: '',
    price: '',
    originalPrice: '',
    costPrice: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    brandId: '',
    stockQuantity: 0,
    weight: '',
    isActive: true,
    isFeatured: false,
    primaryImage: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  // Load filter options (categories and brands)
  const [filterOptionsResult, reexecFilter] = useQuery({ query: GET_FILTER_OPTIONS });
  const [ratesResult] = useQuery({ query: gql`query { adminExchangeRates { codeFrom codeTo rate } }` });

  // Load existing product if editing
  const [productResult] = useQuery({
    query: GET_PRODUCT_FOR_EDIT,
    variables: { id: id || '' }, // Changed from slug to id
    pause: !isEdit || !id, // Changed from slug to id
  });

  // Mutations
  const [, createProduct] = useMutation(CREATE_PRODUCT_MUTATION);
  const [, updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION);

  const categories = filterOptionsResult.data?.adminCategories?.data || [];
  const brands = filterOptionsResult.data?.adminBrands || [];

  // Populate form when editing
  useEffect(() => {
    if (productResult.error) {
      console.error('[AdminProductForm] Failed to load product:', productResult.error);
      toast.error('Failed to load product: ' + productResult.error.message);
    }
    
    if (isEdit && productResult.data?.adminProduct) {
      const p = productResult.data.adminProduct;
      setFormData({
        name: p.name || '',
        sku: p.sku || '',
        slug: p.slug || '',
        price: p.price != null ? String(p.price) : '',
        originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
        costPrice: '',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        categoryId: p.category?.id != null ? String(p.category.id) : '',
        brandId: p.brand?.id != null ? String(p.brand.id) : '',
        stockQuantity: p.stockQuantity != null ? String(p.stockQuantity) : '',
        weight: p.weight != null ? String(p.weight) : '',
        isActive: p.isActive ?? true,
        isFeatured: p.isFeatured || false,
        primaryImage: p.primaryImage || '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      });
      setSlugEdited(true);
    }
  }, [isEdit, productResult.data, productResult.error, id]);

  // Auto-generate SKU
  const generateSKU = () => {
    if (!formData.name) {
      toast.error('Please enter a product name first');
      return;
    }
    const nameSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20);
    const categoryPrefix = categories.find((c: any) => String(c.id) === formData.categoryId)?.slug?.toUpperCase().substring(0, 4) || 'PROD';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sku = `${categoryPrefix}-${nameSlug}-${randomSuffix}`.toUpperCase();
    setFormData(prev => ({ ...prev, sku }));
  };

  // Auto-generate slug from name while typing (unless manually edited)
  useEffect(() => {
    if (!formData.name) return;
    if (slugEdited) return;
    const auto = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug: auto }));
  }, [formData.name, slugEdited]);

  // Auto-generate SKU when creating and user hasn't manually edited it
  useEffect(() => {
    if (isEdit) return;
    if (skuEdited) return;
    if (!formData.name) return;
    // Generate only when category list is available
    const hasCategories = Array.isArray(categories) && categories.length > 0;
    if (!hasCategories) return;
    generateSKU();
  }, [formData.name, formData.categoryId, isEdit, skuEdited, categories]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku || !formData.slug || !formData.price) {
      // If SKU is missing in create mode, generate it on the fly
      if (!isEdit && !formData.sku && formData.name) {
        const nameSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20);
        const categoryPrefix = categories.find((c: any) => String(c.id) === formData.categoryId)?.slug?.toUpperCase().substring(0, 4) || 'PROD';
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const sku = `${categoryPrefix}-${nameSlug}-${randomSuffix}`.toUpperCase();
        setFormData(prev => ({ ...prev, sku }));
      } else {
        toast.error('Please fill in all required fields (Name, Slug, SKU, Price)');
        return;
      }
    }

    setLoading(true);
    try {
      const input = {
        name: formData.name,
        sku: formData.sku,
        slug: formData.slug,
        price: parseFloat(formData.price as string),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice as string) : undefined,
        shortDescription: formData.shortDescription || undefined,
        description: formData.description || undefined,
        categoryId: formData.categoryId || undefined,
        categoryIds: formData.categoryIds && formData.categoryIds.length ? formData.categoryIds : undefined,
        brandId: formData.brandId || undefined,
        stockQuantity: parseInt(formData.stockQuantity as string),
        weight: formData.weight ? parseFloat(formData.weight as string) : undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        primaryImage: formData.primaryImage || undefined,
      };

      if (isEdit) {
        const result = await updateProduct({ id: id, input });
        if (result.error) {
          console.error('[AdminProductForm] Update failed:', result.error);
          toast.error(result.error.message || 'Failed to update product');
        } else {
          toast.success('Product updated successfully');
          navigate('/admin/products');
        }
      } else {
        const result = await createProduct({ input });
        if (result.error) {
          console.error('[AdminProductForm] Create failed:', result.error);
          toast.error(result.error.message || 'Failed to create product');
        } else {
          toast.success('Product created successfully');
          navigate('/admin/products');
        }
      }
    } catch (e: any) {
      console.error('[AdminProductForm] Unexpected error:', e);
      toast.error(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isEdit ? `Edit Product: ${formData.name || 'Loading...'}` : 'Create Product'}</h2>
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          Back to Products
        </Button>
      </div>

      {productResult.fetching && isEdit && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading product data...</p>
        </div>
      )}

      {productResult.error && isEdit && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p className="font-semibold">Error loading product</p>
          <p className="text-sm mt-1">{productResult.error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => {
                        setSkuEdited(true);
                        setFormData(prev => ({ ...prev, sku: e.target.value }));
                      }}
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateSKU}>
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated from name + category</p>
                </div>
                <div>
                  <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setFormData(prev => ({ ...prev, slug: e.target.value }));
                    }}
                    required
                    placeholder="product-slug"
                  />
                  <p className="text-xs text-muted-foreground mt-1">URL-friendly identifier. Auto-fills from name.</p>
                </div>
                <div className="space-y-2">
                  <Label>Categories (multi)</Label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.categoryIds || []).map((cid) => {
                      const c = categories.find((x: any) => String(x.id) === cid);
                      return (
                        <span key={cid} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm">
                          {c?.name || cid}
                          <button
                            type="button"
                            className="ml-1 text-xs hover:text-red-600"
                            onClick={() =>
                              setFormData(prev => ({ ...prev, categoryIds: (prev.categoryIds || []).filter(id => id !== cid) }))
                            }
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <Input
                    placeholder="Type to add or create (Enter)"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const term = categoryInput.trim();
                        if (!term) return;
                        const existing = categories.find((c: any) => c.name.toLowerCase() === term.toLowerCase());
                        if (existing) {
                          setFormData(prev => ({
                            ...prev,
                            categoryIds: Array.from(new Set([...(prev.categoryIds || []), String(existing.id)])),
                          }));
                          setCategoryInput('');
                          return;
                        }
                        const result = await createCategoryMutation({ input: { name: term, isActive: true } });
                        if (result.error) {
                          toast.error(result.error.message || 'Failed to create category');
                          return;
                        }
                        const newCat = (result.data as any)?.createCategory;
                        if (newCat?.id) {
                          setFormData(prev => ({
                            ...prev,
                            categoryIds: Array.from(new Set([...(prev.categoryIds || []), String(newCat.id)])),
                          }));
                          setCategoryInput('');
                          reexecFilter({ requestPolicy: 'network-only' });
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Press Enter to add or create a category. Use × to remove.</p>
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD) <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (USD)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Regular price before discount</p>
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price (USD)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Your purchase cost</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryImage">Primary Image URL</Label>
                <Input
                  id="primaryImage"
                  value={formData.primaryImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryImage: e.target.value }))}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground mt-1">Enter image URL or upload files (upload feature coming soon)</p>
              </div>
              {formData.primaryImage && (
                <div className="border rounded-lg p-2">
                  <img src={formData.primaryImage} alt="Preview" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">Separate keywords with commas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="isActive">Status <span className="text-red-500">*</span></Label>
                <Select value={formData.isActive ? "1" : "0"} onValueChange={(val) => setFormData(prev => ({ ...prev, isActive: val === "1" }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked as boolean }))}
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">Featured Product</Label>
              </div>
              <p className="text-xs text-muted-foreground">Display this product in featured sections</p>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="brandId">Brand</Label>
                <Select value={formData.brandId || "none"} onValueChange={(val) => setFormData(prev => ({ ...prev, brandId: val === "none" ? "" : val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {brands.map((brand: any) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity <span className="text-red-500">*</span></Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button className="w-full" onClick={handleSubmit} disabled={loading || !formData.name || !formData.price}>
                {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Save Product')}
              </Button>
              <Button className="w-full" variant="outline" onClick={() => navigate('/admin/products')}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


