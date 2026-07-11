import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api';

import { toast } from 'react-hot-toast';

type CourseFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: number;
    name: string;
    description: string;
  } | null;
};

export function CourseFormModal({ isOpen, onClose, initialData }: CourseFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
      } else {
        setName('');
        setDescription('');
      }
    }
  }, [isOpen, initialData]);

  const mutation = useMutation({
    mutationFn: async (data: { name: string, description: string }) => {
      const isEdit = !!initialData;
      const url = isEdit ? `/courses/${initialData.id}` : `/courses`;
      const method = isEdit ? 'PUT' : 'POST';

      return fetchApi(url, {
        method,
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', initialData?.id ? String(initialData.id) : undefined] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success(initialData ? 'Course updated successfully' : 'Course created successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    mutation.mutate({ name, description });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {initialData ? 'Edit Course' : 'Create New Course'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white"
              placeholder="e.g. Advanced English Grammar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white resize-none"
              rows={4}
              placeholder="What will students learn in this course?"
            />
          </div>
          <Button type="submit" fullWidth disabled={mutation.isPending} className="h-12 mt-4">
            {mutation.isPending ? 'Saving...' : 'Save Course'}
          </Button>
        </form>
      </div>
    </div>
  );
}
