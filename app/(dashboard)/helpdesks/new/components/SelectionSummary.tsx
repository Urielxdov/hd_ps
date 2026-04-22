interface Department {
  id: number;
  name: string;
  description?: string;
}

interface Service {
  id: number;
  name: string;
  description?: string;
}

interface SelectionSummaryProps {
  department: Department | null;
  service: Service | null;
}

export default function SelectionSummary({
  department,
  service,
}: SelectionSummaryProps) {
  if (!department || !service) {
    return null;
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Departamento */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">{department.name}</h3>
        {department.description && (
          <p className="text-sm text-slate-600">{department.description}</p>
        )}
      </div>

      {/* Servicio */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">{service.name}</h3>
        {service.description && (
          <p className="text-sm text-slate-600">{service.description}</p>
        )}
      </div>
    </div>
  );
}
