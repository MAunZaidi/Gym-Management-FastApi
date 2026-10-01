import { Suspense } from "react";
import { AuthScreen } from "@/components/modules/auth-screen";
import { LoadingState } from "@/components/ui/loading-state";

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthScreen mode="signup" />
    </Suspense>
  );
}
