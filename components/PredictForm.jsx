import { useState } from 'react';

export default function PredictForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    snoring_rate: '',
    respiration_rate: '',
    body_temperature: '',
    limb_movement: '',
    blood_oxygen: '',
    eye_movement: '',
    sleeping_hours: '',
    heart_rate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium">{key.replace('_', ' ')}</label>
          <input
            type="number"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg w-full"
            required
          />
        </div>
      ))}
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
        Predict Stress Level
      </button>
    </form>
  );
}
