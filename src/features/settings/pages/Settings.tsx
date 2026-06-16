import { PageShell } from "@/layouts/MainLayout";
import SubscriptionSettings from "./SubscriptionSettings";

export default function SettingsPage() {
  return (
    <PageShell title="Settings">
      <SubscriptionSettings />
      {/* other settings sections */}
    </PageShell>
  );
}