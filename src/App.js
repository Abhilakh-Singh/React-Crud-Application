import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeList from './EmployeeList';

function App() {
  return (
    <div className="App">
   <h1 className="text-black-500 lg:text-2xl p-4 font-semibold">React Crud Application</h1>

   <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App;
