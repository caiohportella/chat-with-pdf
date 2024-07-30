"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

export const createCheckoutSession = async (userDetails: UserDetails) => {
  auth().protect();

  const { userId } = await auth();

  if (!userId) throw new Error("Missing user ID");

  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();
  stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    await adminDb
      .collection("users")
      .doc(userId)
      .set({ stripeCustomerId: customer.id });

    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    payment_method_types: ["card", "boleto"],
    allow_promotion_codes: true,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/upgrade`,
  });

  return session.id;
};
