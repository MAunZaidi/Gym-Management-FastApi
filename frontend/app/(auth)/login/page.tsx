import { Suspense } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { AuthScreen } from "@/components/modules/auth-screen";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthScreen mode="login" />
    </Suspense>
  );
}
