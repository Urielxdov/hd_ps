'use client';

import { useState, useEffect } from 'react';
import type { HDComment } from '../types';
import { getComments, addComment } from '../api/helpdesk.api';

interface CommentThreadProps {
  helpDeskId: number;
  showInternal?: boolean;
}

export default function CommentThread({ helpDeskId, showInternal = false }: CommentThreadProps) {
  const [comments, setComments] = useState<HDComment[]>([]);
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadComments() {
    try {
      const data = await getComments(helpDeskId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [helpDeskId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await addComment(helpDeskId, content.trim(), isInternal);
      setContent('');
      setIsInternal(false);
      await loadComments();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">Comentarios</h3>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-400">Sin comentarios aun</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-lg text-sm ${
                c.es_interno
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-slate-50 border border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-700">
                  {c.autor_id ? `Usuario #${c.autor_id}` : 'Sistema'}
                </span>
                <div className="flex items-center gap-2">
                  {c.es_interno && (
                    <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                      Interno
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(c.created_at).toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 whitespace-pre-wrap">{c.contenido}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un comentario..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex items-center justify-between">
          {showInternal && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-slate-300"
              />
              Comentario interno
            </label>
          )}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="ml-auto px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}
