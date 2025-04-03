import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';
import ReactCrop, { type Crop, type PixelCrop, type PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Product form schema for validation
const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  seasonal: z.boolean().default(false),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
});

// Define types
type ProductFormValues = z.infer<typeof productFormSchema>;
type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

// Image Cropper component
const ImageCropper = ({ 
  src, 
  onCropComplete 
}: { 
  src: string; 
  onCropComplete: (croppedImage: string) => void; 
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 75,
    height: 100,
    x: 12.5,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const aspect = 3/4;
  
  const onImageLoad = useCallback((img: HTMLImageElement) => {
    imageRef.current = img;
    
    // Default to 80% of the image width to show more content
    const cropWidth = 80;
    
    // Calculate initial crop with fixed aspect ratio (3:4)
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: cropWidth,
        },
        aspect,
        img.width,
        img.height
      ),
      img.width,
      img.height
    );
    
    setCrop(crop);
    
    // Set completed crop on initial load to ensure we have a valid crop value
    const pixelCrop: PixelCrop = {
      unit: 'px',
      x: Math.round((crop.x / 100) * img.width),
      y: Math.round((crop.y / 100) * img.height),
      width: Math.round((crop.width / 100) * img.width),
      height: Math.round((crop.height / 100) * img.height),
    };
    
    setCompletedCrop(pixelCrop);
  }, [aspect]);

  // Function to create a cropped image
  const getCroppedImg = useCallback(() => {
    if (!imageRef.current || !completedCrop) return null;
    
    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    
    // Set canvas size to the final crop size (with proper scaling)
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Set rendering quality
    ctx.imageSmoothingQuality = 'high';
    
    // Draw the cropped portion of the image to the canvas
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,  // source x
      completedCrop.y * scaleY,  // source y
      completedCrop.width * scaleX,  // source width
      completedCrop.height * scaleY,  // source height
      0,  // destination x
      0,  // destination y
      canvas.width,  // destination width
      canvas.height  // destination height
    );
    
    // Convert to base64 as JPG with high quality (0.95)
    return canvas.toDataURL('image/jpeg', 0.95);
  }, [completedCrop]);

  const handleCropComplete = useCallback(() => {
    const croppedImageUrl = getCroppedImg();
    if (croppedImageUrl) {
      onCropComplete(croppedImageUrl);
    }
  }, [getCroppedImg, onCropComplete]);
  
  return (
    <div className="space-y-4">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspect}
        minWidth={100}
        minHeight={100}
        className="max-h-[500px] mx-auto border rounded"
      >
        <img 
          src={src} 
          onLoad={(e) => onImageLoad(e.currentTarget)} 
          className="max-h-[500px] object-contain"
        />
      </ReactCrop>
      
      {completedCrop && (
        <div className="mt-4">
          <p className="text-sm mb-2 text-neutral-600">Preview:</p>
          <div className="aspect-[3/4] w-40 mx-auto overflow-hidden bg-gray-100 rounded border">
            <img
              src={src}
              alt="Crop preview"
              className="object-cover"
              style={{
                display: 'block',
                maxWidth: 'none',
                maxHeight: 'none',
                // Scale the image proportionally
                transform: `translate(${-completedCrop.x}px, ${-completedCrop.y}px) scale(${40 / completedCrop.width})`,
                transformOrigin: 'top left',
              }}
            />
          </div>
        </div>
      )}
      
      <Button 
        type="button" 
        onClick={handleCropComplete}
        className="w-full"
      >
        Apply Crop
      </Button>
    </div>
  );
};

// Product form component
const ProductForm = ({ 
  product, 
  onSubmit, 
  onCancel, 
  isLoading
}: { 
  product?: Product; 
  onSubmit: (data: ProductFormValues) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
    category: product?.category || 'signature',
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    seasonal: product?.seasonal || false,
    stock: product?.stock || 0,
  });
  
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set image preview if product has an image
    if (product?.imageUrl) {
      const imgUrl = getProductImageUrl(product);
      setImagePreview(imgUrl);
    }
  }, [product]);

  const handleChange = (field: keyof ProductFormValues, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = productFormSchema.parse(formValues);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ProductFormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ProductFormValues] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size should be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    setIsCropperOpen(false);
    setImagePreview(croppedImage);
    setIsUploading(true);
    
    try {
      // Convert base64 to file
      const res = await fetch(croppedImage);
      const blob = await res.blob();
      const file = new File([blob], `product_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      // Update form values with the uploaded image URL
      handleChange('imageUrl', data.imageUrl);
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const categories = [
    { value: 'signature', label: 'Signature' },
    { value: 'flavored', label: 'Flavored' },
    { value: 'sakura', label: 'Sakura' },
    { value: 'spreads', label: 'Spreads' },
    { value: 'seasonal', label: 'Seasonal' },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Name</label>
            <Input
              value={formValues.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Product name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Slug</label>
            <Input
              value={formValues.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="product-slug"
              className={errors.slug ? 'border-red-500' : ''}
            />
            {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <Textarea
            value={formValues.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Product description"
            className={errors.description ? 'border-red-500' : ''}
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Price (IDR)</label>
            <Input
              type="number"
              value={formValues.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="42000"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Stock</label>
            <Input
              type="number"
              value={formValues.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              placeholder="10"
              className={errors.stock ? 'border-red-500' : ''}
            />
            {errors.stock && <p className="text-red-500 text-xs">{errors.stock}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Image</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <div className="flex flex-col">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <Input
                  value={formValues.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="Or enter image URL manually"
                  className={errors.imageUrl ? 'border-red-500' : ''}
                  disabled={isUploading}
                />
                {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl}</p>}
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-2 flex items-center justify-center h-40">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="max-h-[150px] max-w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error(`Failed to load image: ${target.src}`);
                    target.onerror = null; // Prevent infinite loops
                    
                    // Try attached_assets as fallback first
                    if (!target.src.includes('/attached_assets/') && !target.src.includes('/assets/General')) {
                      const filename = product?.imageUrl?.split('/')?.pop() || '';
                      target.src = `/attached_assets/${filename}`;
                    } else {
                      // Final fallback to a placeholder
                      target.src = '/assets/General Photo1.jpg';
                    }
                  }}
                />
              ) : (
                <div className="text-gray-400 text-sm text-center p-6">
                  No image preview available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Category</label>
          <Select 
            value={formValues.category} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formValues.featured}
              onCheckedChange={(checked) => handleChange('featured', checked)}
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bestSeller"
              checked={formValues.bestSeller}
              onCheckedChange={(checked) => handleChange('bestSeller', checked)}
            />
            <label htmlFor="bestSeller" className="text-sm font-medium">
              Best Seller
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seasonal"
              checked={formValues.seasonal}
              onCheckedChange={(checked) => handleChange('seasonal', checked)}
            />
            <label htmlFor="seasonal" className="text-sm font-medium">
              Seasonal
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || isUploading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>

      {/* Image Cropper Dialog */}
      <Dialog open={isCropperOpen} onOpenChange={(open) => !isUploading && setIsCropperOpen(open)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Adjust the crop area to fit the product card (3:4 aspect ratio)
            </DialogDescription>
          </DialogHeader>
          {uploadedImage && (
            <ImageCropper 
              src={uploadedImage} 
              onCropComplete={handleCropComplete} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper function to get image URL regardless of field name
const getProductImageUrl = (product: Product) => {
  // Handle both camelCase and snake_case field names
  // @ts-ignore - TypeScript might not know about image_url field
  const imageSource = product.imageUrl || product.image_url;
  
  if (!imageSource) return '/assets/General Photo1.jpg';
  
  // Handle base64 images from cropper
  if (imageSource.startsWith('data:image')) {
    return imageSource;
  } else if (imageSource.startsWith('/')) {
    return imageSource;
  } else if (imageSource.startsWith('http')) {
    return imageSource;
  } else {
    // Check if this is an uploaded file (from our API) or a reference to assets folder
    return `/attached_assets/${imageSource}`;
  }
};

// Main admin page component
const AdminPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const queryClient = useQueryClient();

  // Fetch all products
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products'],
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (productData: ProductFormValues) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, productData }: { id: number; productData: ProductFormValues }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setEditingProduct(null);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreateProduct = (data: ProductFormValues) => {
    createMutation.mutate(data);
  };

  const handleUpdateProduct = (data: ProductFormValues) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, productData: data });
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add New Product
        </Button>
      </div>

      {error ? (
        <div className="bg-red-100 p-4 rounded text-red-700 mb-4">
          Failed to load products. Please try again.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        <img
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.error(`Failed to load image: ${target.src}`);
                            target.onerror = null; // Prevent infinite loops
                            
                            // Try attached_assets as fallback first
                            if (!target.src.includes('/attached_assets/') && !target.src.includes('/assets/General')) {
                              const filename = product.imageUrl?.split('/')?.pop() || '';
                              target.src = `/attached_assets/${filename}`;
                            } else {
                              // Final fallback to a placeholder
                              target.src = '/assets/General Photo1.jpg';
                            }
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {product.featured && (
                        <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                      {product.bestSeller && (
                        <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Best Seller
                        </span>
                      )}
                      {product.seasonal && (
                        <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          Seasonal
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setProductToDelete(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details for the new product.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage; 