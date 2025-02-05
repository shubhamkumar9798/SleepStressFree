import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to Stress Prediction App</h1>
      <Link href="/predict">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Predict Stress Level
        </button>
      </Link>
    </div>
  );
}
