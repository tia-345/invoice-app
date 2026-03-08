import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Invoice from "./Invoice";
import History from "./History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
