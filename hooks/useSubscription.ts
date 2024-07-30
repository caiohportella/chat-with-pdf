"use client";

import { db } from "@/lib/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

 const PRO_LIMIT = 20;
 const FREE_LIMIT = 2;

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState<
    boolean | null
  >(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  const userDocRef = user ? doc(db, "users", user.id) : null;
  const userFilesCollectionRef = user
    ? collection(db, "users", user.id, "files")
    : null;

  const [snapshot, loading, error] = useDocument(userDocRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const [filesSnapshot, filesLoading] = useCollection(userFilesCollectionRef);

  useEffect(() => {
   if(snapshot && snapshot.exists()){
     const data = snapshot.data();

     console.log("--- DATA: ", data);

     setHasActiveMembership(data?.hasActiveMembership ?? false);
   }
  }, [snapshot]);

  useEffect(() => {
    if (!filesSnapshot || hasActiveMembership === null) return;

    const files = filesSnapshot.docs;
    const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    console.log(
      "Checking if user is over file limit",
      files.length,
      usersLimit
    );

    console.log(hasActiveMembership, PRO_LIMIT, FREE_LIMIT);

    setIsOverFileLimit(files.length >= usersLimit);
  }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);

  return { hasActiveMembership, loading, error, isOverFileLimit, filesLoading };
}

export default useSubscription;
