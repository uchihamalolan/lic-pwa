import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useLocation } from "wouter";

export type NavigateOptions = {
  replace?: boolean;
  direction?: "forward" | "backward";
};

export function useNavigate() {
  const [currentLocation, setLocation] = useLocation();

  const navigate = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (to === currentLocation) return;

      // Determine direction: explicit > inferred from route depth
      const direction: "forward" | "backward" =
        options?.direction ??
        (to.startsWith(currentLocation) && to !== currentLocation ? "forward" : "backward");

      const navOptions = {
        ...options,
        transition: true,
      };

      const updateDOM = () => {
        flushSync(() => {
          setLocation(to, navOptions);
        });
      };

      // Fallback if View Transitions API is not supported
      if (!document.startViewTransition) {
        updateDOM();
        return;
      }

      const transition = document.startViewTransition(updateDOM);

      const isForward = direction === "forward";

      const oldKeyframes: Keyframe[] = [
        { transform: "translateX(0%)" },
        { transform: isForward ? "translateX(-100%)" : "translateX(100%)" },
      ];

      const newKeyframes: Keyframe[] = [
        { transform: isForward ? "translateX(100%)" : "translateX(-100%)" },
        { transform: "translateX(0%)" },
      ];

      const animationOptions: KeyframeAnimationOptions = {
        duration: 380,
        easing: "cubic-bezier(0.24, 1, 0.4, 1)",
        fill: "both",
      };

      // Execute WAAPI inside transition.ready with error guard
      void (async () => {
        try {
          await transition.ready;

          document.documentElement.animate(oldKeyframes, {
            ...animationOptions,
            pseudoElement: "::view-transition-old(root)",
          });

          document.documentElement.animate(newKeyframes, {
            ...animationOptions,
            pseudoElement: "::view-transition-new(root)",
          });
        } catch {
          // Transition was skipped or aborted; ignore
        }
      })();
    },
    [currentLocation, setLocation],
  );

  return navigate;
}
