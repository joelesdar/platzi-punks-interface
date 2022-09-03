import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Web3 from "web3/dist/web3.min";
import { Home } from "./views/Home";

function App() {
  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.requestAccounts().then(console.log);
    }
  }
  );

  return (
    <Routes>
      <Route path="/" exact element={<Home/>} />
    </Routes>
  );
}

export default App;
