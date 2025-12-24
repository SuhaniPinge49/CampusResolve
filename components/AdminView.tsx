
import React, { useState } from 'react';
import { IssueReport, IssueStatus } from '../types';

interface AdminViewProps {
  reports: IssueReport[];
  onUpdateStatus: (id: string, newStatus: IssueStatus) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ reports, onUpdateStatus }) => {
  const [filter, setFilter] = useState<IssueStatus | 'All'>('All');
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(r => r.status === filter);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === IssueStatus.SUBMITTED).length,
    ongoing: reports.filter(r => r.status === IssueStatus.IN_PROGRESS).length,
    solved: reports.filter(r => r.status === IssueStatus.SOLVED).length,
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Pending</p>
          <p className="text-2xl font-bold text-rose-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Ongoing</p>
          <p className="text-2xl font-bold text-amber-600">{stats.ongoing}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Resolved</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.solved}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {['All', IssueStatus.SUBMITTED, IssueStatus.IN_PROGRESS, IssueStatus.SOLVED].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === s 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Report</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No reports found matching this criteria.</td>
                </tr>
              ) : (
                [...filteredReports].reverse().map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedIssue(report)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {report.photo ? (
                          <img src={report.photo} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <span className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{report.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{report.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        report.status === IssueStatus.SOLVED ? 'bg-emerald-100 text-emerald-700' :
                        report.status === IssueStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <select
                          value={report.status}
                          onChange={(e) => onUpdateStatus(report.id, e.target.value as IssueStatus)}
                          className="text-[10px] bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold focus:ring-1 focus:ring-indigo-500"
                        >
                          {Object.values(IssueStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Issue Details */}
      {selectedIssue && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-slate-900">Issue Details</h2>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Evidence</h3>
                  {selectedIssue.photo ? (
                    <img src={selectedIssue.photo} alt="Issue" className="w-full aspect-square rounded-2xl object-cover bg-slate-50" />
                  ) : (
                    <div className="w-full aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">No photo available</div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">{selectedIssue.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category</h3>
                    <p className="text-sm font-semibold text-indigo-600">{selectedIssue.category}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</h3>
                    <p className="text-sm font-semibold text-slate-700">{selectedIssue.status}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</h3>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedIssue.location.latitude},${selectedIssue.location.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Open in Maps
                    </a>
                  </div>

                  {selectedIssue.aiAssessment && (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">AI Smart Analysis</h3>
                      <p className="text-xs text-indigo-800 leading-snug">{selectedIssue.aiAssessment}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Timeline</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Reported on {new Date(selectedIssue.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span>Last activity on {new Date(selectedIssue.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex gap-3">
               <button 
                  onClick={() => onUpdateStatus(selectedIssue.id, IssueStatus.SOLVED)}
                  className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
               >
                 Mark as Solved
               </button>
               <button 
                  onClick={() => onUpdateStatus(selectedIssue.id, IssueStatus.IN_PROGRESS)}
                  className="flex-1 bg-amber-500 text-white font-bold py-2.5 rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
               >
                 Mark In Progress
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
