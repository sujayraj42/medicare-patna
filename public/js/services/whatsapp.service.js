/**
 * WhatsApp Share Service — wa.me deep links for report sharing
 */
const WhatsAppService = (() => {
  const WA_BASE = 'https://wa.me/';

  function openShare(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Share a medical report summary via WhatsApp
   * @param {Object} report - { name, date, hospital, type }
   * @param {string} [phone] - optional pre-filled phone number (91XXXXXXXXXX)
   */
  function shareReport(report, phone) {
    const text = encodeURIComponent(
      `🏥 *MediCare — Medical Report*\n\n` +
      `📄 *Report:* ${report.name}\n` +
      `📅 *Date:* ${report.date}\n` +
      `🏥 *Hospital:* ${report.hospital || 'N/A'}\n` +
      `📋 *Type:* ${report.type || 'Document'}\n\n` +
      `---\n` +
      `_Shared securely via MediCare Patna Health Ecosystem_\n` +
      `_Download: medicare.patna.health_`
    );

    const url = phone ? `${WA_BASE}${phone}?text=${text}` : `${WA_BASE}?text=${text}`;
    openShare(url);
  }

  /**
   * Share appointment confirmation
   */
  function shareAppointment(appointment) {
    const text = encodeURIComponent(
      `🏥 *MediCare — Appointment Confirmation*\n\n` +
      `👨‍⚕️ *Specialty:* ${appointment.specialty}\n` +
      `🏥 *Hospital:* ${appointment.hospitalName}\n` +
      `🕐 *Time:* ${appointment.slot}\n` +
      `📅 *Date:* ${appointment.date}\n\n` +
      `---\n` +
      `_Booked via MediCare Patna Health Ecosystem_`
    );

    openShare(`${WA_BASE}?text=${text}`);
  }

  /**
   * Share emergency location
   */
  function shareEmergency(location) {
    const mapsUrl = location.lat && location.lng
      ? `https://maps.google.com/?q=${location.lat},${location.lng}`
      : '';

    const text = encodeURIComponent(
      `🚨 *MediCare — EMERGENCY ALERT*\n\n` +
      `📍 *Location:* ${location.areaName || 'Patna'}\n` +
      `${mapsUrl ? `🗺️ *Map:* ${mapsUrl}\n` : ''}` +
      `📞 *Ambulance:* 108\n\n` +
      `_Please help! Emergency medical assistance needed._`
    );

    openShare(`${WA_BASE}?text=${text}`);
  }

  /**
   * Share ABHA card info
   */
  function shareAbhaCard(abhaId, name) {
    const text = encodeURIComponent(
      `🏥 *Ayushman Bharat — ABHA Card*\n\n` +
      `👤 *Name:* ${name}\n` +
      `🆔 *ABHA ID:* ${abhaId}\n\n` +
      `_PM-JAY Helpline: 14555_\n` +
      `_Generated via MediCare Patna_`
    );

    openShare(`${WA_BASE}?text=${text}`);
  }

  /**
   * Generic share
   */
  function share(message) {
    const text = encodeURIComponent(message);
    openShare(`${WA_BASE}?text=${text}`);
  }

  return { shareReport, shareAppointment, shareEmergency, shareAbhaCard, share };
})();

export default WhatsAppService;
