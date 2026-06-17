"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './authContext';

interface CmsContextType {
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  isPreview: boolean;
  setIsPreview: (val: boolean) => void;
  
  // Data
  contents: Record<string, string>;
  occasions: any[];
  testimonials: any[];
  services: any[];
  gallery: any[];
  isLoading: boolean;

  // Actions
  updateContentKey: (key: string, value: string) => void;
  updateOccasion: (index: number, updatedOccasion: any) => void;
  addOccasion: (newOccasion: any) => void;
  deleteOccasion: (index: number) => void;
  reorderOccasions: (startIndex: number, endIndex: number) => void;
  
  updateTestimonial: (index: number, updatedTest: any) => void;
  addTestimonial: (newTest: any) => void;
  deleteTestimonial: (index: number) => void;
  reorderTestimonials: (startIndex: number, endIndex: number) => void;

  updatePackage: (catId: string, pkgIndex: number, updatedPkg: any) => void;
  addPackage: (catId: string, newPkg: any) => void;
  deletePackage: (catId: string, pkgIndex: number) => void;
  reorderPackages: (catId: string, startIndex: number, endIndex: number) => void;

  updateCategoryInfo: (catId: string, updatedInfo: Partial<any>) => void;
  
  // Gallery CMS
  addGalleryStory: (story: any) => void;
  updateGalleryStory: (id: string, updatedStory: any) => void;
  deleteGalleryStory: (id: string) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Save / Publish
  publish: (type?: 'all' | 'content' | 'occasions' | 'testimonials' | 'services' | 'gallery') => Promise<boolean>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  discardChanges: () => void;

  // Media Library Chooser Dialog
  isMediaSelectorOpen: boolean;
  openMediaSelector: (onSelect: (url: string) => void) => void;
  closeMediaSelector: () => void;
  selectMediaItem: (url: string) => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

interface HistoryState {
  contents: Record<string, string>;
  occasions: any[];
  testimonials: any[];
  services: any[];
  gallery: any[];
}

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Core CMS state
  const [contents, setContents] = useState<Record<string, string>>({});
  const [occasions, setOccasions] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // Undo/Redo history stacks
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Unsaved changes flag
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Media Library chooser hook state
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaCallback, setMediaCallback] = useState<((url: string) => void) | null>(null);

  // Fetch initial CMS content from API
  const fetchCmsData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/cms');
      if (res.ok) {
        const data = await res.json();
        
        setContents(data.contents || {});
        setOccasions(data.occasions || []);
        setTestimonials(data.testimonials || []);
        setServices(data.services || []);
        setGallery(data.gallery || []);

        // Initialize history
        const initialState = {
          contents: data.contents || {},
          occasions: data.occasions || [],
          testimonials: data.testimonials || [],
          services: data.services || [],
          gallery: data.gallery || []
        };
        setHistory([initialState]);
        setHistoryIndex(0);
        
        // Restore local storage draft if available
        const draft = localStorage.getItem('ss_cms_draft');
        if (draft) {
          try {
            const parsedDraft = JSON.parse(draft);
            if (window.confirm("You have unsaved changes from a previous session. Would you like to restore them?")) {
              setContents(parsedDraft.contents);
              setOccasions(parsedDraft.occasions);
              setTestimonials(parsedDraft.testimonials);
              setServices(parsedDraft.services);
              setGallery(parsedDraft.gallery);
              setHasUnsavedChanges(true);
              
              // Push draft to history
              const draftState = {
                contents: parsedDraft.contents,
                occasions: parsedDraft.occasions,
                testimonials: parsedDraft.testimonials,
                services: parsedDraft.services,
                gallery: parsedDraft.gallery
              };
              setHistory([initialState, draftState]);
              setHistoryIndex(1);
            } else {
              localStorage.removeItem('ss_cms_draft');
            }
          } catch (e) {
            console.error("Failed to load draft:", e);
          }
        }
      }
    } catch (e) {
      console.error("[CmsProvider] Error loading CMS data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('editMode') === 'true' && user && user.role === 'admin') {
        setEditMode(true);
      }
    }
  }, [user]);

  // Sync edits to LocalStorage as a recovery draft (autosave)
  useEffect(() => {
    if (hasUnsavedChanges && !isLoading) {
      const draftState = { contents, occasions, testimonials, services, gallery };
      localStorage.setItem('ss_cms_draft', JSON.stringify(draftState));
    }
  }, [contents, occasions, testimonials, services, gallery, hasUnsavedChanges, isLoading]);

  // Helper to commit a state update to the history stack
  const commitState = useCallback((nextState: Partial<HistoryState>) => {
    setHistory(prevHistory => {
      const current = prevHistory[historyIndex] || {
        contents, occasions, testimonials, services, gallery
      };

      const newState: HistoryState = {
        contents: nextState.contents !== undefined ? nextState.contents : current.contents,
        occasions: nextState.occasions !== undefined ? nextState.occasions : current.occasions,
        testimonials: nextState.testimonials !== undefined ? nextState.testimonials : current.testimonials,
        services: nextState.services !== undefined ? nextState.services : current.services,
        gallery: nextState.gallery !== undefined ? nextState.gallery : current.gallery
      };

      // Wipe any redo states if we commit a new action
      const slicedHistory = prevHistory.slice(0, historyIndex + 1);
      
      setHistoryIndex(slicedHistory.length);
      setHasUnsavedChanges(true);
      return [...slicedHistory, newState];
    });
  }, [historyIndex, contents, occasions, testimonials, services, gallery]);

  // Undo action
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetState = history[targetIndex];
      
      setContents(targetState.contents);
      setOccasions(targetState.occasions);
      setTestimonials(targetState.testimonials);
      setServices(targetState.services);
      setGallery(targetState.gallery);
      
      setHistoryIndex(targetIndex);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  // Redo action
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetState = history[targetIndex];

      setContents(targetState.contents);
      setOccasions(targetState.occasions);
      setTestimonials(targetState.testimonials);
      setServices(targetState.services);
      setGallery(targetState.gallery);

      setHistoryIndex(targetIndex);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  // General Key Value CMS text key updates
  const updateContentKey = useCallback((key: string, value: string) => {
    setContents(prev => {
      const updated = { ...prev, [key]: value };
      commitState({ contents: updated });
      return updated;
    });
  }, [commitState]);

  // Occasions editing
  const updateOccasion = useCallback((index: number, updatedOccasion: any) => {
    setOccasions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updatedOccasion };
      commitState({ occasions: updated });
      return updated;
    });
  }, [commitState]);

  const addOccasion = useCallback((newOccasion: any) => {
    setOccasions(prev => {
      const updated = [...prev, { ...newOccasion, order: prev.length }];
      commitState({ occasions: updated });
      return updated;
    });
  }, [commitState]);

  const deleteOccasion = useCallback((index: number) => {
    setOccasions(prev => {
      const updated = prev.filter((_: any, i: number) => i !== index).map((occ: any, idx: number) => ({ ...occ, order: idx }));
      commitState({ occasions: updated });
      return updated;
    });
  }, [commitState]);

  const reorderOccasions = useCallback((startIndex: number, endIndex: number) => {
    setOccasions(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, removed);
      const reordered = updated.map((occ: any, idx: number) => ({ ...occ, order: idx }));
      commitState({ occasions: reordered });
      return reordered;
    });
  }, [commitState]);

  // Testimonials editing
  const updateTestimonial = useCallback((index: number, updatedTest: any) => {
    setTestimonials(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updatedTest };
      commitState({ testimonials: updated });
      return updated;
    });
  }, [commitState]);

  const addTestimonial = useCallback((newTest: any) => {
    setTestimonials(prev => {
      const updated = [...prev, { ...newTest, order: prev.length }];
      commitState({ testimonials: updated });
      return updated;
    });
  }, [commitState]);

  const deleteTestimonial = useCallback((index: number) => {
    setTestimonials(prev => {
      const updated = prev.filter((_: any, i: number) => i !== index).map((t: any, idx: number) => ({ ...t, order: idx }));
      commitState({ testimonials: updated });
      return updated;
    });
  }, [commitState]);

  const reorderTestimonials = useCallback((startIndex: number, endIndex: number) => {
    setTestimonials(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, removed);
      const reordered = updated.map((t: any, idx: number) => ({ ...t, order: idx }));
      commitState({ testimonials: reordered });
      return reordered;
    });
  }, [commitState]);

  // Services categories and packages editing
  const updateCategoryInfo = useCallback((catId: string, updatedInfo: Partial<any>) => {
    setServices(prev => {
      const updated = prev.map((cat: any) => {
        if (cat.id === catId) {
          return { ...cat, ...updatedInfo };
        }
        return cat;
      });
      commitState({ services: updated });
      return updated;
    });
  }, [commitState]);

  const updatePackage = useCallback((catId: string, pkgIndex: number, updatedPkg: any) => {
    setServices(prev => {
      const updated = prev.map((cat: any) => {
        if (cat.id === catId) {
          const updatedPackages = [...cat.packages];
          updatedPackages[pkgIndex] = { ...updatedPackages[pkgIndex], ...updatedPkg };
          return { ...cat, packages: updatedPackages };
        }
        return cat;
      });
      commitState({ services: updated });
      return updated;
    });
  }, [commitState]);

  const addPackage = useCallback((catId: string, newPkg: any) => {
    setServices(prev => {
      const updated = prev.map((cat: any) => {
        if (cat.id === catId) {
          const updatedPackages = [...cat.packages, { ...newPkg, order: cat.packages.length }];
          return { ...cat, packages: updatedPackages };
        }
        return cat;
      });
      commitState({ services: updated });
      return updated;
    });
  }, [commitState]);

  const deletePackage = useCallback((catId: string, pkgIndex: number) => {
    setServices(prev => {
      const updated = prev.map((cat: any) => {
        if (cat.id === catId) {
          const updatedPackages = cat.packages
            .filter((_: any, i: number) => i !== pkgIndex)
            .map((pkg: any, idx: number) => ({ ...pkg, order: idx }));
          return { ...cat, packages: updatedPackages };
        }
        return cat;
      });
      commitState({ services: updated });
      return updated;
    });
  }, [commitState]);

  const reorderPackages = useCallback((catId: string, startIndex: number, endIndex: number) => {
    setServices(prev => {
      const updated = prev.map((cat: any) => {
        if (cat.id === catId) {
          const updatedPackages = [...cat.packages];
          const [removed] = updatedPackages.splice(startIndex, 1);
          updatedPackages.splice(endIndex, 0, removed);
          const reordered = updatedPackages.map((pkg: any, idx: number) => ({ ...pkg, order: idx }));
          return { ...cat, packages: reordered };
        }
        return cat;
      });
      commitState({ services: updated });
      return updated;
    });
  }, [commitState]);

  // Gallery Story operations
  const addGalleryStory = useCallback((newStory: any) => {
    setGallery(prev => {
      const updated = [newStory, ...prev];
      commitState({ gallery: updated });
      return updated;
    });
  }, [commitState]);

  const updateGalleryStory = useCallback((id: string, updatedStory: any) => {
    setGallery(prev => {
      const updated = prev.map((story: any) => {
        if (story.id === id) {
          return { ...story, ...updatedStory };
        }
        return story;
      });
      commitState({ gallery: updated });
      return updated;
    });
  }, [commitState]);

  const deleteGalleryStory = useCallback((id: string) => {
    setGallery(prev => {
      const updated = prev.filter((story: any) => story.id !== id);
      commitState({ gallery: updated });
      return updated;
    });
  }, [commitState]);

  // Discard all unsaved edits
  const discardChanges = useCallback(() => {
    if (window.confirm("Are you sure you want to discard all unsaved edits? This cannot be undone.")) {
      localStorage.removeItem('ss_cms_draft');
      fetchCmsData();
      setHasUnsavedChanges(false);
    }
  }, []);

  // Save changes to database API (Publish)
  const publish = async (type: 'all' | 'content' | 'occasions' | 'testimonials' | 'services' | 'gallery' = 'all'): Promise<boolean> => {
    setIsSaving(true);
    try {
      const payload: Array<{ type: string; data: any }> = [];
      
      if (type === 'all' || type === 'content') {
        payload.push({ type: 'content', data: contents });
      }
      if (type === 'all' || type === 'occasions') {
        payload.push({ type: 'occasions', data: occasions });
      }
      if (type === 'all' || type === 'testimonials') {
        payload.push({ type: 'testimonials', data: testimonials });
      }
      if (type === 'all' || type === 'services') {
        payload.push({ type: 'services', data: services });
      }
      if (type === 'all' || type === 'gallery') {
        payload.push({ type: 'gallery', data: gallery });
      }

      // Execute sequential saves
      for (const item of payload) {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Failed to save ${item.type}`);
        }
      }

      console.log("[CMS] Changes successfully published.");
      setHasUnsavedChanges(false);
      localStorage.removeItem('ss_cms_draft');
      
      // Update history reference state
      setHistory([
        {
          contents,
          occasions,
          testimonials,
          services,
          gallery
        }
      ]);
      setHistoryIndex(0);
      
      return true;
    } catch (e: any) {
      console.error("[CMS] Error publishing edits:", e);
      alert(`Publishing failed: ${e.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Media selection callbacks
  const openMediaSelector = useCallback((onSelect: (url: string) => void) => {
    setMediaCallback(() => onSelect);
    setIsMediaSelectorOpen(true);
  }, []);

  const closeMediaSelector = useCallback(() => {
    setIsMediaSelectorOpen(false);
    setMediaCallback(null);
  }, []);

  const selectMediaItem = useCallback((url: string) => {
    if (mediaCallback) {
      mediaCallback(url);
    }
    closeMediaSelector();
  }, [mediaCallback, closeMediaSelector]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Render floating bar for administrators automatically
  const isAdmin = !!(user && user.role === 'admin');

  return (
    <CmsContext.Provider
      value={{
        editMode: editMode && isAdmin,
        setEditMode,
        isPreview,
        setIsPreview,
        contents,
        occasions,
        testimonials,
        services,
        gallery,
        isLoading,
        updateContentKey,
        updateOccasion,
        addOccasion,
        deleteOccasion,
        reorderOccasions,
        updateTestimonial,
        addTestimonial,
        deleteTestimonial,
        reorderTestimonials,
        updatePackage,
        addPackage,
        deletePackage,
        reorderPackages,
        updateCategoryInfo,
        addGalleryStory,
        updateGalleryStory,
        deleteGalleryStory,
        undo,
        redo,
        canUndo,
        canRedo,
        publish,
        isSaving,
        hasUnsavedChanges,
        discardChanges,
        isMediaSelectorOpen,
        openMediaSelector,
        closeMediaSelector,
        selectMediaItem
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (context === undefined) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
