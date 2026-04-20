'use client';

import { use } from 'react';
import Link from 'next/link';
import { useDepartmentList } from '@/lib/department';
import DepartmentInfoCard from './_components/DepartmentInfoCard';
import TechniciansSection from './_components/TechniciansSection';
import SLAConfigCard from './_components/SLAConfigCard';

export default function DepartmentPanel({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const deptId = Number(id);

  const { state, load: reloadDepts } = useDepartmentList();
  const department = state.items.find((d) => d.id === deptId);

  if (state.loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="space-y-4">
        <Link href="/admin/departments" className="text-sm text-slate-500 hover:text-slate-700">
          ← Departamentos
        </Link>
        <p className="text-slate-500">Departamento no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/departments" className="text-sm text-slate-500 hover:text-slate-700">
          ← Departamentos
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-2xl font-bold text-slate-900">{department.name}</h1>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          department.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {department.active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DepartmentInfoCard department={department} onSaved={reloadDepts} />
        </div>
        <div className="lg:col-span-2">
          <TechniciansSection departmentId={deptId} />
        </div>
      </div>

      <SLAConfigCard departmentId={deptId} />
    </div>
  );
}
