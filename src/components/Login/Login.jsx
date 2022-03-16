import React, {useState} from 'react'
import "./login.css";
import firebase from "../../firebase";

export default function Login() {
  const [disablebtn, setDisablebtn] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [invalid, setInvalid] = useState("invalid")

  const Login = (e) => {
    setDisablebtn("disable")
    setInvalid("invalid")
    
    e.preventDefault();
    console.log("jsjshshshs");
    firebase
      .auth()
      .signInWithEmailAndPassword(
        email,
        password
        //this.state.email, this.state.password
      )
      .then((u) => {
        setDisablebtn("")
        setInvalid("invalid")
        
      })
      .catch((error) => {
        console.log(error);
        setDisablebtn("")
        setInvalid("")
      });
  };
  


  return (
    
       <div className="login_page">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-lg-4 p-0 first_section">
              <div className="box">
                <div className="from_section">
                  <i className="fa fa-hospital-o" aria-hidden="true"></i>
                  <ul>
                    <li>
                      <i className="fa fa-user-md" aria-hidden="true"></i>
                    </li>
                    <h3 style={{ color: "white" }}>Hopital Management</h3>
                    <li></li>
                  </ul>

                  <form onSubmit={Login}>
                    <input
                    name="email"
                    value={email}
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="admin@example.com"
                      onChange ={(e)=>setEmail(e.target.value)}
                     autoComplete="off"
                      required
                    />
                    <input
                    className="form-control form-control-lg"
                    value={password}
                      type="password"
                      placeholder="123456"
                      name="password"
                      onChange={(e)=>setPassword(e.target.value)}
                      required
                    />
                    <p className={invalid}>
                      Invalid login or password
                    </p>
                    <button
                      type="submit"
                      className="btn btn-info"
                      disabled={disablebtn}
                    >
                      Login
                      <i className="fa fa-unlock" aria-hidden="true"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-8 p-0 second_section">
              <div className="box">
                <img alt="" srcSet={require("../../Images/doctorbg.jpg")} />
              </div>
            </div>
          </div>
        </div>
      </div>
  
  )
}

