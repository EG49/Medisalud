/**
 * Casos de borde adicionales para completar la cobertura de ramas
 * (formatos de tiempo relativo, variantes de estado y layouts).
 */
import { fireEvent, render, screen } from '@testing-library/react';
import FormField from './FormField/FormField';
import PedidoActivoCard from './PedidoActivoCard/PedidoActivoCard';
import PedidoHistorialCard from './PedidoHistorialCard/PedidoHistorialCard';
import NotificationItem from './NotificationItem/NotificationItem';
import NavLinks from './NavLinks/NavLinks';
import AvatarUpload from '../atoms/AvatarUpload/AvatarUpload';

const pedidoBase = {
  estado: 'confirmado',
  direccionEntrega: 'Av. Orellana',
  repartidor: null,
  items: [{ id: 'a', medicamentoNombre: 'Paracetamol', farmacia: { nombre: 'Fybeca' } }],
};

describe('PedidoActivoCard — tiempo relativo', () => {
  test('recién actualizado muestra "justo ahora"', () => {
    render(<PedidoActivoCard pedido={{ ...pedidoBase, actualizadoEn: new Date().toISOString() }} />);
    expect(screen.getByText(/justo ahora/)).toBeInTheDocument();
  });

  test('horas atrás muestra "hace X h"', () => {
    const hace3h = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    render(<PedidoActivoCard pedido={{ ...pedidoBase, actualizadoEn: hace3h }} />);
    expect(screen.getByText(/hace 3 h/)).toBeInTheDocument();
  });
});

describe('PedidoHistorialCard — estados', () => {
  test('entregado usa la etiqueta y estilo normal', () => {
    render(
      <PedidoHistorialCard
        pedido={{
          estado: 'entregado',
          fecha: '2026-06-20',
          items: [{ id: 'x', medicamentoNombre: 'Losartán', farmacia: { nombre: 'Fybeca' } }],
        }}
      />
    );
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });

  test('estado desconocido se muestra tal cual (fallback)', () => {
    render(
      <PedidoHistorialCard
        pedido={{ estado: 'devuelto', fecha: '2026-06-20', items: [] }}
      />
    );
    expect(screen.getByText('devuelto')).toBeInTheDocument();
  });
});

describe('NotificationItem — fechas de más de un día', () => {
  test('muestra la hora del día para notificaciones viejas', () => {
    render(
      <ul>
        <NotificationItem
          notificacion={{
            id: 'n3',
            tipo: 'cuidador',
            mensaje: 'Actividad de tu cuidadora.',
            fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            leida: true,
          }}
          onLeer={() => {}}
        />
      </ul>
    );
    // Para > 24h se muestra hora (formato HH:MM), no "hace X"
    expect(screen.queryByText(/^hace /)).not.toBeInTheDocument();
  });

  test('tipo desconocido usa el ícono por defecto sin romperse', () => {
    render(
      <ul>
        <NotificationItem
          notificacion={{
            id: 'n4',
            tipo: 'otro',
            mensaje: 'Mensaje genérico.',
            fecha: new Date().toISOString(),
            leida: true,
          }}
          onLeer={() => {}}
        />
      </ul>
    );
    expect(screen.getByText('Mensaje genérico.')).toBeInTheDocument();
  });
});

describe('FormField — layout por defecto (stacked)', () => {
  test('sin layout inline igual asocia label e input', () => {
    render(<FormField id="x" label="Campo:" value="v" onChange={() => {}} />);
    expect(screen.getByLabelText('Campo:')).toHaveValue('v');
  });
});

describe('NavLinks — links externos', () => {
  test('un href que no es ancla no se intercepta', () => {
    const onNavigate = jest.fn();
    render(
      <NavLinks
        links={[{ label: 'Docs', href: 'https://ejemplo.com' }]}
        onNavigate={onNavigate}
      />
    );
    fireEvent.click(screen.getByRole('link', { name: 'Docs' }));
    expect(onNavigate).not.toHaveBeenCalled();
  });
});

describe('AvatarUpload — abrir el selector', () => {
  test('el círculo y el botón de texto abren el input de archivo', () => {
    const { container } = render(<AvatarUpload previewUrl={null} onChange={() => {}} label="Cambiar foto" />);
    const inputArchivo = container.querySelector('input[type="file"]');
    const click = jest.spyOn(inputArchivo, 'click');

    fireEvent.click(screen.getByRole('button', { name: 'Añadir foto de perfil' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar foto' }));
    expect(click).toHaveBeenCalledTimes(2);
  });
});
