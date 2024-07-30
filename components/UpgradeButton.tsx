"use client";

import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2Icon, StarIcon } from "lucide-react";
import { createStripePortal } from "@/actions/createStripePortal";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const UpgradeButton = () => {
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!hasActiveMembership && !loading)
    return (
      <Button asChild variant="default" className="border-blue-600">
        <Link href="/dashboard/upgrade">
          Upgrade <StarIcon className="ml-3 fill-blue-600 text-white" />
        </Link>
      </Button>
    );

  if (loading)
    return (
      <Button variant="default" className="border-blue-600">
        <Loader2Icon className="animate-spin" />
      </Button>
    );

  const handleAccount = () => {
    startTransition(async () => {
      const stripePortalUrl = await createStripePortal();
      router.push(stripePortalUrl);
    });
  };

  return (
    <Button
      className="border-blue-600 bg-blue-600"
      disabled={isPending}
      variant="default"
      onClick={handleAccount}
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <p>
          <span className="font-extrabold">PRO </span>Account
        </p>
      )}
    </Button>
  );
};
export default UpgradeButton;
