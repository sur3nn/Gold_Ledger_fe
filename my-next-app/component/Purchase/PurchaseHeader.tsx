const PurchaseHeader = ({ isSales }: { isSales: boolean }) => {
  return (
    <div className="mb-2">
      <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gray-900 leading-tight">
       {isSales ?  "Sales Inward" : "Purchase Inward" }  
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        Gold business performance &amp; metal inventory
      </p>
    </div>
  );
};

export default PurchaseHeader;


