const StockOverview = () => {
  return (
    <div
      className="rounded-3xl p-5 sm:p-7 text-white h-full"
      style={{
        background:
          "linear-gradient(135deg, #080848 0%, #071b59 55%, #014817 100%)",
      }}
    >
      <h3 className="text-[16px] sm:text-[17px] font-bold mb-5 sm:mb-6">
        Stock Overview
      </h3>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-white/80">Total Product Net Weight</span>
        <span className="text-[15px] font-bold text-yellow-400">40.000 g</span>
      </div>

      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <span className="text-sm text-white/80">Solid Gold Given</span>
        <span className="text-[15px] font-bold text-white">+35.000g</span>
      </div>

      <div className="h-px bg-white/15 mb-5 sm:mb-6" />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-white/80">Credit</p>
          <p className="text-sm text-white/80">Balance</p>
        </div>
        <div className="text-right">
          <p className="text-[36px] sm:text-[42px] font-bold leading-none">
            +5g
          </p>
          <p className="text-[11px] text-white/60 mt-1">
            (Credit Given to Factory)
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockOverview;
