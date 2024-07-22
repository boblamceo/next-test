import './App.css';
import { motion } from "framer-motion"

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="App-intro">
        <h1 className="bigtext">Hello, I am Bob Lam.</h1>
{/* <motion.div
  animate={{
    x: 0,
    backgroundColor: "#000",
    boxShadow: "10px 10px 0 rgba(0, 0, 0, 0.2)",
    position: "fixed",
    transitionEnd: {
      display: "none",
    },
  }}
/> */}
          <video autoPlay loop muted className="video">
            <source
              src={require('./stars.mp4')}
              type="video/mp4"
            />

          </video>
        </div>
         <div className="App-intro">
        <h1 className="bigtext">Hello, I am Bob Lam.</h1>
{/* <motion.div
  animate={{
    x: 0,
    backgroundColor: "#000",
    boxShadow: "10px 10px 0 rgba(0, 0, 0, 0.2)",
    position: "fixed",
    transitionEnd: {
      display: "none",
    },
  }}
/> */}
          <video autoPlay loop muted className="video">
            <source
              src={require('./Aurora.mp4')}
              type="video/mp4"
            />

          </video>
        </div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>      <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>      <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>      <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>      <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
          <div>HI</div>
      </div>
      );
}

      export default App;
