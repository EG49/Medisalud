import { fireEvent, render, screen } from '@testing-library/react';
import Button from './Button/Button';
import Badge from './Badge/Badge';
import Input from './Input/Input';
import ProgressBar from './ProgressBar/ProgressBar';
import FarmaciaBadge from './FarmaciaBadge/FarmaciaBadge';
import AvatarUpload from './AvatarUpload/AvatarUpload';

describe('Button', () => {
  test('renderiza el texto y responde al click', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Iniciar sesión</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('deshabilitado no dispara onClick', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} disabled>Enviar</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('aplica variante y fullWidth como clases', () => {
    render(<Button variant="outline" fullWidth>X</Button>);
    const boton = screen.getByRole('button');
    expect(boton.className).toContain('outline');
    expect(boton.className).toContain('fullWidth');
  });
});

describe('Badge', () => {
  test('no renderiza nada con count 0 o undefined', () => {
    const { container } = render(<Badge count={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('muestra el contador', () => {
    render(<Badge count={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

describe('Input', () => {
  test('propaga value y onChange', () => {
    const onChange = jest.fn();
    render(<Input id="cedula" value="09" onChange={onChange} placeholder="0000000000" />);
    const input = screen.getByPlaceholderText('0000000000');
    expect(input).toHaveValue('09');
    fireEvent.change(input, { target: { value: '0912' } });
    expect(onChange).toHaveBeenCalled();
  });
});

describe('ProgressBar', () => {
  test('expone los atributos ARIA y el porcentaje correcto', () => {
    render(<ProgressBar value={8} max={10} label="8 de 10" />);
    const barra = screen.getByRole('progressbar', { name: '8 de 10' });
    expect(barra).toHaveAttribute('aria-valuenow', '8');
    expect(barra).toHaveAttribute('aria-valuemax', '10');
    expect(barra.firstChild).toHaveStyle({ width: '80%' });
  });

  test('con max 0 no divide por cero (0%)', () => {
    render(<ProgressBar value={5} max={0} label="x" />);
    expect(screen.getByRole('progressbar').firstChild).toHaveStyle({ width: '0%' });
  });

  test('nunca pasa de 100%', () => {
    render(<ProgressBar value={20} max={10} label="x" />);
    expect(screen.getByRole('progressbar').firstChild).toHaveStyle({ width: '100%' });
  });
});

describe('FarmaciaBadge', () => {
  test('muestra el nombre de la farmacia', () => {
    render(<FarmaciaBadge farmacia={{ nombre: 'Fybeca' }} />);
    expect(screen.getByText('Fybeca')).toBeInTheDocument();
  });
});

describe('AvatarUpload', () => {
  test('sin foto muestra el "+" y el label; al elegir archivo dispara onChange', () => {
    const onChange = jest.fn();
    const { container } = render(<AvatarUpload previewUrl={null} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Añadir foto de perfil' })).toBeInTheDocument();

    const archivo = new File(['x'], 'foto.png', { type: 'image/png' });
    const inputArchivo = container.querySelector('input[type="file"]');
    fireEvent.change(inputArchivo, { target: { files: [archivo] } });
    expect(onChange).toHaveBeenCalledWith(archivo);
  });

  test('con foto muestra la imagen de perfil', () => {
    render(<AvatarUpload previewUrl="blob:foto" onChange={() => {}} />);
    expect(screen.getByAltText('Foto de perfil')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cambiar foto de perfil' })).toBeInTheDocument();
  });

  test('si el usuario cancela el selector (sin archivo) no dispara onChange', () => {
    const onChange = jest.fn();
    const { container } = render(<AvatarUpload previewUrl={null} onChange={onChange} />);
    fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [] } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
