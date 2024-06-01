import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { routes } from "./constants/routes";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ ...props }, key) => {
          return <Route {...props} key={key} />;
        })}
      </Routes>
    </BrowserRouter>
  );
}
export default App;