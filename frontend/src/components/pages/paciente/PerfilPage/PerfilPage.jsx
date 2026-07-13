import { useState } from 'react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import AvatarUpload from '../../../atoms/AvatarUpload/AvatarUpload';
import EditableSection from '../../../molecules/EditableSection/EditableSection';
import CuidadoresSection from '../../../organisms/CuidadoresSection/CuidadoresSection';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockPerfil } from '../../../../features/paciente/mockPerfil';
import {
  mockCuidadoresVinculados,
  mockSolicitudesRecibidas,
  mockInvitacionesEnviadas,
} from '../../../../features/paciente/mockCuidadores';
import styles from './PerfilPage.module.css';

export default function PerfilPage({ usuario, onLogout, onNavigate }) {
  // TODO: reemplazar mocks por perfilApi.getPerfil() / cuidadorApi.* cuando exista Flask.
  const [perfil, setPerfil] = useState(mockPerfil);
  const [previewUrl, setPreviewUrl] = useState(mockPerfil.fotoUrl);

  const [vinculados, setVinculados] = useState(mockCuidadoresVinculados);
  const [solicitudes, setSolicitudes] = useState(mockSolicitudesRecibidas);
  const [invitaciones, setInvitaciones] = useState(mockInvitacionesEnviadas);

  const actualizarPerfil = (campos) => setPerfil((prev) => ({ ...prev, ...campos }));

  const handleFoto = (file) => setPreviewUrl(URL.createObjectURL(file));

  const aprobarSolicitud = (id) => {
    const solicitud = solicitudes.find((s) => s.id === id);
    if (solicitud) {
      setVinculados((prev) => [...prev, { ...solicitud, autorizadoPedidos: true }]);
    }
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };

  const rechazarSolicitud = (id) => setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  const quitarCuidador = (id) => setVinculados((prev) => prev.filter((c) => c.id !== id));
  const cancelarInvitacion = (id) => setInvitaciones((prev) => prev.filter((i) => i.id !== id));

  const invitarCuidador = (identificador) => {
    setInvitaciones((prev) => [
      ...prev,
      { id: `i-${Date.now()}`, destinatario: identificador, fecha: new Date().toISOString() },
    ]);
  };

  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="perfil"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
    >
      <div className={styles.stack}>
        <div className={styles.encabezado}>
          <AvatarUpload previewUrl={previewUrl} onChange={handleFoto} label="Cambiar foto" />
          <div>
            <h1 className={styles.nombre}>
              {perfil.nombre} {perfil.apellidos}
            </h1>
            <p className={styles.rol}>Paciente</p>
          </div>
        </div>

        <EditableSection
          title="Datos personales"
          onSave={actualizarPerfil}
          fields={[
            { id: 'nombre', label: 'Nombre', value: perfil.nombre },
            { id: 'apellidos', label: 'Apellidos', value: perfil.apellidos },
            { id: 'cedula', label: 'Cédula', value: perfil.cedula, editable: false },
            {
              id: 'fechaNacimiento',
              label: 'Fecha de nacimiento',
              value: perfil.fechaNacimiento,
              type: 'date',
            },
            { id: 'celular', label: 'Celular', value: perfil.celular, type: 'tel' },
          ]}
        />

        <EditableSection
          title="Contacto de emergencia"
          onSave={actualizarPerfil}
          fields={[
            {
              id: 'contactoEmergenciaNombre',
              label: 'Nombre',
              value: perfil.contactoEmergenciaNombre,
            },
            {
              id: 'contactoEmergenciaTelefono',
              label: 'Teléfono',
              value: perfil.contactoEmergenciaTelefono,
              type: 'tel',
            },
          ]}
        />

        <EditableSection
          title="Alergias"
          onSave={actualizarPerfil}
          fields={[{ id: 'alergias', label: 'Alergias conocidas', value: perfil.alergias }]}
        />

        <EditableSection
          title="Dirección de entrega"
          onSave={actualizarPerfil}
          fields={[{ id: 'direccion', label: 'Dirección', value: perfil.direccion }]}
        />

        <CuidadoresSection
          vinculados={vinculados}
          solicitudesRecibidas={solicitudes}
          invitacionesEnviadas={invitaciones}
          onAprobar={aprobarSolicitud}
          onRechazar={rechazarSolicitud}
          onQuitar={quitarCuidador}
          onCancelarInvitacion={cancelarInvitacion}
          onInvitar={invitarCuidador}
        />
      </div>
    </DashboardLayout>
  );
}
