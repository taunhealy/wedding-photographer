"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
  value: string;
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log("Starting upload for file:", file.name);

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Send directly to our API route
      const response = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Upload failed: ${errorData.error || response.statusText}`
        );
      }

      const { fileUrl } = await response.json();
      console.log("Upload successful, setting URL:", fileUrl);

      onChange(fileUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ display: "none" }}
        disabled={disabled || isUploading}
      />
      {value ? (
        <div className="relative h-[200px] w-full rounded-md overflow-hidden">
          <div className="absolute z-10 top-2 right-2">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              disabled={disabled}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <Image fill className="object-cover" alt="Upload" src={value} />
        </div>
      ) : (
        <Button
          type="button"
          disabled={disabled || isUploading}
          variant="secondary"
          onClick={handleButtonClick}
          className="w-full h-[200px] border-dashed border-2 border-gray-300 hover:cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 mr-2 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-6 w-6 mr-2" />
              <span>Upload an Image</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
