"use client";

import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import getStripe from "@/lib/stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type UserDetails = {
  email: string;
  name: string;
};

const Pricing = () => {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

  return (
    <div>
      <div className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Supercharge your document companion
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 text-center">
          Chose an affordable plan that&apos;s packed with the best features for
          interacting with your PDFs, enhacing your productivity and
          streamlining your workflow.
        </p>

        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
          <div className="ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              Starter Plan
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Explore core features at no cost.
            </p>

            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                Free
              </span>
            </p>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />2
                Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                Up to 3 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                Try out the AI assistant functionality
              </li>
            </ul>
          </div>

          <div className="ring-2 ring-blue-600 rounded-3xl p-8">
            <h3 className="text-lg font-semibold leading-8 text-blue-600">
              Pro Plan
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximum productivity with PRO features
            </p>

            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                R$14,99
              </span>
              <span className="text-base font-semibold leading-6 text-gray-600">
                / month
              </span>
            </p>

            <Button
              onClick={handleUpgrade}
              disabled={loading || isPending}
              className="bg-blue-600 w-full text-white shadow-sm hover:bg-blue-500 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isPending || loading
                ? "Loading..."
                : hasActiveMembership
                ? "Manage Plan"
                : "Upgrade to Pro"}
            </Button>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                Store up to 20 documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                Ability to delete documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                Up to 100 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                Full Power AI chat functionality with memory recall
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                Advanced analytics
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                24/7 support response time
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Pricing;
