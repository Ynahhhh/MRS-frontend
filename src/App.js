import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './main_components/Layout';
import Seat from './pages/Seat/Seat';
import Details from './pages/Details/Details';
import Reservation from './pages/Reservation/Reservation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="movies/:id" element={<Seat/>} />
        <Route path="details/:movie_id/:a_id/:seatArray" element={<Details />} />
        <Route path="reserve/" element={<Reservation/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
