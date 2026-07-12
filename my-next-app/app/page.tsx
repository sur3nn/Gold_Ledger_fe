import Purchase from "@/component/Purchase/Purchase";
import Image from "next/image";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 px-5">
      <Purchase isSales={false}/>
    </div>
  );
}
