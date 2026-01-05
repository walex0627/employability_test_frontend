import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/NavBar';
import VacancyModal from '../../components/VacancyModal'; 
import { type Vacancy, type ApiResponse } from '../../types/index';
import { Plus, MapPin, Trash2, LayoutGrid, Edit, Users } from 'lucide-react';

/**
 * AdminDashboard Component
 * Manages job listings and allows viewing specific applicants for each offer.
 */
const AdminDashboard: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  
  // State to manage the "View Applicants" modal
  const [viewingApps, setViewingApps] = useState<{title: string, list: any[]} | null>(null);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Vacancy[]>>('/vacancies');
      if (response.data && response.data.data) {
        setVacancies(response.data.data);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  // FIXED: Implementation of openEditModal that was missing in your error log
  const openEditModal = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalOpen(true);
  };

  // FIXED: Improved handleDelete with better error handling for Foreign Key constraints
  const handleDelete = async (id: string) => {
    if (!window.confirm('WARNING: Deleting this vacancy will also delete all associated applications. Continue?')) return;
    
    try {
      await api.delete(`/vacancies/${id}`);
      setVacancies((prev) => prev.filter((v) => v.id !== id));
      alert('Vacancy and applications removed successfully');
    } catch (error: any) {
      console.error('Delete error:', error.response?.data);
      // Detailed error for the user based on your Docker logs
      alert('Database Error: This vacancy has active applications. Ensure CASCADE delete is enabled or delete applications first.');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        maxApplicants: Number(formData.maxApplicants),
        modality: formData.modality?.toLowerCase() || 'remoto',
      };

      if (selectedVacancy) {
        await api.patch(`/vacancies/${selectedVacancy.id}`, payload);
        alert('Vacancy updated successfully');
      } else {
        // Clean payload for NestJS CreateVacancyDto
        const createPayload = { ...payload };
        delete (createPayload as any).isActive;
        await api.post('/vacancies', createPayload);
        alert('Vacancy created successfully');
      }

      setIsModalOpen(false);
      fetchVacancies();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      alert(Array.isArray(msg) ? msg.join('\n') : msg || 'Error saving vacancy');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest leading-none mt-1">Recruiter Dashboard</p>
            </div>
          </div>
          
          <button 
            onClick={() => { setSelectedVacancy(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} />
            New Vacancy
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-medium text-gray-400 animate-pulse">Fetching data...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">Job Details</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5 text-center">Applicants Fill</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vacancies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">No vacancies found.</td>
                  </tr>
                ) : (
                  vacancies.map((v) => {
                    // FIXED: Robust count logic to avoid NaN shown in your screenshot
                    const appsList = (v as any).applications || [];
                    const currentCount = typeof v.applicationsCount === 'number' 
                      ? v.applicationsCount 
                      : appsList.length;

                    return (
                      <tr key={v.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-6 py-5">
                          <span className="font-bold text-gray-900 block text-sm">{v.title}</span>
                          <span className="text-[10px] text-blue-500 font-black uppercase mt-0.5 inline-block">{v.company}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium capitalize">
                            <MapPin size={14} className="text-gray-300" /> {v.location}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => setViewingApps({ title: v.title, list: appsList })}
                            className="mx-auto flex flex-col items-center group/btn cursor-pointer"
                          >
                            <span className="text-xs font-bold text-gray-700 group-hover/btn:text-blue-600 transition-colors">
                              {currentCount} / {v.maxApplicants}
                            </span>
                            <div className="w-20 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-700" 
                                style={{ width: `${Math.min((currentCount / v.maxApplicants) * 100, 100)}%` }}
                              />
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditModal(v)} 
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-blue-100 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(v.id)} 
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-red-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: VIEW APPLICANTS LIST */}
      {viewingApps && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Applicants</h3>
                <p className="text-xs text-gray-400 font-medium uppercase">{viewingApps.title}</p>
              </div>
              <button onClick={() => setViewingApps(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {viewingApps.list.length === 0 ? (
                <div className="text-center py-10">
                  <Users size={32} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No applications yet.</p>
                </div>
              ) : (
                viewingApps.list.map((app: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {app.user?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-none">{app.user?.name || 'Unknown Coder'}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{app.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <VacancyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={selectedVacancy}
      />
    </div>
  );
};

export default AdminDashboard;