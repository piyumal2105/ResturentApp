import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminNavbar from "./components/AdminNavbar/SideNavbar";
import Resturents from "./components/Resturent/Resturent";
import AllResturents from "./components/AllResturents/AllResturents";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/adminnavbar" element={<AdminNavbar />} />
            <Route path="/resturents" element={<Resturents />} />
            <Route path="/allresturents" element={<AllResturents />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
