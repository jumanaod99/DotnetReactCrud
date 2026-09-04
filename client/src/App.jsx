import Navbar from "./components/navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Person from "./components/person/Person";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // استدعاء المكون بدلاً من الدالة

const App = () => {
  return (
    <>
      {/* هذا المكون هو المسؤول عن إظهار الرسائل المنبثقة في أي مكان بالتطبيق */}
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="person" element={<Person />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
