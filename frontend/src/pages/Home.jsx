import { Navbar } from '../components/Navbar';

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center text-center px-4 mt-20">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Controla tus gastos, <br/>
          <span className="text-[#00E56A]">sin tantas vueltas.</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Bienvenido a No Tan de Una. La herramienta perfecta para saber a dónde se te está yendo la plata cada fin de mes.
        </p>
      </main>
    </div>
  );
};