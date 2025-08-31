import KiBuddy from "../../../client/components/kibuddy";
import MobileHeader from "@/components/layout/mobile-header";

export default function Sigi() {
  return (
    <>
      <MobileHeader />
      <div className="px-4 py-6">
        <KiBuddy />
      </div>
      <div className="h-20"></div>
    </>
  );
}