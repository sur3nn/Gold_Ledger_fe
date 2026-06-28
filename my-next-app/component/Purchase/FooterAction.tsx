"use client";

import { Save } from "lucide-react";

interface FooterActionProps {
  onSave: () => void;
  loading?: boolean;
}

const FooterAction = ({ onSave, loading = false }: FooterActionProps) => {
  return (
    <div className="flex justify-end pt-2 pb-1">
      <button
        type="button"
        onClick={onSave}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6a4cff] to-[#4a32ff] text-white font-bold text-[14px] sm:text-[15px] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        <Save size={18} />
        {loading ? "Saving..." : "Save & Update Purchase"}
      </button>
    </div>
  );
};

export default FooterAction;
