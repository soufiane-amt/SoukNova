'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Check, Plus, Tag, X, DollarSign, Ruler, ImageIcon, Trash2 } from 'lucide-react';
import { ProductType } from '../../../../types/product.dt';

// Categories (reuse from AddProduct)
const CATEGORY_OPTIONS = [
  {
    name: 'Home & Kitchen',
    subcategories: [
      'Furniture', 'Living Room Furniture', 'Bean Bags, Covers & Refills', 'Bean Bags',
      'Kitchen & Dining', 'Bedding', 'Bath', 'Home Décor', 'Storage & Organization',
      'Lighting & Ceiling Fans', 'Heating, Cooling & Air Quality', 'Irons & Steamers', 'Vacuums & Floor Care',
    ],
  },
  {
    name: 'Electronics',
    subcategories: [
      'Computers & Accessories', 'Computer Components', 'External Components', 'Computer Memory',
      'Cell Phones & Accessories', 'Accessories', 'Headphones, Earbuds & Accessories', 'Headphones',
      'Camera & Photo', 'Video Game Consoles & Accessories', 'Wearable Technology',
      'Portable Audio & Video', 'Television & Video', 'Car Electronics',
    ],
  },
  // ... (add the rest of your categories here as in AddProduct)
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface EditProductProps {
  selectedProductId: string | null;
}
export default function EditProduct({ selectedProductId }: EditProductProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState<'In Stock' | 'Low Stock' | 'Out of Stock'>('In Stock');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState<{ length: string; width: string; height: string; unit: 'in' | 'cm' | 'mm' }>({ length: '', width: '', height: '', unit: 'in' });

  // Images
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);
  const [existingPrimaryImage, setExistingPrimaryImage] = useState<string | null>(null);
  const [existingSecondaryImages, setExistingSecondaryImages] = useState<string[]>([]);

  // Category dropdown
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const catInputRef = useRef<HTMLInputElement | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/products/${selectedProductId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        const p: ProductType = data.data;
        setTitle(p.title || '');
        setSku(p.item_model_number || '');
        setCategories(p.categories || []);
        setPrice(p.price?.toString() || '');
        setDiscount(p.discount);
        setStatus((p.availability as any) || 'In Stock');
        setDescription(p.description || '');
        setDimensions({
          length: p.packageDimensions?.split(' x ')[0] || '',
          width: p.packageDimensions?.split(' x ')[1] || '',
          height: p.packageDimensions?.split(' x ')[2]?.split(' ')[0] || '',
          unit: (p.packageDimensions?.split(' ')?.[3] as any) || 'in',
        });
        setExistingPrimaryImage(p.primaryImage || p.primary_image || null);
        setExistingSecondaryImages(p.images || []);
      } catch (err: any) {
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    }
    if (selectedProductId) fetchProduct();
  }, [selectedProductId]);

  // Image previews
  useEffect(() => {
    if (!primaryImage) {
      setPrimaryPreview(null);
      return;
    }
    const url = URL.createObjectURL(primaryImage);
    setPrimaryPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [primaryImage]);

  useEffect(() => {
    const urls = secondaryImages.map((f) => URL.createObjectURL(f));
    setSecondaryPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [secondaryImages]);

  // Category dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleDimension(key: 'length' | 'width' | 'height' | 'unit', value: string) {
    setDimensions((s) => ({ ...s, [key]: value }));
  }

  function addCategory(tag: string) {
    const t = tag.trim();
    if (!t) return;
    setCategories((s) => Array.from(new Set([...s, t])));
    if (catInputRef.current) catInputRef.current.value = '';
  }

  function removeCategory(index: number) {
    setCategories((s) => s.filter((_, i) => i !== index));
  }

  function toggleCategoryFromDropdown(category: string) {
    setCategories((s) =>
      s.includes(category) ? s.filter((c) => c !== category) : [...s, category]
    );
  }

  function onPrimaryFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setPrimaryImage(files[0]);
    setExistingPrimaryImage(null);
  }

  function onSecondaryFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 12);
    setSecondaryImages((prev) => [...prev, ...arr].slice(0, 12));
    setExistingSecondaryImages([]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.append('name', title);
      if (sku) fd.append('sku', sku);
      fd.append('categories', JSON.stringify(categories));
      fd.append('price', price);
      if (discount) fd.append('discount', discount);
      fd.append('status', status);
      if (description) fd.append('description', description);
      if (dimensions) fd.append('dimensions', JSON.stringify(dimensions));
      if (primaryImage) fd.append('images', primaryImage);
      secondaryImages.forEach((f) => fd.append('images', f));
      // Optionally, send info about keeping existing images if not replaced

      const res = await fetch(`${API_BASE_URL}/api/admin/products/${selectedProductId}`, {
        method: 'PATCH',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess('Product updated!');
      setTimeout(() => router.push('/admin/panel?tab=products'), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  }

  const currentSubcategories =
    CATEGORY_OPTIONS.find((c) => c.name === selectedMainCategory)?.subcategories || [];

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin mr-2" /> Loading product...
      </div>
    );

  if (error)
    return (
      <div className="max-w-xl mx-auto mt-16 text-center text-red-600">
        {error}
        <button
          className="block mx-auto mt-4 px-4 py-2 bg-black text-white rounded"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} className="inline mr-2" />
          Back
        </button>
      </div>
    );

  return (
    <div className="p-2 lg:p-5 max-w-6xl mx-auto">
      <button
        className="mb-6 flex items-center text-gray-500 hover:text-black"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Products
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update product details and images
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            type="button"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check size={14} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
          <Check size={16} />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left / Main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Product name
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                placeholder="Minimal Ceramic Vase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                SKU
              </label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                placeholder="SKU-001 (optional)"
              />
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((c, i) => (
                <span
                  key={c + i}
                  className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-full text-sm"
                >
                  <Tag size={12} />
                  <span className="truncate max-w-[150px]">{c}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(i)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-500">
                  {categories.length > 0
                    ? `${categories.length} categories selected`
                    : 'Select categories...'}
                </span>
                <Plus size={16} className={`text-gray-400 transition-transform ${categoryDropdownOpen ? 'rotate-45' : ''}`} />
              </button>
              {categoryDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-gray-100">
                    {/* Main Categories */}
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Main Categories
                        </span>
                      </div>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <div
                          key={cat.name}
                          onClick={() => setSelectedMainCategory(cat.name)}
                          className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
                            selectedMainCategory === cat.name
                              ? 'bg-gray-100 font-medium'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={categories.includes(cat.name)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleCategoryFromDropdown(cat.name);
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm">{cat.name}</span>
                          </div>
                          <Plus size={14} className="text-gray-400 -rotate-45" />
                        </div>
                      ))}
                    </div>
                    {/* Subcategories */}
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {selectedMainCategory || 'Select a category'}
                        </span>
                      </div>
                      {currentSubcategories.length > 0 ? (
                        currentSubcategories.map((sub) => (
                          <div
                            key={sub}
                            onClick={() => toggleCategoryFromDropdown(sub)}
                            className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
                              categories.includes(sub)
                                ? 'bg-gray-100'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={categories.includes(sub)}
                              onChange={() => toggleCategoryFromDropdown(sub)}
                              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm">{sub}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-8 text-center text-sm text-gray-400">
                          Select a main category to see subcategories
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Custom Category Input */}
                  <div className="border-t border-gray-100 p-3">
                    <div className="flex gap-2">
                      <input
                        ref={catInputRef}
                        placeholder="Add custom category..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCategory((e.target as HTMLInputElement).value);
                          }
                        }}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (catInputRef.current) {
                            addCategory(catInputRef.current.value);
                          }
                        }}
                        className="px-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 resize-y"
              placeholder="Short product description for listings"
            />
          </div>

          <div className="flex justify-content gap-4 w-full">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Price
              </label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign size={14} />
                </span>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-9 mt-0 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="199.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Discount percentage
              </label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
                <input
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="pl-9 mt-0 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              <span className="flex items-center gap-2">
                <Ruler size={14} /> Package Dimensions
              </span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Length</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={dimensions.length}
                  onChange={(e) => handleDimension('length', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Width</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={dimensions.width}
                  onChange={(e) => handleDimension('width', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={dimensions.height}
                  onChange={(e) => handleDimension('height', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Unit</label>
                <select
                  value={dimensions.unit}
                  onChange={(e) => handleDimension('unit', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 bg-white"
                >
                  <option value="in">inches</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Optional — used for shipping calculations
            </p>
          </div>
        </div>

        {/* Right / Images & Settings */}
        <aside className="space-y-4">
          <div className="p-4 rounded-lg border border-dashed border-gray-200">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <ImageIcon size={16} /> Primary image
              </span>
              <span className="text-xs text-gray-400">required</span>
            </label>
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="primary-image-input"
                onChange={(e) => onPrimaryFiles(e.target.files)}
              />
              <div
                onClick={() => document.getElementById('primary-image-input')?.click()}
                className="h-40 w-full border border-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                role="button"
                aria-label="Select primary image"
              >
                {primaryPreview ? (
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <img
                      src={primaryPreview}
                      alt="primary preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setPrimaryImage(null);
                      }}
                      className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8 grid place-items-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : existingPrimaryImage ? (
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <img
                      src={
                        existingPrimaryImage.startsWith('http')
                          ? existingPrimaryImage
                          : `${API_BASE_URL}${existingPrimaryImage}`
                      }
                      alt="primary preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-400">
                    <Plus className="mx-auto mb-2" />
                    Click to upload or drop image
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-dashed border-gray-200">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <ImageIcon size={16} /> Secondary images
              </span>
              <span className="text-xs text-gray-400">
                {secondaryImages.length + existingSecondaryImages.length} / 12
              </span>
            </label>
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="secondary-image-input"
                onChange={(e) => onSecondaryFiles(e.target.files)}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('secondary-image-input')?.click()}
                  className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  <Plus size={14} /> Upload
                </button>
                <div className="text-sm text-gray-400">
                  Min 3 images — JPG/PNG
                </div>
              </div>
              {(secondaryPreviews.length > 0 || existingSecondaryImages.length > 0) ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {secondaryPreviews.map((src, i) => (
                    <div
                      key={i}
                      className="relative rounded-md overflow-hidden border border-gray-100"
                    >
                      <img
                        src={src}
                        alt={`secondary-${i}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSecondaryImages((s) => s.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 grid place-items-center text-xs"
                        aria-label="remove-image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {existingSecondaryImages.map((img, i) => (
                    <div
                      key={img + i}
                      className="relative rounded-md overflow-hidden border border-gray-100"
                    >
                      <img
                        src={
                          img.startsWith('http')
                            ? img
                            : `${API_BASE_URL}${img}`
                        }
                        alt={`secondary-existing-${i}`}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-400">
                  No secondary images added.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-gray-100">
            <label className="block text-xs font-medium text-gray-600">
              Visibility
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 bg-white"
            >
              <option value="In Stock">In Stock</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              Control how the product appears on the storefront
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}