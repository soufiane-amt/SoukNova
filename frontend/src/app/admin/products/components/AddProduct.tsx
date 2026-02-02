"use client"

import { Check, ChevronDown, DollarSign, ImageIcon, Plus, Ruler, Tag, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";

// Categories extracted from products_full.json
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
  {
    name: 'Clothing, Shoes & Jewelry',
    subcategories: [
      'Women', 'Men', 'Girls', 'Boys', 'Luggage & Travel Gear', 'Handbags & Wallets',
      'Accessories', 'Jewelry', 'Watches', 'Shoe, Jewelry & Watch Accessories',
    ],
  },
  {
    name: 'Sports & Outdoors',
    subcategories: [
      'Sports & Fitness', 'Outdoor Recreation', 'Fan Shop', 'Exercise & Fitness',
      'Cycling', 'Hunting & Fishing', 'Team Sports', 'Golf', 'Leisure Sports & Game Room', 'Swimming',
    ],
  },
  {
    name: 'Beauty & Personal Care',
    subcategories: [
      'Makeup', 'Skin Care', 'Hair Care', 'Fragrance', 'Foot, Hand & Nail Care',
      'Tools & Accessories', 'Shave & Hair Removal', 'Personal Care', 'Oral Care',
    ],
  },
  {
    name: 'Health & Household',
    subcategories: [
      'Health Care', 'Household Supplies', 'Vitamins & Dietary Supplements',
      'Baby & Child Care', 'Medical Supplies & Equipment', 'Sports Nutrition', 'Wellness & Relaxation',
    ],
  },
  {
    name: 'Toys & Games',
    subcategories: [
      'Action Figures & Statues', 'Arts & Crafts', 'Baby & Toddler Toys', 'Building Toys',
      'Dolls & Accessories', 'Dress Up & Pretend Play', 'Games', 'Kids Electronics',
      'Learning & Education', 'Stuffed Animals & Plush Toys', 'Puzzles', 'Sports & Outdoor Play',
      'Tricycles, Scooters & Wagons', 'Vehicles',
    ],
  },
  {
    name: 'Automotive',
    subcategories: [
      'Car Care', 'Car Electronics & Accessories', 'Exterior Accessories', 'Interior Accessories',
      'Lights & Lighting Accessories', 'Motorcycle & Powersports', 'Oils & Fluids',
      'Paint & Paint Supplies', 'Parts', 'Performance Parts & Accessories', 'Replacement Parts',
      'RV Parts & Accessories', 'Tires & Wheels', 'Tools & Equipment',
    ],
  },
  {
    name: 'Pet Supplies',
    subcategories: ['Dogs', 'Cats', 'Fish & Aquatic Pets', 'Birds', 'Small Animals', 'Reptiles & Amphibians', 'Horses'],
  },
  {
    name: 'Garden & Outdoor',
    subcategories: [
      'Gardening & Lawn Care', 'Outdoor Décor', 'Outdoor Furniture', 'Outdoor Lighting',
      'Outdoor Power Tools', 'Patio, Lawn & Garden', 'Pools, Hot Tubs & Supplies', 'Storage & Housing',
    ],
  },
  {
    name: 'Tools & Home Improvement',
    subcategories: [
      'Appliances', 'Building Supplies', 'Electrical', 'Hardware', 'Kitchen & Bath Fixtures',
      'Light Bulbs', 'Lighting & Ceiling Fans', 'Measuring & Layout Tools',
      'Painting Supplies & Wall Treatments', 'Power & Hand Tools', 'Rough Plumbing',
      'Safety & Security', 'Storage & Home Organization', 'Welding & Soldering',
    ],
  },
  {
    name: 'Office Products',
    subcategories: [
      'Office & School Supplies', 'Office Electronics', 'Office Furniture & Lighting',
      'Desk Accessories & Workspace Organizers', 'Calendars, Planners & Personal Organizers',
      'Writing & Correction Supplies',
    ],
  },
  {
    name: 'Musical Instruments',
    subcategories: [
      'Guitars & Gear', 'Recording Equipment', 'Microphones & Accessories', 'Keyboards & MIDI',
      'Drums & Percussion', 'Band & Orchestra', 'DJ & VJ Equipment', 'Live Sound & Stage', 'Instrument Accessories',
    ],
  },
  {
    name: 'Baby',
    subcategories: [
      'Activity & Entertainment', 'Apparel & Accessories', 'Baby & Toddler Toys', 'Baby Care',
      'Baby Stationery', 'Car Seats & Accessories', 'Diapering', 'Feeding', 'Gifts', 'Nursery',
      'Potty Training', 'Pregnancy & Maternity', 'Safety', 'Strollers & Accessories', 'Travel Gear',
    ],
  },
  {
    name: 'Grocery & Gourmet Food',
    subcategories: [
      'Beverages', 'Breads & Bakery', 'Breakfast Foods', 'Candy & Chocolate',
      'Canned, Jarred & Packaged Foods', 'Condiments & Salad Dressings', 'Cooking & Baking',
      'Dairy, Cheese & Eggs', 'Fresh Flowers & Live Indoor Plants', 'Meat & Seafood',
      'Pantry Staples', 'Produce', 'Snack Foods',
    ],
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ProductInput = {
  name: string;
  sku?: string;
  categories: string[];
  price: string;
  compareAtPrice?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
    unit: 'in' | 'cm' | 'mm';
  };
};

export default function AddProduct(): JSX.Element {
  const router = useRouter();

  const [form, setForm] = useState<ProductInput>({
    name: '',
    sku: '',
    categories: [],
    price: '',
    compareAtPrice: '',
    status: 'In Stock',
    description: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'in',
    },
  });

  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Category selection state
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const primaryRef = useRef<HTMLInputElement | null>(null);
  const secondaryRef = useRef<HTMLInputElement | null>(null);
  const catInputRef = useRef<HTMLInputElement | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // previews
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

  function handleField<K extends keyof ProductInput>(key: K, value: ProductInput[K] | string) {
    if (key === 'categories' && typeof value === 'string') {
      setForm((s) => ({
        ...s,
        categories: (value as string)
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
      }));
      return;
    }
    setForm((s) => ({ ...s, [key]: value }));
  }

  function handleDimension(key: 'length' | 'width' | 'height' | 'unit', value: string) {
    setForm((s) => ({
      ...s,
      dimensions: {
        ...s.dimensions!,
        [key]: value,
      },
    }));
  }

  function addCategory(tag: string) {
    const t = tag.trim();
    if (!t) return;
    setForm((s) => ({
      ...s,
      categories: Array.from(new Set([...s.categories, t])),
    }));
    if (catInputRef.current) catInputRef.current.value = '';
  }

  function removeCategory(index: number) {
    setForm((s) => ({
      ...s,
      categories: s.categories.filter((_, i) => i !== index),
    }));
  }

  function toggleCategoryFromDropdown(category: string) {
    setForm((s) => {
      if (s.categories.includes(category)) {
        return { ...s, categories: s.categories.filter((c) => c !== category) };
      }
      return { ...s, categories: [...s.categories, category] };
    });
  }

  function onPrimaryFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setPrimaryImage(files[0]);
  }

  function onSecondaryFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 12);
    setSecondaryImages((prev) => [...prev, ...arr].slice(0, 12));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!form.name.trim()) return setError('Product name is required.');
    if (!form.price.trim()) return setError('Price is required.');
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      return setError('Price must be a valid positive number.');
    }
    if (!primaryImage) return setError('Primary image is required.');
    if (secondaryImages.length < 3) {
      return setError('Please upload at least 3 secondary images.');
    }
    if (form.categories.length === 0) {
      return setError('Please select at least one category.');
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      if (form.sku) fd.append('sku', form.sku);
      fd.append('categories', JSON.stringify(form.categories));
      fd.append('price', form.price);
      if (form.compareAtPrice) fd.append('compareAtPrice', form.compareAtPrice);
      fd.append('status', form.status);
      if (form.description) fd.append('description', form.description);
      if (form.dimensions) fd.append('dimensions', JSON.stringify(form.dimensions));

      // Append images - primary first, then secondary
      fd.append('images', primaryImage);
      secondaryImages.forEach((f) => fd.append('images', f));

      const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      setSuccess('Product created successfully!');
      
      // Reset form after success
      setTimeout(() => {
        router.push('/admin/panel?tab=products');
      }, 1500);

    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm({
      name: '',
      sku: '',
      categories: [],
      price: '',
      compareAtPrice: '',
      status: 'In Stock',
      description: '',
      dimensions: { length: '', width: '', height: '', unit: 'in' },
    });
    setPrimaryImage(null);
    setSecondaryImages([]);
    setError(null);
    setSuccess(null);
  }

  const currentSubcategories =
    CATEGORY_OPTIONS.find((c) => c.name === selectedMainCategory)?.subcategories || [];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Add Product</h1>
          <p className="text-sm text-gray-500 mt-1">Fill product details and upload images</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Check size={14} /> Create Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
          <Check size={16} />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left / Main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Product name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => handleField('name', e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:border-black"
                placeholder="Minimal Ceramic Vase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">SKU</label>
              <input
                value={form.sku || ''}
                onChange={(e) => handleField('sku', e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:border-black"
                placeholder="SKU-001 (optional)"
              />
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Categories <span className="text-red-500">*</span>
            </label>

            {/* Selected Categories */}
            <div className="flex flex-wrap gap-2 mb-3">
              {form.categories.map((c, i) => (
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

            {/* Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-500">
                  {form.categories.length > 0
                    ? `${form.categories.length} categories selected`
                    : 'Select categories...'}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-gray-100">
                    {/* Main Categories */}
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Main Categories
                        </span>
                      </div>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <div
                          key={cat.name}
                          onClick={() => setSelectedMainCategory(cat.name)}
                          className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
                            selectedMainCategory === cat.name ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={form.categories.includes(cat.name)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleCategoryFromDropdown(cat.name);
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm">{cat.name}</span>
                          </div>
                          <ChevronDown size={14} className="text-gray-400 -rotate-90" />
                        </div>
                      ))}
                    </div>

                    {/* Subcategories */}
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
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
                              form.categories.includes(sub) ? 'bg-gray-100' : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={form.categories.includes(sub)}
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
            <label className="block text-xs font-medium text-gray-600">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => handleField('description', e.target.value as any)}
              rows={5}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 resize-y"
              placeholder="Short product description for listings"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign size={14} />
                </span>
                <input
                  value={form.price}
                  onChange={(e) => handleField('price', e.target.value)}
                  className="pl-9 mt-0 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="199.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">Compare at price</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign size={14} />
                </span>
                <input
                  value={form.compareAtPrice || ''}
                  onChange={(e) => handleField('compareAtPrice', e.target.value as any)}
                  className="pl-9 mt-0 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="249.00"
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
                  value={form.dimensions?.length || ''}
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
                  value={form.dimensions?.width || ''}
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
                  value={form.dimensions?.height || ''}
                  onChange={(e) => handleDimension('height', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Unit</label>
                <select
                  value={form.dimensions?.unit || 'in'}
                  onChange={(e) => handleDimension('unit', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 bg-white"
                >
                  <option value="in">inches</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Optional — used for shipping calculations</p>
          </div>
        </div>

        {/* Right / Images & Settings */}
        <aside className="space-y-4">
          <div className="p-4 rounded-lg border border-dashed border-gray-200">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <ImageIcon size={16} /> Primary image
              </span>
              <span className="text-xs text-red-500">required</span>
            </label>

            <div className="mt-3">
              <input
                ref={primaryRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPrimaryFiles(e.target.files)}
              />
              <div
                onClick={() => primaryRef.current?.click()}
                className="h-40 w-full border border-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                role="button"
                aria-label="Select primary image"
              >
                {primaryPreview ? (
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <img src={primaryPreview} alt="primary preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setPrimaryImage(null);
                      }}
                      className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8 grid place-items-center hover:bg-gray-800"
                    >
                      <Trash2 size={14} />
                    </button>
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
              <span className="text-xs text-gray-400">{secondaryImages.length} / 12</span>
            </label>

            <div className="mt-3">
              <input
                ref={secondaryRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onSecondaryFiles(e.target.files)}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => secondaryRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  <Plus size={14} /> Upload
                </button>
                <div className="text-sm text-gray-400">Min 3 images — JPG/PNG</div>
              </div>

              {secondaryPreviews.length > 0 ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {secondaryPreviews.map((src, i) => (
                    <div key={i} className="relative rounded-md overflow-hidden border border-gray-100">
                      <img src={src} alt={`secondary-${i}`} className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => setSecondaryImages((s) => s.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 grid place-items-center text-xs hover:bg-gray-800"
                        aria-label="remove-image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-400">No secondary images added.</div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-gray-100">
            <label className="block text-xs font-medium text-gray-600">Visibility</label>
            <select
              value={form.status}
              onChange={(e) => handleField('status', e.target.value as any)}
              className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 bg-white"
            >
              <option value="In Stock">In Stock</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">Control how the product appears on the storefront</p>
          </div>
        </aside>
      </form>
    </div>
  );
}