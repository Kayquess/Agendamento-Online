import React, { useEffect, useState, useCallback } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/agendar.css';

registerLocale('pt-BR', ptBR);

interface BookingFormProps {
  serviceName: string;
  onClose?: () => void;
  onSubmit?: (data: BookingFormData) => void; 
  bookings: BookingFormData[];
  whatsappNumber: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  service: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  serviceName,
  onSubmit,
  bookings,
  whatsappNumber,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    date: '',
    time: '',
    service: serviceName || '',
  });

  const [localBookings, setLocalBookings] = useState<BookingFormData[]>(bookings);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateTimes = useCallback((): string[] => {
    const times: string[] = [];
    for (let hour = 9; hour <= 20; hour++) {
      ['00', '30'].forEach(minute => {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        if (time !== '12:00' && time !== '12:30') times.push(time);
      });
    }
    return times;
  }, []);

  const filterAvailableTimes = useCallback((date: string): string[] => {
    const allTimes = generateTimes();
    const bookedTimes = localBookings
      .filter(b => b.date === date)
      .map(b => b.time);
    return allTimes.filter(time => !bookedTimes.includes(time));
  }, [localBookings, generateTimes]);

  useEffect(() => {
    if (formData.date) {
      const filtered = filterAvailableTimes(formData.date);
      setAvailableTimes(filtered);
      if (!filtered.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: '' }));
      }
    }
  }, [formData.date, localBookings, filterAvailableTimes]);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatted = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: formatted, time: '' }));
    }
  };

  const redirectToWhatsApp = (data: BookingFormData) => {
    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR');
    const message = `Olá, meu nome é ${data.name} e acabei de agendar um ${data.service} para o dia ${formattedDate} às ${data.time}.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error('Erro no backend:', response.status, data);
        alert(`Falha ao confirmar agendamento: ${data?.message || response.statusText}`);
        setLoading(false);
        return;
      }

      setLocalBookings(prev => [...prev, formData]);

      if (onSubmit) onSubmit(formData);

      redirectToWhatsApp(formData);

      setShowConfirm(false);

      setFormData(prev => ({
        ...prev,
        name: '',
        phone: '',
        date: '',
        time: '',
        service: serviceName || '',
      }));

    } catch (error) {
      alert('Falha ao confirmar agendamento. Tente novamente.');
      console.error('Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = () => setShowConfirm(false);

  const isDayDisabled = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 1;
  };

  const formattedDateForConfirm = formData.date
    ? new Date(formData.date).toLocaleDateString('pt-BR')
    : '';

  return (
    <div className="booking-form-overlay">
      <form className="Login" onSubmit={handleSubmit}>
        <h2>Agendar Horário</h2>

        <label>Nome:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />

        <label>Telefone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(xx) xxxxx-xxxx"
          autoComplete="tel"
          pattern="\d{10,11}"
          title="Digite um telefone válido com DDD"
        />

        <label>Serviço:</label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um serviço</option>
          <option value="Corte">Corte</option>
          <option value="Barba">Barba</option>
          <option value="Corte + Barba">Corte + Barba</option>
        </select>

        <label>Data:</label>
        <DatePicker
          selected={formData.date ? new Date(formData.date + 'T00:00:00') : null}
          onChange={handleDateChange}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          filterDate={date => !isDayDisabled(date)}
          placeholderText="Selecione uma data"
          required
        />

        <label>Horário:</label>
        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          disabled={availableTimes.length === 0}
        >
          <option value="">Selecione um horário</option>
          {availableTimes.length > 0 ? (
            availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))
          ) : (
            <option disabled>Sem horários disponíveis</option>
          )}
        </select>

        <div className="buttons">
          <button type="submit" disabled={!formData.time || loading}>
            {loading ? 'Confirmando...' : 'Confirmar'}
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Confirmar Agendamento</h3>
            <p>
              Confirmar agendamento para <strong>{formData.name}</strong>, serviço de{' '}
              <strong>{formData.service}</strong>, dia{' '}
              <strong>{formattedDateForConfirm}</strong> às{' '}
              <strong>{formData.time}</strong>?
            </p>
            <div className="confirmation-buttons">
              <button onClick={confirmBooking} className="confirm-btn" disabled={loading}>
                {loading ? 'Confirmando...' : 'Sim'}
              </button>
              <button onClick={cancelBooking} className="cancel-btn" disabled={loading}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
