"use client"

import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type Props = {
  roomId: Id<"posts">;
  userId: string;
};

export function PostPresence({ roomId, userId }: Props) {
  const presenceState = usePresence(api.presence, roomId, userId);

  if (!presenceState || presenceState.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p>Viewing now</p>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        <FacePile presenceState={presenceState ?? []} />
      </div>
    </div>
  );
}
