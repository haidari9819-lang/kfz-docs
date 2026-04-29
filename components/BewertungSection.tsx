"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Bewertung = {
  id: string;
  sterne: number;
  name: string;
  text: string;
  erstellt_at: string;
};

export default function BewertungSection({ stadtSlug, stadtName }: { stadtSlug: string; stadtName: string }) {
  const [bewertungen, setBewertungen] = useState<Bewertung[]>([]);
  const [sterne, setSterne] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"done"|"error">("idle");

  useEffect(() => {
    fetch(`/api/bewertungen?stadt=${stadtSlug}`)
      .then(r => r.json())
      .then(setBewertungen);
  }, [stadtSlug]);

  const durchschnitt = bewertungen.length
    ? (bewertungen.reduce((a, b) => a + b.sterne, 0) / bewertungen.length).toFixed(1)
    : null;

  async function absenden() {
    if (!sterne || !name.trim() || !text.trim()) return;
    setStatus("sending");
    const res = await fetch("/api/bewertungen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stadt_slug: stadtSlug, sterne, name, text }),
    });
    if (res.ok) {
      setStatus("done");
      setSterne(0); setName(""); setText("");
      const updated = await fetch(`/api/bewertungen?stadt=${stadtSlug}`).then(r => r.json());
      setBewertungen(updated);
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mb-14">
      <h2 className="text-2xl font-bold text-[#111111] mb-2">
        Bewertungen — KFZ-Docs {stadtName}
      </h2>

      {durchschnitt && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl font-bold text-[#2563eb]">{durchschnitt}</span>
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={18}
                className={parseFloat(durchschnitt) >= i ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
            ))}
          </div>
          <span className="text-sm text-gray-400">({bewertungen.length} Bewertungen)</span>
        </div>
      )}

      {/* Bestehende Bewertungen */}
      {bewertungen.length > 0 && (
        <div className="space-y-4 mb-8">
          {bewertungen.map(b => (
            <div key={b.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={13}
                      className={b.sterne >= i ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
                <span className="text-sm font-medium text-[#111111]">{b.name}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(b.erstellt_at).toLocaleDateString("de-DE")}
                </span>
              </div>
              <p className="text-sm text-gray-600">{b.text}</p>
            </div>
          ))}
        </div>
      )}

      {bewertungen.length === 0 && (
        <p className="text-gray-400 text-sm mb-6">Noch keine Bewertungen. Sei der Erste!</p>
      )}

      {/* Formular */}
      {status === "done" ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm font-medium">
          Danke für deine Bewertung! ✓
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <p className="font-medium text-[#111111] mb-3 text-sm">Jetzt bewerten:</p>

          {/* Sterne */}
          <div className="flex gap-1 mb-4">
            {[1,2,3,4,5].map(i => (
              <button key={i}
                onClick={() => setSterne(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none">
                <Star size={28}
                  className={(hover || sterne) >= i
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200 fill-gray-200"} />
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Dein Name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[#2563eb]"
          />
          <textarea
            placeholder="Deine Erfahrung..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[#2563eb] resize-none"
          />
          {status === "error" && (
            <p className="text-red-500 text-xs mb-2">Fehler beim Speichern. Bitte erneut versuchen.</p>
          )}
          <button
            onClick={absenden}
            disabled={!sterne || !name.trim() || !text.trim() || status === "sending"}
            className="bg-[#2563eb] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40">
            {status === "sending" ? "Wird gespeichert..." : "Bewertung abschicken"}
          </button>
        </div>
      )}
    </div>
  );
}
