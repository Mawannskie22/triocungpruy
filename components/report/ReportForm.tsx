"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/data/categories";
import { saveReport } from "@/lib/reports";
import {
  validateAddress,
  validateCategory,
  validateDescription,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/validation";
import type { ReportCategory } from "@/types/report";

type Draft = {
  description: string;
  category: ReportCategory | "";
  address: string;
  coordinates?: { latitude: number; longitude: number };
  photo?: string;
};
const initialDraft: Draft = { description: "", category: "", address: "" };

export function ReportForm() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  function next() {
    const message =
      step === 1 ? validateDescription(draft.description) : validateCategory(draft.category);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep(step + 1);
  }

  function choosePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Pilih file gambar untuk foto laporan.");
      return;
    }
    if (file.size > 1_000_000) {
      setError("Ukuran foto maksimal 1 MB untuk demo ini. Pilih foto yang lebih kecil.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((current) => ({ ...current, photo: reader.result as string }));
        setError("");
      }
    };
    reader.onerror = () => setError("Foto gagal dibaca. Coba pilih foto lain.");
    reader.readAsDataURL(file);
  }

  function useLocation() {
    if (!navigator.geolocation) {
      setError("GPS tidak tersedia. Isi alamat secara manual.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setDraft((current) => ({
          ...current,
          coordinates: { latitude: coords.latitude, longitude: coords.longitude },
          address:
            current.address || `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
        }));
        setIsLocating(false);
        setError("");
      },
      () => {
        setIsLocating(false);
        setError("Lokasi tidak dapat diakses. Isi alamat secara manual.");
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  function submit() {
    const message = validateAddress(draft.address);
    if (message) {
      setError(message);
      return;
    }
    if (!draft.category) {
      setStep(2);
      setError("Pilih kategori laporan.");
      return;
    }
    const result = saveReport({
      description: draft.description.trim(),
      category: draft.category,
      address: draft.address.trim(),
      coordinates: draft.coordinates,
      photo: draft.photo,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setTicket(result.data.id);
    setError("");
  }

  if (ticket)
    return (
      <div className="container form-shell">
        <div className="success-panel">
          <span className="success-icon" aria-hidden="true">
            ✓
          </span>
          <span className="eyebrow">LAPORAN TERSIMPAN</span>
          <h2>Terima kasih sudah bersuara.</h2>
          <p>
            Simpan nomor tiket ini. Kamu akan membutuhkannya untuk melihat laporan di perangkat ini.
          </p>
          <div className="ticket-code">{ticket}</div>
          <div className="form-actions">
            <Link
              href={`/status?ticket=${encodeURIComponent(ticket)}`}
              className="button button-primary"
            >
              Cek Status <span aria-hidden="true">↗</span>
            </Link>
            <button
              className="button button-quiet"
              type="button"
              onClick={() => {
                setDraft(initialDraft);
                setTicket("");
                setStep(1);
              }}
            >
              Buat laporan lain
            </button>
          </div>
          <p className="demo-note">
            Data simulasi. Laporan ini hanya tersimpan di browser perangkat ini dan belum dikirim ke
            instansi.
          </p>
        </div>
      </div>
    );

  return (
    <div className="container form-shell">
      <div className="progress-list" aria-label={`Langkah ${step} dari 3`}>
        {["Ceritakan", "Kategori", "Lokasi"].map((label, index) => (
          <div key={label} className={`progress-item ${step >= index + 1 ? "active" : ""}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
      <div className="form-panel">
        {step === 1 && (
          <div>
            <span className="eyebrow">LANGKAH 01 / 03</span>
            <h2>Apa yang terjadi?</h2>
            <p>Beri cerita yang cukup supaya masalahnya mudah dipahami.</p>
            <label className="field-label" htmlFor="description">
              Ceritakan masalah <span>*</span>
            </label>
            <textarea
              id="description"
              rows={6}
              maxLength={MAX_DESCRIPTION_LENGTH}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              placeholder="Contoh: Lampu jalan di depan halte sudah mati tiga malam..."
            />
            <div className="field-hint">
              {draft.description.length}/{MAX_DESCRIPTION_LENGTH} karakter · minimal 10 karakter
            </div>
            <label className="field-label" htmlFor="photo">
              Foto pendukung <small>(opsional)</small>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(event) => choosePhoto(event.target.files?.[0])}
            />
            <div className="field-hint">
              JPG, PNG, atau gambar lain, maksimal 1 MB. {draft.photo ? "Foto siap disimpan." : ""}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <span className="eyebrow">LANGKAH 02 / 03</span>
            <h2>Masuk kategori apa?</h2>
            <p>Pilih yang paling mendekati. Kalau tidak ada, pilih Lainnya.</p>
            <div className="category-grid">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`category-option ${draft.category === category.id ? "selected" : ""}`}
                  aria-pressed={draft.category === category.id}
                  onClick={() => {
                    setDraft({ ...draft, category: category.id });
                    setError("");
                  }}
                >
                  <span aria-hidden="true">{category.icon}</span>
                  <strong>{category.label}</strong>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <span className="eyebrow">LANGKAH 03 / 03</span>
            <h2>Di mana lokasinya?</h2>
            <p>
              Tulis alamat atau patokan yang mudah ditemukan. GPS hanya dipakai jika kamu
              memilihnya.
            </p>
            <label className="field-label" htmlFor="address">
              Alamat atau patokan lokasi <span>*</span>
            </label>
            <textarea
              id="address"
              rows={3}
              value={draft.address}
              onChange={(event) =>
                setDraft({ ...draft, address: event.target.value, coordinates: undefined })
              }
              placeholder="Contoh: Jl. Sudirman dekat halte, Jakarta Pusat"
            />
            <button
              type="button"
              className="location-button"
              onClick={useLocation}
              disabled={isLocating}
            >
              {isLocating ? "Mengambil lokasi..." : "◎ Gunakan lokasi perangkat"}
            </button>
            {draft.coordinates && (
              <p className="field-hint">
                Koordinat tercatat: {draft.coordinates.latitude.toFixed(5)},{" "}
                {draft.coordinates.longitude.toFixed(5)}
              </p>
            )}
            <div className="privacy-note">
              Lokasi hanya dipakai untuk menandai titik laporan. Kamu boleh mengisi alamat manual.
            </div>
          </div>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="button button-quiet"
              onClick={() => {
                setStep(step - 1);
                setError("");
              }}
            >
              ← Kembali
            </button>
          )}
          <button
            type="button"
            className="button button-primary"
            onClick={step === 3 ? submit : next}
          >
            {step === 3 ? "Kirim Laporan" : "Lanjutkan"} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <p className="demo-note">
        Data simulasi untuk demo. Laporan disimpan di browser ini, bukan dikirim ke pemerintah.
      </p>
    </div>
  );
}
