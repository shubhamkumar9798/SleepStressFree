// "use client"

// import { useState } from 'react';
// import PredictForm from '@/components/PredictForm';

// export default function Predict() {
//   const [prediction, setPrediction] = useState(null);

//   const handlePrediction = async (formData) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setPrediction(data.stress_level);
//       } else {
//         const error = await res.json();
//         alert(`Error: ${error.error}`);
//       }
//     } catch (error) {
//       console.error("Error during prediction:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Enter Sleep Data for Stress Prediction</h1>
//       <PredictForm onSubmit={handlePrediction} />
//       {prediction !== null && (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold">Predicted Stress Level: {prediction}</h2>
//         </div>
//       )}
//     </div>
//   );
// }
