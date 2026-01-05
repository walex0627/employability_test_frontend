import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Vacancy } from '../types';

interface VacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Vacancy | null;
}

/**
 * VacancyModal Component
 * Implements all 10 fields required by the NestJS CreateVacancyDto.
 */
const VacancyModal: React.FC<VacancyModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    seniority: '',
    softSkills: '',
    location: '',
    modality: 'remoto', // Default lowercase to match backend Enum
    salaryRange: '',
    company: '',
    maxApplicants: 5,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        technologies: initialData.technologies || '',
        seniority: initialData.seniority,
        softSkills: initialData.softSkills || '',
        location: initialData.location,
        modality: initialData.modality,
        salaryRange: initialData.salary || '',
        company: initialData.company,
        maxApplicants: initialData.maxApplicants,
      });
    } else {
      setFormData({
        title: '', description: '', technologies: '', seniority: '',
        softSkills: '', location: '', modality: 'remoto',
        salaryRange: '', company: '', maxApplicants: 5
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final data sanitization
    const payload = {
      ...formData,
      maxApplicants: Number(formData.maxApplicants), // Must be a number
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          {initialData ? 'Update Job Offer' : 'Create New Vacancy'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1: Title */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Vacancy Title</label>
            <input 
              required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Backend Developer NestJS"
            />
          </div>

          {/* Row 2: Company & Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Company</label>
            <input 
              required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
              placeholder="Riwi Tech"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
            <input 
              required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="Medellín"
            />
          </div>

          {/* Row 3: Technologies & Soft Skills */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Technologies</label>
            <input 
              required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.technologies}
              onChange={e => setFormData({...formData, technologies: e.target.value})}
              placeholder="Node.js, TypeScript..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Soft Skills</label>
            <input 
              required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.softSkills}
              onChange={e => setFormData({...formData, softSkills: e.target.value})}
              placeholder="Teamwork, Communication..."
            />
          </div>

          {/* Row 4: Modality & Seniority */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Modality</label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.modality}
              onChange={e => setFormData({...formData, modality: e.target.value})}
            >
              <option value="remoto">remoto</option>
              <option value="presencial">presencial</option>
              <option value="híbrido">híbrido</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Seniority</label>
            <input 
              required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.seniority}
              onChange={e => setFormData({...formData, seniority: e.target.value})}
              placeholder="Junior Advanced"
            />
          </div>

          {/* Row 5: Salary & Max Applicants */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Salary Range</label>
            <input 
              required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.salaryRange}
              onChange={e => setFormData({...formData, salaryRange: e.target.value})}
              placeholder="$4.000.000 - $5.000.000"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Max Applicants</label>
            <input 
              type="number" required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.maxApplicants}
              onChange={e => setFormData({...formData, maxApplicants: parseInt(e.target.value)})}
            />
          </div>

          {/* Row 6: Description */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Detailed Description</label>
            <textarea 
              required rows={3} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe job responsibilities..."
            />
          </div>

          <div className="md:col-span-2 flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 font-bold text-white bg-black rounded-xl hover:bg-gray-800 shadow-xl transition-all active:scale-95">
              {initialData ? 'Save Changes' : 'Publish Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacancyModal;