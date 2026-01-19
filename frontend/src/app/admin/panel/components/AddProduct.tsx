"use client"

import { Check, DollarSign, ImageIcon, Plus, Tag, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";

type ProductInput = {
  name: string;
  sku?: string;
  slug?: string;
  categories: string[];
  price: string;
  compareAtPrice?: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description?: string;
};

export default function AddProduct(): JSX.Element {
  const router = useRouter();

  const [form, setForm] = useState<ProductInput>({
    name: '',
    sku: '',
    slug: '',
    categories: [],
    price: '',
    compareAtPrice: '',
    stock: 0,
    status: 'In Stock',
    description: '',
  });

  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const primaryRef = useRef<HTMLInputElement | null>(null);
  const secondaryRef = useRef<HTMLInputElement | null>(null);
  const catInputRef = useRef<HTMLInputElement | null>(null);

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

  // slug auto-generate
  useEffect(() => {
    if (!form.slug) {
      setForm((s) => ({ ...s, slug: slugify(s.name) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name]);

  function slugify(str = '') {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\d]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function handleField<K extends keyof ProductInput>(
    key: K,
    value: ProductInput[K] | string,
  ) {
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

  function onPrimaryFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setPrimaryImage(files[0]);
  }

  function onSecondaryFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 12); // safety cap
    setSecondaryImages(arr);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError('Product name is required.');
    if (!form.price.trim()) return setError('Price is required.');
    if (!primaryImage) return setError('Primary image is required.');
    if (secondaryImages.length < 3)
      return setError('Please upload at least 3 secondary images.');

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      if (form.sku) fd.append('sku', form.sku);
      if (form.slug) fd.append('slug', form.slug);
      fd.append('categories', JSON.stringify(form.categories));
      fd.append('price', form.price);
      if (form.compareAtPrice) fd.append('compareAtPrice', form.compareAtPrice);
      fd.append('stock', String(form.stock));
      fd.append('status', form.status);
      if (form.description) fd.append('description', form.description);

      fd.append('primaryImage', primaryImage);
      secondaryImages.forEach((f) => fd.append('secondaryImages', f));

      // TODO: POST to backend admin endpoint
      await new Promise((r) => setTimeout(r, 800));
      router.push('/admin/panel');
    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Add Product</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill product details and upload images
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            type="button"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Saving…
              </>
            ) : (
              <>
                <Check size={14} /> Create Product
              </>
            )}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {error && (
          <div className="lg:col-span-3 text-sm text-red-700 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Left / Main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Product name
              </label>
              <input
                value={form.name}
                onChange={(e) => handleField('name', e.target.value)}
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
                value={form.sku || ''}
                onChange={(e) => handleField('sku', e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                placeholder="SKU-001 (optional)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Slug
              </label>
              <input
                value={form.slug || ''}
                onChange={(e) => handleField('slug', e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                placeholder="minimal-ceramic-vase"
              />
              <p className="text-xs text-gray-400 mt-1">
                Auto-generated from name (editable)
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Categories
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {form.categories.map((c, i) => (
                  <span
                    key={c + i}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    <Tag size={14} />{' '}
                    <span className="truncate max-w-[120px]">{c}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(i)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                <input
                  ref={catInputRef}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addCategory((e.target as HTMLInputElement).value);
                    } else if (
                      e.key === 'Backspace' &&
                      (e.target as HTMLInputElement).value === ''
                    ) {
                      // remove last tag
                      setForm((s) => ({
                        ...s,
                        categories: s.categories.slice(0, -1),
                      }));
                    }
                  }}
                  className="min-w-[160px] grow border border-transparent focus:border-transparent text-sm px-2 py-1 rounded-md outline-none"
                  placeholder="Type and press Enter"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Separate categories by Enter or comma
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={form.description || ''}
              onChange={(e) =>
                handleField('description', e.target.value as any)
              }
              rows={6}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 resize-y"
              placeholder="Short product description for listings"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Price
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
              <label className="block text-xs font-medium text-gray-600">
                Compare at price
              </label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign size={14} />
                </span>
                <input
                  value={form.compareAtPrice || ''}
                  onChange={(e) =>
                    handleField('compareAtPrice', e.target.value as any)
                  }
                  className="pl-9 mt-0 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="249.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Stock
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  handleField('stock', Number(e.target.value) as any)
                }
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
                min={0}
              />
            </div>
          </div>
        </div>

        {/* Right / Images & Settings */}
        <aside className="space-y-4">
          <div className="p-4 rounded-lg border border-dashed border-gray-100">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <ImageIcon /> Primary image
              </span>
              <span className="text-xs text-gray-400">required</span>
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
                ) : (
                  <div className="text-center text-sm text-gray-400">
                    <Plus className="mx-auto mb-2" />
                    Click to upload or drop image
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-dashed border-gray-100">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <ImageIcon /> Secondary images
              </span>
              <span className="text-xs text-gray-400">
                {secondaryImages.length} / 12
              </span>
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
                <div className="text-sm text-gray-400">
                  Min 3 images — JPG/PNG
                </div>
              </div>

              {secondaryPreviews.length > 0 ? (
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
                          setSecondaryImages((s) =>
                            s.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 grid place-items-center text-xs"
                        aria-label="remove-image"
                      >
                        <X size={12} />
                      </button>
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
              value={form.status}
              onChange={(e) => handleField('status', e.target.value as any)}
              className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 bg-white"
            >
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
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

