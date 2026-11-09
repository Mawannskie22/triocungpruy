"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import type { MarkerClusterGroup } from "leaflet.markercluster";
import type { Report } from "@/types/report";
import { mapIconSvg } from "@/components/map/map-icons";

type Coordinates = { latitude: number; longitude: number };
type Props =
  | { mode: "browse"; reports: Report[]; onSelect: (id: string) => void }
  | { mode: "pick"; point?: Coordinates; onPick: (point: Coordinates) => void };

const JAKARTA: [number, number] = [-6.201, 106.835];
const JAKARTA_VIEW: [[number, number], [number, number]] = [
  [-6.345, 106.735],
  [-6.105, 106.955],
];

export function ReportMapCanvas(props: Props) {
  const elementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const clusterRef = useRef<MarkerClusterGroup | null>(null);
  const pinRef = useRef<LeafletMarker | null>(null);
  const onSelectRef = useRef<(id: string) => void>(() => {});
  const onPickRef = useRef<(point: Coordinates) => void>(() => {});
  const [tileError, setTileError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (props.mode === "browse") onSelectRef.current = props.onSelect;
    else onPickRef.current = props.onPick;
  });

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;
    async function initialize() {
      const L = await import("leaflet");
      const cluster = props.mode === "browse" ? await import("leaflet.markercluster") : null;
      if (cancelled || !elementRef.current) return;
      leafletRef.current = L;
      map = L.map(elementRef.current, {
        center:
          props.mode === "pick" && props.point
            ? [props.point.latitude, props.point.longitude]
            : JAKARTA,
        zoom: props.mode === "browse" ? 13 : props.point ? 15 : 12,
        minZoom: props.mode === "browse" ? 12 : 10,
        maxZoom: 18,
        maxBounds: props.mode === "browse" ? JAKARTA_VIEW : undefined,
        maxBoundsViscosity: 1,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapRef.current = map;
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      let failedTiles = 0;
      tiles.on("tileerror", () => {
        failedTiles += 1;
        if (failedTiles >= 3) setTileError(true);
      });
      tiles.addTo(map);
      if (cluster) {
        const markers = new cluster.MarkerClusterGroup({
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          iconCreateFunction: (group) =>
            L.divIcon({
              className: "map-cluster-icon",
              html: `<span>${group.getChildCount()}</span>`,
              iconSize: [42, 42],
            }),
        });
        map.addLayer(markers as unknown as import("leaflet").Layer);
        clusterRef.current = markers;
      } else {
        map.on("click", (event) => {
          onPickRef.current({ latitude: event.latlng.lat, longitude: event.latlng.lng });
        });
      }
      requestAnimationFrame(() => map?.invalidateSize());
      setReady(true);
    }
    void initialize().catch(() => setTileError(true));
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      clusterRef.current = null;
      pinRef.current = null;
    };
    // Map initialization should run once per mode; marker updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode]);

  useEffect(() => {
    if (props.mode !== "browse") return;
    const L = leafletRef.current;
    const cluster = clusterRef.current;
    if (!L || !cluster) return;
    cluster.clearLayers();
    props.reports.forEach((report) => {
      if (!report.coordinates) return;
      const marker = L.marker([report.coordinates.latitude, report.coordinates.longitude], {
        icon: L.divIcon({
          className: "map-marker-icon",
          html: `<span>${mapIconSvg(report.category)}</span>`,
          iconSize: [42, 48],
          iconAnchor: [21, 44],
        }),
        title: report.category,
        keyboard: true,
      });
      marker.on("click", () => onSelectRef.current(report.id));
      cluster.addLayer(marker);
    });
  }, [props, ready]);

  useEffect(() => {
    if (props.mode !== "pick") return;
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (pinRef.current) {
      pinRef.current.remove();
      pinRef.current = null;
    }
    if (!props.point) return;
    pinRef.current = L.marker([props.point.latitude, props.point.longitude], {
      icon: L.divIcon({
        className: "map-picker-icon",
        html: '<span aria-hidden="true"></span>',
        iconSize: [30, 40],
        iconAnchor: [15, 38],
      }),
    }).addTo(map);
    map.panTo([props.point.latitude, props.point.longitude]);
  }, [props, ready]);

  return (
    <div className="map-canvas-wrap">
      <div
        ref={elementRef}
        className={`report-map-canvas ${props.mode === "pick" ? "report-map-canvas--picker" : ""}`}
        aria-label={
          props.mode === "pick"
            ? "Pilih titik lokasi laporan pada peta Jakarta"
            : "Peta laporan Jakarta"
        }
      />
      {tileError && (
        <p className="map-tile-error" role="status">
          Peta dasar gagal dimuat. Data laporan tetap tersedia di daftar.
        </p>
      )}
    </div>
  );
}
