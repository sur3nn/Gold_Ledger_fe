"use client";

import { Save } from "lucide-react";

interface FooterActionProps {
  onSave: () => void;
  loading?: boolean;
  isSales:boolean
}

const FooterAction = ({ onSave, loading = false ,isSales}: FooterActionProps) => {
  return (
    <div className="flex justify-end pt-2 pb-1">
      <button
        type="button"
        onClick={onSave}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-bold text-[14px] sm:text-[15px] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-purple-300/40 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        <Save size={18} />
        {loading ? "Saving..." : isSales ? "Save & Update Sales" : "Save & Update Purchase"}
      </button>
    </div>
  );
};

export default FooterAction;
