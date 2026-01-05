import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { type Vacancy, type ApiResponse } from '../../types/index';
import Navbar from '../../components/Navbar';

const CoderDashboard: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [userApplications, setUserApplications] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Intentamos cargar las vacantes (Ruta principal)
        const vacanciesRes = await api.get<ApiResponse<Vacancy[]>>('/vacancies');
        if (vacanciesRes.data.success) {
          setVacancies(vacanciesRes.data.data);
        }

        // 2. Intentamos cargar aplicaciones en un bloque separado para que el 403 no rompa todo
        try {
          const applicationsRes = await api.get<ApiResponse<any[]>>('/applications');
          if (applicationsRes.data.success) {
            const appliedIds = applicationsRes.data.data.map((app: any) => 
              app.vacancy?.id || app.vacancyId
            );
            setUserApplications(appliedIds);
          }
        } catch (appErr) {
          console.warn("No se pudieron cargar las aplicaciones previas (403), usando estado local.");
        }

      } catch (err: any) {
        console.error('Error fetching vacancies:', err);
        setError(err.response?.data?.message || 'Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = async (vacancyId: string) => {
    try {
      await api.post('/applications', { vacancyId });
      alert('Application submitted successfully!');
      
      // Bloqueamos el botón y subimos el contador localmente
      setUserApplications(prev => [...prev, vacancyId]);
      setVacancies(prev => prev.map(v => 
        v.id === vacancyId ? { ...v, applicationsCount: (Number(v.applicationsCount) || 0) + 1 } : v
      ));

    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to apply';
      // Si el backend dice que ya aplicaste, bloqueamos el botón de una vez
      if (msg.toLowerCase().includes('already') || error.response?.status === 409) {
        setUserApplications(prev => [...prev, vacancyId]);
      }
      alert(msg);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen font-bold text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-bold">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center mt-8">Available Opportunities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {vacancies.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No vacancies available.</p>
        ) : (
          vacancies.map((job) => {
            // Lógica para evitar el NaN: prioridad al número, luego al length del array, luego 0
            const currentApplicants = typeof job.applicationsCount === 'number' 
              ? job.applicationsCount 
              : (Array.isArray((job as any).applications) ? (job as any).applications.length : 0);

            const hasAlreadyApplied = userApplications.includes(job.id);
            const isFull = currentApplicants >= job.maxApplicants;
            const canApply = job.isActive && !isFull && !hasAlreadyApplied;

            return (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h2>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {job.isActive ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm">
                    <p className="text-blue-600 font-bold uppercase tracking-wide">{job.company}</p>
                    <p className="text-gray-500 font-medium">📍 {job.location} | 💼 {job.modality}</p>
                    <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {job.seniority}
                    </span>
                  </div>

                  <div className="border-t pt-5 flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Applicants</p>
                      <p className="text-lg font-bold text-gray-800">
                        {currentApplicants} <span className="text-gray-300 font-medium">/ {job.maxApplicants}</span>
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={!canApply}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                        hasAlreadyApplied
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : canApply
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {hasAlreadyApplied ? 'Applied' : isFull ? 'Full' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CoderDashboard;