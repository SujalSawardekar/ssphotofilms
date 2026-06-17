"use client";

import React from 'react';
import Image from 'next/image';
import { useCms } from '@/lib/CmsContext';
import { Camera } from 'lucide-react';

interface EditableImageProps {
  cmsKey?: string;
  defaultVal?: string;
  src?: string;
  onChange?: (url: string) => void;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  cmsKey,
  defaultVal = "",
  src: overrideSrc,
  onChange,
  alt,
  fill = false,
  className = "",
  width,
  height,
  sizes,
  priority = false,
  quality = 75
}) => {
  const { editMode, isPreview, contents, updateContentKey, openMediaSelector } = useCms();
  
  // Decide what image source path to use
  let activeSrc = overrideSrc;
  if (cmsKey) {
    activeSrc = contents[cmsKey] !== undefined ? contents[cmsKey] : defaultVal;
  }
  if (!activeSrc) {
    activeSrc = defaultVal;
  }

  const handleImageReplace = () => {
    openMediaSelector((newUrl: string) => {
      if (onChange) {
        onChange(newUrl);
      } else if (cmsKey) {
        updateContentKey(cmsKey, newUrl);
      }
    });
  };

  const imgElement = fill ? (
    <Image
      src={activeSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={`${className} ${editMode && !isPreview ? 'brightness-75 transition-all' : ''}`}
    />
  ) : (
    <Image
      src={activeSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={`${className} ${editMode && !isPreview ? 'brightness-75 transition-all' : ''}`}
    />
  );

  if (!editMode || isPreview) {
    return imgElement;
  }

  return (
    <div className={`relative group/img ${fill ? 'w-full h-full' : 'inline-block'}`}>
      {imgElement}
      
      {/* Edit Trigger Overlay Layer */}
      <div 
        onClick={handleImageReplace}
        className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300 z-30"
      >
        <button 
          type="button"
          className="bg-gold hover:bg-white text-dark hover:scale-105 px-4 py-2 text-xs font-bold uppercase rounded-lg shadow-lg flex items-center gap-2 tracking-widest transition-all duration-300"
        >
          <Camera size={14} />
          <span>Replace</span>
        </button>
      </div>
    </div>
  );
};

export default EditableImage;
