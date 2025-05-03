import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { Home } from './Authentication/Home';
import { Main } from './Components/Main';
import { AddFolder } from './Components/AddFolder';
import { ViewFolder } from './Components/ViewFolder';
import { AllImages } from './Components/Images/AllImages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/document-manager' element={<Main></Main>}>
          <Route index path="" element={<AddFolder></AddFolder>}></Route>
          <Route path="folder/:id" element={<ViewFolder></ViewFolder>}></Route>
          <Route path="all-images" element={<AllImages></AllImages>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
