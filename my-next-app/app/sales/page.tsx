import CreditManagement from "@/component/CreditManagement/CreditManagement";
import Purchase from "@/component/Purchase/Purchase";

export default function salesPage() {
  return (
    <>
      <Purchase isSales={true}/>
    </>
  );
}