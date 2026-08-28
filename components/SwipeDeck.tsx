"use client";

import { useCallback, useRef, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

const THRESHOLD = 96;

export function SwipeDeck({
  projects,
  onSwipe,
}: {
  projects: Project[];
  onSwipe: (project: Project, dir: "left" | "right") => void;
}) {
  const top = projects[0];
  const next = projects[1];
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0 });
  const deltaRef = useRef({ x: 0, y: 0 });
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);

  const finish = useCallback(
    (dir: "left" | "right") => {
      if (!top || exiting) return;
      setExiting(dir);
      window.setTimeout(() => {
        onSwipe(top, dir);
        deltaRef.current = { x: 0, y: 0 };
        setDelta({ x: 0, y: 0 });
        setExiting(null);
      }, 240);
    },
    [exiting, onSwipe, top],
  );

  if (!top) return null;

  const x = exiting === "right" ? 480 : exiting === "left" ? -480 : delta.x;
  const y = exiting ? delta.y * 0.2 : delta.y;
  const rot = x / 18;
  const stamp: "ship" | "skip" | null =
    x > 36 ? "ship" : x < -36 ? "skip" : null;

  return (
    <div className="relative mx-auto h-[min(62dvh,520px)] w-full max-w-[420px]">
      {next ? (
        <div className="absolute inset-0 origin-bottom scale-[0.96] translate-y-3 opacity-70">
          <ProjectCard project={next} />
        </div>
      ) : null}

      <div
        className="absolute inset-0 touch-none select-none"
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
          transition: dragging.current || exiting ? "none" : "transform 180ms ease",
        }}
        onPointerDown={(event) => {
          if (exiting) return;
          dragging.current = true;
          origin.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          const next = {
            x: event.clientX - origin.current.x,
            y: event.clientY - origin.current.y,
          };
          deltaRef.current = next;
          setDelta(next);
        }}
        onPointerUp={() => {
          dragging.current = false;
          const x = deltaRef.current.x;
          if (x > THRESHOLD) finish("right");
          else if (x < -THRESHOLD) finish("left");
          else {
            deltaRef.current = { x: 0, y: 0 };
            setDelta({ x: 0, y: 0 });
          }
        }}
      >
        <ProjectCard project={top} stamp={stamp} />
      </div>
    </div>
  );
}
