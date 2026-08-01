import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Download, 
  Activity,
  ChevronLeft,
  ChevronRight,
  XCircle
} from 'lucide-react';
import { mockApi } from '../../services/api';
import DashboardCard from '../../components/DashboardCard/DashboardCard';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await mockApi.getHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history list", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filter Logic
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = 
      selectedSeverity === 'All' || 
      item.severity.toLowerCase() === selectedSeverity.toLowerCase();

    const matchesType = 
      selectedType === 'All' || 
      item.prediction.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesSeverity && matchesType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewReport = (record) => {
    navigate('/results', { state: { result: record } });
  };

  const handlePrintReport = (record) => {
    navigate('/results', { state: { result: record } });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 text-primary-600 dark:text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div>
        <h2 className="text-3xl font-extrabold font-heading text-slate-800 dark:text-slate-100 tracking-tight">
          Patient Archives
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review, search, and audit patient diagnostics history records.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-2xl shadow-soft">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search Patient Name, ID, or report ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Severity */}
        <div>
          <select
            value={selectedSeverity}
            onChange={(e) => {
              setSelectedSeverity(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm"
          >
            <option value="All">All Severities</option>
            <option value="Normal">Normal</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
            <option value="Profound">Profound</option>
          </select>
        </div>

        {/* Loss Type */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-bold transition-all shadow-sm"
          >
            <option value="All">All Classifications</option>
            <option value="Sensorineural">Sensorineural</option>
            <option value="Conductive">Conductive</option>
            <option value="Mixed">Mixed</option>
            <option value="Normal">Normal Hearing</option>
          </select>
        </div>

      </div>

      {/* Patient Table */}
      <DashboardCard className="p-0 overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <XCircle className="h-10 w-10 text-slate-400" />
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">No records found</h4>
            <p className="text-xs text-slate-400">Try modifying your search queries or filter attributes.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-slate-800/40 bg-slate-50/45 dark:bg-slate-900/30 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="px-6 py-4">Patient Profile</th>
                    <th className="px-6 py-4">Analysis Date</th>
                    <th className="px-6 py-4">AI Prediction</th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4">Disability %</th>
                    <th className="px-6 py-4">Confidence</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {item.patientName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            ID: {item.patientId} &bull; Case: {item.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-200/20">
                          {item.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          item.severity === 'Normal'
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20'
                            : item.severity === 'Severe' || item.severity === 'Profound'
                            ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/20'
                            : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/20'
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {item.disability}%
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {item.confidence}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewReport(item)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="View Report"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handlePrintReport(item)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Print / Export Report"
                          >
                            <Download className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 bg-slate-50/30 dark:bg-slate-900/10">
                <span className="text-xs text-slate-400 font-semibold">
                  Page {currentPage} of {totalPages} &bull; Showing {currentItems.length} of {filteredHistory.length} patients
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </DashboardCard>

    </div>
  );
}
