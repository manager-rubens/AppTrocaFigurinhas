"use client";

import { useMemo, useState } from "react";
import { Clock, Home, MessageCircle } from "lucide-react";
import { feedTypeLabel, formatDateTime } from "@/lib/format";
import type { FeedRecord, FeedType } from "@/types";

type FeedTabsProps = {
  repeated: FeedRecord[];
  needed: FeedRecord[];
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function FeedItem({ record }: { record: FeedRecord }) {
  const updated = record.updatedAt !== record.createdAt;

  return (
    <article className={record.tipo === "precisa" ? "feed-item feed-item--need" : "feed-item"}>
      <div className="feed-item__top">
        <div className="neighbor">
          <div className="neighbor__avatar" aria-hidden>
            {initials(record.nome)}
          </div>
          <div className="neighbor__body">
            <div className="neighbor__name">{record.nome}</div>
            <div className="neighbor__home">
              <Home size={13} aria-hidden />
              {record.casaLote}
            </div>
          </div>
        </div>
        <div className="feed-item__date">
          {updated ? "Atualizado em" : "Publicado em"}
          <strong>{formatDateTime(updated ? record.updatedAt : record.createdAt)}</strong>
        </div>
      </div>

      <div className="feed-item__bottom">
        <span className="type-label">{feedTypeLabel(record.tipo)}</span>
        <a className="whatsapp-link" href={`https://wa.me/${record.whatsapp}`} target="_blank" rel="noreferrer">
          <MessageCircle size={15} aria-hidden />
          WhatsApp
        </a>
      </div>

      <div className="feed-item__time">
        <Clock size={13} aria-hidden />
        Criado em {formatDateTime(record.createdAt)}
      </div>
    </article>
  );
}

export function FeedTabs({ repeated, needed }: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<FeedType>("tem_repetida");
  const records = useMemo(
    () => (activeTab === "tem_repetida" ? repeated : needed),
    [activeTab, needed, repeated]
  );

  return (
    <section className="panel" id="feed" aria-label="Feed de trocas">
      <div className="feed-tabs" role="tablist" aria-label="Tipo de registro">
        <button
          className="feed-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === "tem_repetida"}
          onClick={() => setActiveTab("tem_repetida")}
        >
          Tenho repetida <span className="feed-count">{repeated.length}</span>
        </button>
        <button
          className="feed-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === "precisa"}
          onClick={() => setActiveTab("precisa")}
        >
          Preciso <span className="feed-count">{needed.length}</span>
        </button>
      </div>

      <div className="feed-list" role="tabpanel">
        {records.length > 0 ? (
          records.map((record) => <FeedItem key={record.id} record={record} />)
        ) : (
          <div className="empty-state">Ainda nao ha registros nessa coluna.</div>
        )}
      </div>
    </section>
  );
}
