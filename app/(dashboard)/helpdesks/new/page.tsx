'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Department, ServiceCategory, Service, Origen, Prioridad } from '@/lib/types';
import { ORIGEN_LABELS, PRIORIDAD_LABELS } from '@/lib/types';

type Step = 1 | 2 | 3 | 4;

export default function CrearHelpDesk() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Step 2
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<ServiceCategory | null>(null);

  // Step 3
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Step 4
  const [origen, setOrigen] = useState<Origen>('solicitud');
  const [prioridad, setPrioridad] = useState<Prioridad>('media');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    api.getDepartments().then(setDepartments);
  }, []);

  useEffect(() => {
    if (selectedDept) {
      api.getDepartmentCategories(selectedDept.id).then(setCategories);
      setSelectedCat(null);
      setSelectedService(null);
    }
  }, [selectedDept]);

  useEffect(() => {
    if (selectedCat) {
      api.getCategoryServices(selectedCat.id).then(setServices);
      setSelectedService(null);
    }
  }, [selectedCat]);

  async function handleSubmit() {
    if (!selectedService) return;
    setSubmitting(true);
    setError('');
    try {
      const hd = await api.createHelpDesk({
        service: selectedService.id,
        origen,
        prioridad,
        descripcion_problema: descripcion,
      });
      router.push(`/helpdesks/${hd.id}`);
    } catch {
      setError('Error al crear el ticket. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = ['Departamento', 'Categoria', 'Servicio', 'Detalles'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Nuevo Help Desk</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = step === stepNum;
          const isPast = step > stepNum;
          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-blue-600 text-white' : isPast ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isPast ? '\u2713' : stepNum}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold text-blue-600' : 'text-slate-500'}`}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 mt-[-16px] ${i < step - 1 ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {/* Step 1: Departamento */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Selecciona un departamento</h2>
            {departments.length === 0 ? (
              <p className="text-slate-400 text-sm">Cargando departamentos...</p>
            ) : (
              <div className="grid gap-2">
                {departments.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDept(d);
                      setStep(2);
                    }}
                    className={`text-left p-4 rounded-lg border transition-colors ${
                      selectedDept?.id === d.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-medium text-slate-800">{d.nombre}</span>
                    {d.descripcion && (
                      <p className="text-sm text-slate-500 mt-0.5">{d.descripcion}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Categoria */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Selecciona una categoria
              <span className="text-sm font-normal text-slate-500 ml-2">({selectedDept?.nombre})</span>
            </h2>
            {categories.length === 0 ? (
              <p className="text-slate-400 text-sm">No hay categorias disponibles</p>
            ) : (
              <div className="grid gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCat(c);
                      setStep(3);
                    }}
                    className="text-left p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-800">{c.nombre}</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline mt-4">
              &larr; Volver
            </button>
          </div>
        )}

        {/* Step 3: Servicio */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Selecciona un servicio
              <span className="text-sm font-normal text-slate-500 ml-2">({selectedCat?.nombre})</span>
            </h2>
            {services.length === 0 ? (
              <p className="text-slate-400 text-sm">No hay servicios disponibles</p>
            ) : (
              <div className="grid gap-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedService(s);
                      setStep(4);
                    }}
                    className="text-left p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-medium text-slate-800">{s.nombre}</div>
                    {s.descripcion && (
                      <p className="text-sm text-slate-500 mt-0.5">{s.descripcion}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      Tiempo estimado: {s.tiempo_estimado_default}h
                    </p>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setStep(2)} className="text-sm text-blue-600 hover:underline mt-4">
              &larr; Volver
            </button>
          </div>
        )}

        {/* Step 4: Detalles */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Detalles del ticket
              <span className="text-sm font-normal text-slate-500 ml-2">({selectedService?.nombre})</span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
              <select
                value={origen}
                onChange={(e) => setOrigen(e.target.value as Origen)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(ORIGEN_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(PRIORIDAD_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripcion del problema</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe el problema con detalle..."
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(3)} className="text-sm text-blue-600 hover:underline">
                &larr; Volver
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !descripcion.trim()}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Creando...' : 'Crear Help Desk'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
