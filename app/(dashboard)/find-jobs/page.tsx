"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApi, postApi, smtp } from "@/app/services";

interface JobFinding {
  _id?: string; // MongoDB id
  id?: string;
  jobTitle: string;
  companyName?: string;
  location?: string;
  jobType?: string;
  experienceRequired?: string;
  description?: string;
  applyUrl?: string;
  source?: string;
  postedDate?: string | Date;
  searchKeywords?: string[];
  createdAt?: string | Date;
}

export default function FindJobsPage() {
  const router = useRouter();

  // Search input states
  const [jobtitles, setJobtitles] = useState<string[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  // API loading / response states
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [findings, setFindings] = useState<JobFinding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Client-side filtering state
  const [clientFilter, setClientFilter] = useState("");

  // UI state: track expanded job descriptions
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  // Fetch all findings
  const fetchFindings = async () => {
    setLoading(true);
    try {
      const response = await getApi(smtp.getJobFindings);
      setFindings(response?.data?.data || response?.data || []);
    } catch (err: any) {
      console.error("Failed to fetch findings:", err);
      // The Axios interceptor already handles errors and shows toast messages.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, []);

  const handleAddTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = titleInput.trim().replace(/,$/, "");
      if (val && !jobtitles.includes(val)) {
        setJobtitles([...jobtitles, val]);
        setTitleInput("");
      }
    }
  };

  const handleRemoveTitle = (indexToRemove: number) => {
    setJobtitles(jobtitles.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // If they typed something but didn't press enter, add it
    let titles = [...jobtitles];
    if (titleInput.trim()) {
      const val = titleInput.trim();
      if (!titles.includes(val)) {
        titles.push(val);
        setJobtitles(titles);
        setTitleInput("");
      }
    }

    if (titles.length === 0) {
      setError("Please add at least one job title to start the search.");
      return;
    }

    if (!experience.trim()) {
      setError("Experience level is required (e.g., '2 years', 'Mid-level').");
      return;
    }

    setSearching(true);
    try {
      const response = await postApi(smtp.startFind, {
        jobtitle: titles,
        experience,
        location: location.trim() || undefined,
      });

      const totalFound = response?.data?.totalFound ?? 0;
      setSuccessMessage(
        `Job search completed! Found and saved ${totalFound} job listing(s).`
      );

      // Refetch listings
      await fetchFindings();
    } catch (err: any) {
      console.error("Failed to start job search:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred while finding jobs.";
      setError(errMsg);
    } finally {
      setSearching(false);
    }
  };

  // Toggle expanded state for a single job description
  const toggleExpandJob = (jobId: string) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const getJobEmail = (job: JobFinding): string => {
    if (job.description) {
      const emailMatch = job.description.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        return emailMatch[0];
      }
    }
    if (job.companyName) {
      const cleanCompany = job.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      if (cleanCompany) {
        return `hr@${cleanCompany}.com`;
      }
    }
    return "recruiter@company.com";
  };

  // Pre-fill email outreach
  const handleDraftOutreach = (job: JobFinding) => {
    const jobEmail = getJobEmail(job);
    const defaultSubject = `Application for ${job.jobTitle} - ${job.companyName || "Hiring Team"}`;
    const defaultBody = `Dear Hiring Manager,

I hope you are doing well.

I recently found the listing for the ${job.jobTitle} position ${job.companyName ? `at ${job.companyName}` : ""} and would love to express my interest.

I am a Software Developer with experience in web technologies. I have attached my resume for your review and would welcome the opportunity to connect.

Best regards,

Vishakh CS`;

    const searchParams = new URLSearchParams();
    searchParams.set("to", jobEmail);
    searchParams.set("subject", defaultSubject);
    searchParams.set("body", defaultBody);
    
    router.push(`/compose?${searchParams.toString()}`);
  };

  // Filter findings based on client input
  const filteredFindings = findings.filter((job) => {
    const searchString = clientFilter.toLowerCase();
    const matchesTitle = job.jobTitle.toLowerCase().includes(searchString);
    const matchesCompany = (job.companyName || "").toLowerCase().includes(searchString);
    const matchesLocation = (job.location || "").toLowerCase().includes(searchString);
    return matchesTitle || matchesCompany || matchesLocation;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight mb-1">
            AI Job Finder
          </h2>
          <p className="text-on-surface-variant/70">
            Configure keywords and experience to scan and save active job opportunities.
          </p>
        </div>
      </div>

      {/* Search Configuration Panel */}
      <section className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl">
        <h3 className="text-md font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">travel_explore</span>
          Start Job Search
        </h3>

        {/* Status Messages inside configuration box */}
        {error && (
          <div className="mb-4 p-3.5 text-sm bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 text-sm bg-primary/10 border border-primary/30 text-primary rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Job Titles Tag Input */}
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-[10px] font-bold text-secondary/80 uppercase tracking-widest">
                Job Titles <span className="text-error">*</span>
              </label>
              <div className="flex flex-col gap-2 p-2 border border-white/10 rounded-xl bg-white/5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all min-h-[50px]">
                {/* Active Tag Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {jobtitles.map((title, idx) => (
                    <span
                      key={title}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20"
                    >
                      {title}
                      <button
                        type="button"
                        onClick={() => handleRemoveTitle(idx)}
                        className="hover:bg-primary/20 rounded-full w-4 h-4 flex items-center justify-center text-[10px] transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={handleAddTitle}
                    disabled={searching}
                    placeholder={jobtitles.length === 0 ? "e.g. React Developer, Node Developer (press Enter to add)" : "Add more titles..."}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline/50 p-1 min-w-[200px]"
                  />
                </div>
              </div>
            </div>

            {/* Experience Level & Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-1">
              {/* Experience Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-secondary/80 uppercase tracking-widest">
                  Experience Level <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  disabled={searching}
                  placeholder="e.g. 2 years, Mid-level"
                  className="glass-input px-4 py-2.5 rounded-xl text-sm w-full h-[50px]"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-secondary/80 uppercase tracking-widest">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={searching}
                  placeholder="e.g. Remote, Bangalore"
                  className="glass-input px-4 py-2.5 rounded-xl text-sm w-full h-[50px]"
                />
              </div>
            </div>
          </div>

          {/* Search trigger button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={searching}
              className="px-7 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching & Scraping...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Search Jobs</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Job Listing Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span>Job Findings</span>
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-secondary font-semibold">
              {filteredFindings.length} listings
            </span>
          </h3>

          {/* Client-side filter input */}
          <div className="relative w-full sm:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              filter_list
            </span>
            <input
              type="text"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              placeholder="Filter findings by keyword..."
              className="glass-input w-full pl-10 pr-4 py-2 rounded-2xl text-xs placeholder:text-outline/50"
            />
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-5/6" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-white/5 rounded w-16" />
                  <div className="h-6 bg-white/5 rounded w-16" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-white/5 rounded w-20" />
                  <div className="h-8 bg-white/10 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFindings.length === 0 ? (
          // Empty State
          <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[32px]">find_in_page</span>
            </div>
            <div>
              <h4 className="text-md font-bold text-on-surface">No Job Findings</h4>
              <p className="text-xs text-on-surface-variant/60 max-w-sm mx-auto mt-1">
                {clientFilter ? "No jobs match your filter criteria." : "Configure parameters above and click Search Jobs to scrape current opportunities."}
              </p>
            </div>
          </div>
        ) : (
          // Grid of Job Cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFindings.map((job) => {
              const jobId = job._id || job.id || String(Math.random());
              const isExpanded = expandedJobs[jobId] || false;
              const dateObj = job.postedDate ? new Date(job.postedDate) : null;
              const formattedDate = dateObj && !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                : "Recently";

              return (
                <div
                  key={jobId}
                  className="glass-card rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Title & Company Name */}
                    <div className="flex items-start gap-3">
                      {/* Avatar / Placeholder */}
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-md shrink-0">
                        {job.companyName ? job.companyName[0].toUpperCase() : "J"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-on-surface leading-snug truncate" title={job.jobTitle}>
                          {job.jobTitle}
                        </h4>
                        <p className="text-xs text-secondary/80 truncate">
                          {job.companyName || "Unknown Company"}
                        </p>
                      </div>
                    </div>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5">
                      {/* Location tag */}
                      {job.location && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-on-surface-variant/80 border border-white/5">
                          <span className="material-symbols-outlined text-[11px]">location_on</span>
                          {job.location}
                        </span>
                      )}

                      {/* Job Type tag */}
                      {job.jobType && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-on-surface-variant/80 border border-white/5">
                          <span className="material-symbols-outlined text-[11px]">schedule</span>
                          {job.jobType}
                        </span>
                      )}

                      {/* Experience required */}
                      {job.experienceRequired && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-on-surface-variant/80 border border-white/5">
                          <span className="material-symbols-outlined text-[11px]">work</span>
                          {job.experienceRequired}
                        </span>
                      )}

                      {/* Source tag */}
                      {job.source && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-tertiary/10 text-tertiary border border-tertiary/20">
                          {job.source}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {job.description && (
                      <div className="text-xs text-on-surface-variant/80 leading-relaxed font-sans mt-2">
                        <p className={isExpanded ? "" : "line-clamp-3"}>
                          {job.description}
                        </p>
                        {job.description.length > 150 && (
                          <button
                            onClick={() => toggleExpandJob(jobId)}
                            className="text-primary text-[10px] font-bold mt-1.5 hover:underline flex items-center gap-0.5 animate-fade-in"
                          >
                            <span>{isExpanded ? "Show Less" : "Read More"}</span>
                            <span className="material-symbols-outlined text-[12px]">
                              {isExpanded ? "expand_less" : "expand_more"}
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer actions */}
                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-outline flex items-center gap-1 select-none">
                      <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                      {formattedDate}
                    </span>

                    <div className="flex gap-2 shrink-0">
                      {/* Apply Now button redirecting to compose outreach */}
                      <button
                        onClick={() => handleDraftOutreach(job)}
                        className="px-3.5 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary/10"
                        title="Apply via email outreach"
                      >
                        <span className="material-symbols-outlined text-[15px]">send</span>
                        Apply Now
                      </button>

                      {/* View Original link if applyUrl exists */}
                      {job.applyUrl && (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-on-surface-variant text-xs font-medium rounded-lg border border-white/10 transition-all flex items-center gap-1"
                        >
                          View Original
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
