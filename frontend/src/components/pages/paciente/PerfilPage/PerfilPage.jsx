import { useEffect, useState } from 'react';
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
import {
  actualizarPerfil as actualizarPerfilApi,
  aprobarSolicitud as aprobarSolicitudApi,
  getCuidadores,
  getPerfil,
  invitarCuidador as invitarCuidadorApi,
  quitarCuidador as quitarCuidadorApi,
  rechazarSolicitud as rechazarSolicitudApi,
} from '../../../../api/pacienteApi';
import { useApi } from '../../../../api/useApi';
import styles from './PerfilPage.module.css';

export default function PerfilPage({ usuario, onLogout, onNavigate }) {
  // Datos reales del backend; si no hay servidor (demo/offline) usan los mocks.
  const { datos: perfilApi, modoDemo } = useApi(getPerfil, mockPerfil);
  const { datos: cuidadoresApi, recargar: recargarCuidadores } = useApi(getCuidadores, {
    vinculados: mockCuidadoresVinculados,
    solicitudesRecibidas: mockSolicitudesRecibidas,
    invitacionesEnviadas: mockInvitacionesEnviadas,
  });

  const [perfil, setPerfil] = useState(mockPerfil);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [vinculados, setVinculados] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [invitaciones, setInvitaciones] = useState([]);

  useEffect(() => {
    if (perfilApi) {
      setPerfil(perfilApi);
      setPreviewUrl(perfilApi.fotoUrl);
    }
  }, [perfilApi]);

  useEffect(() => {
    if (cuidadoresApi) {
      setVinculados(cuidadoresApi.vinculados ?? []);
      setSolicitudes(cuidadoresApi.solicitudesRecibidas ?? []);
      setInvitaciones(cuidadoresApi.invitacionesEnviadas ?? []);
    }
  }, [cuidadoresApi]);

  const actualizarPerfil = (campos) => {
    setPerfil((prev) => ({ ...prev, ...campos })); // optimista
    if (!modoDemo) {
      actualizarPerfilApi(campos)
        .then(setPerfil)
        .catch((e) => alert(e.message || 'No se pudo guardar el perfil.'));
    }
  };

  const handleFoto = (file) => setPreviewUrl(URL.createObjectURL(file));

  const aprobarSolicitud = (id) => {
    if (modoDemo) {
      const solicitud = solicitudes.find((s) => s.id === id);
      if (solicitud) {
        setVinculados((prev) => [...prev, { ...solicitud, autorizadoPedidos: true }]);
      }
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    aprobarSolicitudApi(id)
      .then(recargarCuidadores)
      .catch((e) => alert(e.message || 'No se pudo aprobar la solicitud.'));
  };

  const rechazarSolicitud = (id) => {
    if (modoDemo) {
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    rechazarSolicitudApi(id)
      .then(recargarCuidadores)
      .catch((e) => alert(e.message || 'No se pudo rechazar la solicitud.'));
  };

  const quitarCuidador = (id) => {
    if (modoDemo) {
      setVinculados((prev) => prev.filter((c) => c.id !== id));
      return;
    }
    quitarCuidadorApi(id)
      .then(recargarCuidadores)
      .catch((e) => alert(e.message || 'No se pudo quitar el cuidador.'));
  };

  const cancelarInvitacion = (id) => {
    if (modoDemo) {
      setInvitaciones((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    quitarCuidadorApi(id) // una invitación pendiente se elimina igual que un vínculo
      .then(recargarCuidadores)
      .catch((e) => alert(e.message || 'No se pudo cancelar la invitación.'));
  };

  const invitarCuidador = (identificador) => {
    if (modoDemo) {
      setInvitaciones((prev) => [
        ...prev,
        { id: `i-${Date.now()}`, destinatario: identificador, fecha: new Date().toISOString() },
      ]);
      return;
    }
    invitarCuidadorApi({ celular: identificador })
      .then(recargarCuidadores)
      .catch((e) => alert(e.message || 'No se pudo enviar la invitación.'));
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
