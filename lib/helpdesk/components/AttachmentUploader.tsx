'use client';

import { useState } from 'react';
import type { HDAttachment } from '../types';
import { uploadAttachment, addUrlAttachment, deleteAttachment } from '../api/helpdesk.api';

interface AttachmentUploaderProps {
  helpDeskId: number;
  attachments: HDAttachment[];
  onUpdate: () => void;
}

export default function AttachmentUploader({ helpDeskId, attachments, onUpdate }: AttachmentUploaderProps) {
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [urlName, setUrlName] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadAttachment(helpDeskId, file, file.name);
      onUpdate();
    } catch {
      alert('Error al subir archivo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!urlName.trim() || !urlValue.trim()) return;
    setUploading(true);
    try {
      await addUrlAttachment(helpDeskId, urlName.trim(), urlValue.trim());
      setUrlName('');
      setUrlValue('');
      onUpdate();
    } catch {
      alert('Error al agregar URL');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(attachmentId: number) {
    if (!confirm('Eliminar este adjunto?')) return;
    try {
      await deleteAttachment(helpDeskId, attachmentId);
      onUpdate();
    } catch {
      alert('Error al eliminar adjunto');
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">Adjuntos</h3>

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((att) => (
            <li key={att.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-1.5 py-0.5 rounded ${att.tipo === 'archivo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {att.tipo === 'archivo' ? 'Archivo' : 'URL'}
                </span>
                {att.tipo === 'url' ? (
                  <a href={att.valor} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {att.nombre}
                  </a>
                ) : (
                  <span className="text-slate-700">{att.nombre}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(att.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`text-xs px-3 py-1 rounded-lg ${mode === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          Archivo
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`text-xs px-3 py-1 rounded-lg ${mode === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          URL
        </button>
      </div>

      {mode === 'file' ? (
        <div>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <p className="text-xs text-slate-400 mt-1">Subiendo...</p>}
        </div>
      ) : (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Nombre"
            value={urlName}
            onChange={(e) => setUrlName(e.target.value)}
            className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="https://..."
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Agregar
          </button>
        </form>
      )}
    </div>
  );
}
