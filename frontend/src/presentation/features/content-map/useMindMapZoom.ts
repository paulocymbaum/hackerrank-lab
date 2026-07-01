import { useCallback, useEffect, useRef } from "react";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import "d3-transition";

type MindMapZoomOptions = {
  contentWidth: number;
  contentHeight: number;
  rootFocusRect?: MindMapFocusRect | null;
  enabled?: boolean;
};

export type MindMapFocusRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function applyTransform(surface: HTMLDivElement, transform: ZoomTransform) {
  surface.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`;
}

function isNodeTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest("[data-mindmap-node]"));
}

const FIT_WIDTH_MARGIN = 0.92;
const FIT_MAX_SCALE = 1;
const ROOT_VIEWPORT_MARGIN_X = 48;
const FOCUS_MAX_SCALE = 1.05;
const FOCUS_FILL_FACTOR = 0.35;
const FOCUS_PADDING = 128;

function computeDefaultScale(viewportWidth: number, contentWidth: number): number {
  return Math.min(FIT_MAX_SCALE, (viewportWidth * FIT_WIDTH_MARGIN) / contentWidth);
}

function computeRootHomeTransform(
  viewport: HTMLDivElement,
  rootRect: MindMapFocusRect,
  contentWidth: number,
): ZoomTransform {
  const viewportWidth = viewport.clientWidth;
  const viewportHeight = viewport.clientHeight;
  const scale = computeDefaultScale(viewportWidth, contentWidth);
  const anchorY = rootRect.y + rootRect.height / 2;

  return zoomIdentity
    .translate(ROOT_VIEWPORT_MARGIN_X - rootRect.x * scale, viewportHeight / 2 - anchorY * scale)
    .scale(scale);
}

function computeFocusTransform(
  viewport: HTMLDivElement,
  rect: MindMapFocusRect,
  scaleExtent: [number, number],
): ZoomTransform {
  const viewportWidth = viewport.clientWidth;
  const viewportHeight = viewport.clientHeight;
  const fillScale = Math.min(
    (viewportWidth - FOCUS_PADDING * 2) / rect.width,
    (viewportHeight - FOCUS_PADDING * 2) / rect.height,
  );
  const scale = Math.min(
    FOCUS_MAX_SCALE,
    scaleExtent[1],
    Math.max(scaleExtent[0], fillScale * FOCUS_FILL_FACTOR),
  );
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  return zoomIdentity
    .translate(viewportWidth / 2 - centerX * scale, viewportHeight / 2 - centerY * scale)
    .scale(scale);
}

export function useMindMapZoom(options: MindMapZoomOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<HTMLDivElement, unknown> | null>(null);
  const contentSizeRef = useRef({ width: options.contentWidth, height: options.contentHeight });
  const rootFocusRectRef = useRef(options.rootFocusRect);
  contentSizeRef.current = { width: options.contentWidth, height: options.contentHeight };
  rootFocusRectRef.current = options.rootFocusRect;

  const centerView = useCallback((animated = true) => {
    const viewport = viewportRef.current;
    const behavior = zoomBehaviorRef.current;
    const rootRect = rootFocusRectRef.current;
    if (!viewport || !behavior || !rootRect) return;

    const { width } = contentSizeRef.current;
    const transform = computeRootHomeTransform(viewport, rootRect, width);
    const selection = select(viewport);
    if (animated) {
      selection.transition().duration(300).call(behavior.transform, transform);
    } else {
      selection.call(behavior.transform, transform);
    }
  }, []);

  const zoomToRect = useCallback((rect: MindMapFocusRect, animated = true) => {
    const viewport = viewportRef.current;
    const behavior = zoomBehaviorRef.current;
    if (!viewport || !behavior) return;

    const transform = computeFocusTransform(viewport, rect, behavior.scaleExtent() as [number, number]);
    const selection = select(viewport);
    if (animated) {
      selection.transition().duration(300).call(behavior.transform, transform);
    } else {
      selection.call(behavior.transform, transform);
    }
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const surface = surfaceRef.current;
    if (!viewport || !surface || options.enabled === false) return;

    const behavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.2, 3])
      .filter((event) => {
        if (event.type === "wheel") return true;
        if (isNodeTarget(event.target)) return false;
        return event.type === "mousedown" || event.type === "touchstart";
      })
      .on("zoom", (event) => {
        applyTransform(surface, event.transform);
      });

    const selection = select(viewport);
    selection.call(behavior);
    zoomBehaviorRef.current = behavior;

    centerView(false);

    const observer = new ResizeObserver(() => centerView(false));
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      selection.on(".zoom", null);
      zoomBehaviorRef.current = null;
    };
  }, [options.enabled, centerView]);

  return { viewportRef, surfaceRef, centerView, zoomToRect };
}