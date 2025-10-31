import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dropzone } from '@/components/ui/kibo-ui/dropzone';
import { useCreateProduct } from '@/hooks/use-create-product';
import { useUploadProductImages } from '@/hooks/use-products';
import { createProductSchema, type CreateProduct } from '@/types/product';

interface AddProductDialogProps {
  trigger?: React.ReactNode;
}

export function AddProductDialog({ trigger }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const createProduct = useCreateProduct();
  const uploadImages = useUploadProductImages();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { name: '', description: '', price: 0, sku: '' },
  });
  useEffect(() => {
    if (!open) {
      setSelectedFiles([]);
      setIsUploading(false);
      reset();
    }
  }, [open, reset]);

  const handleFilesDrop = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidType) toast.error(`${file.name}: formato não suportado. Use JPEG, PNG ou WEBP`);
      if (!isValidSize) toast.error(`${file.name}: arquivo muito grande (máx 5MB)`);
      return isValidType && isValidSize;
    });
    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const onSubmit = async (data: CreateProduct) => {
    try {
      const newProduct = await createProduct.mutateAsync(data);
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        await uploadImages.mutateAsync({ productId: newProduct.id, files: selectedFiles });
      }
      toast.success('Produto criado com sucesso!');
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar produto');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Adicionar Produto</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo produto
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Nome do produto"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descrição do produto"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register('sku')} placeholder="SKU-001" />
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Imagens do Produto (opcional)</Label>
              <Dropzone accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }} maxFiles={5} maxSize={5 * 1024 * 1024} onDrop={handleFilesDrop} disabled={selectedFiles.length >= 5} className="min-h-[100px]">
                <div className="flex flex-col items-center gap-2 text-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFiles.length === 0 ? 'Arraste imagens ou clique para selecionar' : `Adicionar mais imagens (${selectedFiles.length}/5)`}
                  </p>
                  <p className="text-xs text-muted-foreground">Máximo 5 imagens de até 5MB (JPEG, PNG, WEBP)</p>
                </div>
              </Dropzone>
            </div>
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover rounded border" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFile(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-muted-foreground truncate mt-1">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={createProduct.isPending || isUploading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createProduct.isPending || isUploading}>
              {isUploading ? 'Fazendo upload...' : createProduct.isPending ? 'Criando...' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
