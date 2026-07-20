import { fireEvent, render, screen } from '@testing-library/react';
import FormField from './FormField/FormField';
import MedicineCard from './MedicineCard/MedicineCard';
import RecetaCard from './RecetaCard/RecetaCard';
import PedidoActivoCard from './PedidoActivoCard/PedidoActivoCard';
import PedidoHistorialCard from './PedidoHistorialCard/PedidoHistorialCard';
import ExamenCard from './ExamenCard/ExamenCard';
import EditableSection from './EditableSection/EditableSection';
import NotificationItem from './NotificationItem/NotificationItem';
import QuickAccessCard from './QuickAccessCard/QuickAccessCard';
import CuidadorItem from './CuidadorItem/CuidadorItem';
import NavLinks from './NavLinks/NavLinks';
import { Pill } from 'lucide-react';

describe('FormField', () => {
  test('asocia label e input (accesibilidad) y soporta layout inline', () => {
    render(
      <FormField id="cedula" label="Cédula:" value="09" onChange={() => {}} layout="inline" />
    );
    expect(screen.getByLabelText('Cédula:')).toHaveValue('09');
  });
});

describe('MedicineCard', () => {
  const item = {
    medicamento: { nombre: 'Paracetamol', presentacion: 'Tableta 500mg', descripcionUso: 'Baja la fiebre.' },
    indicaciones: 'Tomar con alimentos.',
    activa: true,
  };

  test('muestra nombre, disponibilidad y próxima toma', () => {
    render(
      <MedicineCard receta={item} disponible={8} total={10} proximaToma={new Date()} />
    );
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('de 10 disponibles')).toBeInTheDocument();
    expect(screen.getByText(/Próxima toma:/)).toBeInTheDocument();
  });

  test('tratamiento inactivo muestra la insignia de finalizado y oculta próxima toma', () => {
    render(
      <MedicineCard receta={{ ...item, activa: false }} disponible={0} total={10} proximaToma={null} />
    );
    expect(screen.getByText('Tratamiento finalizado')).toBeInTheDocument();
    expect(screen.queryByText(/Próxima toma:/)).not.toBeInTheDocument();
  });
});

describe('RecetaCard', () => {
  test('muestra médico, items con dosis e indicaciones extra', () => {
    render(
      <RecetaCard
        receta={{
          medico: { nombre: 'Carlos Andrade', especialidad: 'Medicina General' },
          hospital: 'Clínica Kennedy',
          fechaEmision: '2026-07-01',
          indicacionesExtra: 'Reposo relativo.',
          items: [
            {
              id: 'i1',
              medicamento: { nombre: 'Paracetamol', presentacion: 'Tableta 500mg' },
              frecuenciaHoras: 12,
              duracionDias: 5,
              indicaciones: 'Con alimentos.',
            },
          ],
        }}
      />
    );
    expect(screen.getByText('Carlos Andrade')).toBeInTheDocument();
    expect(screen.getByText('1 unidad cada 12 horas, durante 5 días')).toBeInTheDocument();
    expect(screen.getByText('Reposo relativo.')).toBeInTheDocument();
  });
});

describe('PedidoActivoCard', () => {
  const pedido = {
    estado: 'en_camino',
    direccionEntrega: 'Av. Orellana',
    repartidor: { nombre: 'Juan Pérez' },
    actualizadoEn: new Date().toISOString(),
    items: [
      { id: 'a', medicamentoNombre: 'Paracetamol', farmacia: { nombre: 'Fybeca' } },
      { id: 'b', medicamentoNombre: 'Metformina', farmacia: { nombre: 'Fybeca' } },
      { id: 'c', medicamentoNombre: 'Losartán', farmacia: { nombre: 'Cruz Azul' } },
    ],
  };

  test('muestra repartidor, dirección y farmacias sin repetir', () => {
    render(<PedidoActivoCard pedido={pedido} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Av. Orellana')).toBeInTheDocument();
    expect(screen.getAllByText('Fybeca')).toHaveLength(1); // duplicada en items, única en la tarjeta
    expect(screen.getByText(/Actualizado/)).toBeInTheDocument();
  });

  test('modo sin conexión muestra el aviso de dato guardado (resiliencia offline)', () => {
    render(<PedidoActivoCard pedido={pedido} sinConexion />);
    expect(screen.getByText('Sin conexión — mostrando el último dato guardado')).toBeInTheDocument();
  });

  test('sin repartidor asignado no muestra esa línea', () => {
    render(<PedidoActivoCard pedido={{ ...pedido, repartidor: null }} />);
    expect(screen.queryByText(/Repartidor:/)).not.toBeInTheDocument();
  });
});

describe('PedidoHistorialCard', () => {
  test('muestra estado traducido y medicinas', () => {
    render(
      <PedidoHistorialCard
        pedido={{
          estado: 'cancelado',
          fecha: '2026-06-01',
          items: [{ id: 'x', medicamentoNombre: 'Amoxicilina', farmacia: { nombre: 'Cruz Azul' } }],
        }}
      />
    );
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
    expect(screen.getByText('Amoxicilina')).toBeInTheDocument();
  });
});

describe('ExamenCard', () => {
  test('muestra tipo, resultado simple y médico', () => {
    render(
      <ExamenCard
        examen={{
          tipo: 'Radiografía de tórax',
          fecha: '2026-07-10',
          laboratorio: 'Interlab',
          medico: { nombre: 'Carlos Andrade' },
          resultadoSimple: 'Tus pulmones se ven limpios.',
          archivoUrl: '/x.pdf',
        }}
      />
    );
    expect(screen.getByText('Radiografía de tórax')).toBeInTheDocument();
    expect(screen.getByText('Tus pulmones se ven limpios.')).toBeInTheDocument();
    expect(screen.getByText('Solicitado por Carlos Andrade')).toBeInTheDocument();
  });
});

describe('EditableSection', () => {
  const fields = [
    { id: 'nombre', label: 'Nombre', value: 'María' },
    { id: 'cedula', label: 'Cédula', value: '0912345678', editable: false },
  ];

  test('editar → cambiar → guardar llama onSave con los valores nuevos', () => {
    const onSave = jest.fn();
    render(<EditableSection title="Datos" fields={fields} onSave={onSave} />);

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSave).toHaveBeenCalledWith({ nombre: 'Ana', cedula: '0912345678' });
  });

  test('el campo no editable no se convierte en input', () => {
    render(<EditableSection title="Datos" fields={fields} onSave={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.queryByLabelText('Cédula')).not.toBeInTheDocument();
  });

  test('cancelar restaura los valores originales', () => {
    render(<EditableSection title="Datos" fields={fields} onSave={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Otro' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByLabelText('Nombre')).toHaveValue('María');
  });
});

describe('NotificationItem', () => {
  test('muestra mensaje, tiempo relativo y dispara onLeer', () => {
    const onLeer = jest.fn();
    render(
      <ul>
        <NotificationItem
          notificacion={{
            id: 'n1',
            tipo: 'pedido',
            mensaje: 'Tu pedido está en camino.',
            fecha: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            leida: false,
          }}
          onLeer={onLeer}
        />
      </ul>
    );
    expect(screen.getByText('Tu pedido está en camino.')).toBeInTheDocument();
    expect(screen.getByText('hace 10 min')).toBeInTheDocument();
    expect(screen.getByLabelText('No leída')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onLeer).toHaveBeenCalledWith('n1');
  });

  test('las leídas no muestran el punto, y horas se muestran como "hace X h"', () => {
    render(
      <ul>
        <NotificationItem
          notificacion={{
            id: 'n2',
            tipo: 'receta',
            mensaje: 'Nueva receta.',
            fecha: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            leida: true,
          }}
          onLeer={() => {}}
        />
      </ul>
    );
    expect(screen.getByText('hace 3 h')).toBeInTheDocument();
    expect(screen.queryByLabelText('No leída')).not.toBeInTheDocument();
  });
});

describe('QuickAccessCard', () => {
  test('muestra título y dato, y responde al click', () => {
    const onClick = jest.fn();
    render(<QuickAccessCard icon={Pill} titulo="Medicinas" dato="2 por acabarse" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Medicinas')).toBeInTheDocument();
    expect(screen.getByText('2 por acabarse')).toBeInTheDocument();
    expect(onClick).toHaveBeenCalled();
  });
});

describe('CuidadorItem', () => {
  test('vinculado: muestra inicial del avatar y botón de quitar acceso', () => {
    const onQuitar = jest.fn();
    render(
      <ul>
        <CuidadorItem estado="vinculado" nombre="Ana Fernández" relacion="Hija" onQuitar={onQuitar} />
      </ul>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar acceso' }));
    expect(onQuitar).toHaveBeenCalled();
  });

  test('solicitud recibida: permite aprobar y rechazar', () => {
    const onAprobar = jest.fn();
    const onRechazar = jest.fn();
    render(
      <ul>
        <CuidadorItem
          estado="solicitud_recibida"
          nombre="Pedro Fernández"
          onAprobar={onAprobar}
          onRechazar={onRechazar}
        />
      </ul>
    );
    expect(screen.getByText('Solicitó acceso a tu cuenta')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aprobar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    expect(onAprobar).toHaveBeenCalled();
    expect(onRechazar).toHaveBeenCalled();
  });

  test('invitación enviada: se puede cancelar', () => {
    const onCancelar = jest.fn();
    render(
      <ul>
        <CuidadorItem estado="invitacion_enviada" nombre="0998887777" onCancelarInvitacion={onCancelar} />
      </ul>
    );
    expect(screen.getByText('Invitación pendiente')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancelar).toHaveBeenCalled();
  });
});

describe('NavLinks', () => {
  test('marca el link activo con aria-current y usa onNavigate si se pasa', () => {
    const onNavigate = jest.fn();
    render(<NavLinks activeHref="#inicio" onNavigate={onNavigate} />);
    const activo = screen.getByRole('link', { name: 'Inicio' });
    expect(activo).toHaveAttribute('aria-current', 'page');
    fireEvent.click(activo);
    expect(onNavigate).toHaveBeenCalledWith('#inicio');
  });

  test('sin onNavigate hace scroll local a la sección', () => {
    const destino = document.createElement('section');
    destino.id = 'servicio';
    destino.scrollIntoView = jest.fn();
    document.body.appendChild(destino);

    render(<NavLinks />);
    fireEvent.click(screen.getByRole('link', { name: 'Servicio' }));
    expect(destino.scrollIntoView).toHaveBeenCalled();
    destino.remove();
  });
});
