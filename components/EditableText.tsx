"use client";

import React, { useRef, useEffect } from 'react';
import { useCms } from '@/lib/CmsContext';

interface EditableTextProps {
  cmsKey: string;
  defaultVal: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({
  cmsKey,
  defaultVal,
  className = "",
  as: Component = 'span'
}) => {
  const { editMode, isPreview, contents, updateContentKey } = useCms();
  const elementRef = useRef<HTMLDivElement>(null);
  
  const textValue = contents[cmsKey] !== undefined ? contents[cmsKey] : defaultVal;

  if (!editMode || isPreview) {
    // Render static text block for visitors
    return (
      <Component className={className}>
        {textValue.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </Component>
    );
  }

  // Handle key triggers (Enter vs Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && e.shiftKey === false && Component !== 'p' && Component !== 'div') {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  const handleBlur = () => {
    if (elementRef.current) {
      const newText = elementRef.current.innerText || "";
      if (newText !== textValue) {
        updateContentKey(cmsKey, newText);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <Component
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onPaste={handlePaste}
      className={`${className} outline-none border border-transparent hover:border-dashed hover:border-gold/50 focus:border-solid focus:border-gold focus:bg-gold/5 px-1 py-0.5 rounded transition-all duration-200 cursor-text inline-block min-w-[30px]`}
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {textValue}
    </Component>
  );
};

export default EditableText;
