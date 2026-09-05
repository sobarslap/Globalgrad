"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { MapUniversity } from "@/lib/data/map";

/**
 * Interactive university map (Leaflet + OpenStreetMap, no API key).
 * Leaflet is imported dynamically inside the effect so it never runs during SSR
 * (it touches `window` at import time). Markers use a lightweight emoji divIcon,
 * which avoids Leaflet's default-marker image-path breakage under bundlers.
 */
export function UniversityMap({ universities }: { universities: MapUniversity[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        worldCopyJump: true,
      }).setView([25, 10], 2);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      const bounds: [number, number][] = [];
      for (const u of universities) {
        const icon = L.divIcon({
          className: "",
          html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))">${u.flagEmoji ?? "📍"}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const marker = L.marker([u.latitude, u.longitude], { icon }).addTo(map);
        const cityLine = u.city ? `${u.city}, ` : "";
        marker.bindPopup(
          `<strong>${u.name}</strong><br/>${cityLine}${u.countryName ?? ""}` +
            `<br/>${u.programCount} program${u.programCount === 1 ? "" : "s"}`,
        );
        bounds.push([u.latitude, u.longitude]);
      }
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
      }
      setReady(true);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [universities]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60">
      <div ref={containerRef} className="h-[520px] w-full bg-muted" aria-label="Map of universities" />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Loading map…
        </div>
      )}
    </div>
  );
}
