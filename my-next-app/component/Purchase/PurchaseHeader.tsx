const PurchaseHeader = ({ isSales }: { isSales: boolean }) => {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-1 h-7 sm:h-8 rounded-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-orange-400" />
        <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gray-900 leading-tight tracking-tight">
          {isSales ? "Sales Inward" : "Purchase Inward"}
        </h1>
      </div>
      <p className="text-sm text-gray-400 mt-1 ml-3">
        Gold business performance &amp; metal inventory
      </p>
    </div>
  );
};

export default PurchaseHeader;
