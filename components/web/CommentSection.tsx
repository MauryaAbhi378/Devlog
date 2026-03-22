"use client";

import { useQuery } from "convex/react";
import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { createCommentAction, type CommentActionState } from "@/app/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type CommentSectionProps = {
  postId: Id<"posts">;
};

const initialState: CommentActionState = {};

export default function CommentSection({ postId }: CommentSectionProps) {
  const comments = useQuery(api.comments.getCommentsByPostId, { postId });
  const { data: session } = authClient.useSession();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createCommentAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Comments
          {comments !== undefined && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      <Separator className="opacity-20" />

      {/* Add Comment Form */}
      {session ? (
        <Card className="border border-white/10 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Leave a comment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-3">
              <input type="hidden" name="postId" value={postId} />
              <Textarea
                name="content"
                placeholder="Share your thoughts…"
                className="resize-none"
                rows={3}
                minLength={3}
                maxLength={500}
                disabled={isPending}
                required
              />
              {state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              {state.success && (
                <p className="text-sm text-green-500">Comment posted!</p>
              )}
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Posting…" : "Post Comment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-white/10 bg-card/80 backdrop-blur">
          <CardContent className="py-5 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>{" "}
            to leave a comment.
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments === undefined && (
          <>
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="animate-pulse border border-white/10 bg-card/80 backdrop-blur"
              >
                <CardContent className="py-4">
                  <div className="mb-2 h-3 w-28 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="mt-1 h-3 w-3/4 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {comments?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}

        {comments?.map((comment) => (
          <Card
            key={comment._id}
            className="border border-white/10 bg-card/80 backdrop-blur"
          >
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {comment.authorName?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment._creationTime).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {comment.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
