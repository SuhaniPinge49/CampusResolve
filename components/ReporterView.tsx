
import React, { useState, useRef } from 'react';
import { IssueCategory, IssueStatus, IssueReport, Location } from '../types';
import { analyzeIssue } from '../services/geminiService';

interface ReporterViewProps {
  onSubmit: (report: IssueReport) => void;
  myReports: IssueReport[];
}

const ReporterView: React.FC<ReporterViewProps> = ({ onSubmit, myReports }) => {
  const [category, setCategory] = useState<IssueCategory>(IssueCategory.MAINTENANCE);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCaptureLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLocating(false);
      },
      (error) => {
        alert("Could not get location. Please enable location permissions.");
        setIsLocating(false);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please provide your location.");
      return;
    }

    setIsSubmitting(true);
    
    let aiResult = null;
    try {
      aiResult = await analyzeIssue(description, photo || undefined);
    } catch (err) {
      console.warn("AI enhancement skipped");
    }

    const newReport: IssueReport = {
      id: Math.random().toString(36).substr(2, 9),
      category,
      description,
      photo: photo || undefined,
      location,
      status: IssueStatus.SUBMITTED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      aiAssessment: aiResult ? `${aiResult.urgency} Urgency: ${aiResult.recommendation}` : undefined
    };

    onSubmit(newReport);
    setIsSubmitting(false);
    
    // Reset form
    setDescription('');
    setPhoto(null);
    setLocation(null);
    setCategory(IssueCategory.MAINTENANCE);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-indigo-600">
          <h2 className="text-xl font-bold text-white">Report an Issue</h2>
          <p className="text-indigo-100 text-sm mt-1">Help us keep the campus safe and functional.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700"
            >
              {Object.values(IssueCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              required
              placeholder="Provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Photo Evidence</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden bg-slate-50"
              >
                {photo ? (
                  <img src={photo} alt="Issue" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-slate-500 mt-2 block font-medium">Click to upload photo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
              <button
                type="button"
                onClick={handleCaptureLocation}
                disabled={isLocating}
                className={`w-full py-2.5 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium ${
                  location 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-500'
                }`}
              >
                {isLocating ? (
                  <div className="animate-spin h-4 w-4 border-2 border-slate-300 border-t-indigo-600 rounded-full" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {location ? `Location Captured (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})` : 'Get Current Location'}
              </button>
              <p className="text-[10px] text-slate-400 mt-2 italic px-1">We use GPS for precise maintenance locating.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                Processing...
              </>
            ) : 'Submit Report'}
          </button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-800">My Recent Reports</h3>
          <span className="text-xs text-slate-500 font-medium">{myReports.length} total</span>
        </div>
        
        {myReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-400 text-sm">You haven't reported any issues yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...myReports].reverse().map(report => (
              <div key={report.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-indigo-200 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{report.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      report.status === IssueStatus.SOLVED ? 'bg-emerald-100 text-emerald-700' :
                      report.status === IssueStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2 mb-2">{report.description}</p>
                  <div className="flex items-center text-[10px] text-slate-400">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>
                {report.photo && (
                  <img src={report.photo} alt="Issue" className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReporterView;
