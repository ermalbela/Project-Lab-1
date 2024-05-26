import { useContext, useState } from 'react';
import {Button, Row, Col, Container, Form, FormGroup, InputGroup, FormLabel, FormControl, Card} from 'react-bootstrap';
import { patterns } from '../Validation';
import { getRole, loginUser } from '../Endpoint';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import emailIcon from '../assets/images/email.png';
import passwordIcon from '../assets/images/lock.png';
import Swal from 'sweetalert2';
import AuthContext from '../_helper/AuthContext';

const Login = () => {
  const initialValues = {
    email: '',
    password: ''
  }

  const [user, setUser] = useState(initialValues);
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const history = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({...user, [name]: value})
  }

  const validate = (vals) => {
    const errors = {};
    if(!patterns.email.test(vals.email)){
      errors.email = 'Enter an existing username!';
    }
    if(!patterns.password.test(vals.password)){
      errors.password = 'Your password must contain more than 6 letters';
    }
    return errors;
  }
  const {role, setRole} = useContext(AuthContext);

  async function fetchUserRole() {
    console.log(role);
      try {
          const response = await axios.get(getRole, { withCredentials: true });
          setRole(response.data.role);
          console.log(response.data)
      } catch (error) {
          console.error('Error fetching user role:', error);
      }
    }

  const handleClick = async () => {
    setErrors(validate(user));
    if(patterns.userName.test(user.userName) && patterns.password.test(user.password)){
      try{
        const res = await axios.post(loginUser, {Email: user.email, Password: user.password, Remember: checked});
  
        await fetchUserRole();
        console.log(res.data);
        localStorage.setItem('name', JSON.stringify(res.data.updateResult.name));
        localStorage.setItem('userId', JSON.stringify(res.data.updateResult.id));
        localStorage.setItem('token', JSON.stringify(res.data.tokenString));

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Logged In Successfully"
        });
        history(`/`);
        
      } catch (err) {
        if(!err.response){
          setErrors({globalError: 'Error, No Server Response!'})
        } else if (err.response?.status === 400) {
          setErrors({globalError: 'Missing Email or Password!'})
        } else if (err.response?.status === 401) {
          setErrors({globalError: 'Unauthorized!'})
        } else{
          setErrors({globalError: 'Login Failed!'})
        }
      }
    }
  }

  return(
    <>
      <Row className="justify-content-md-center align-items-center m-0 mt-5">
        <Col lg={5}>
          <Container fluid={true}>
            <Card className='login-card mt-4' sm={2}>
              <Form className="d-flex justify-content-center flex-column login-form">
                <div className="d-flex justify-content-center">
                  <h5 className="invalidFeedback">{errors.globalError}</h5>
                </div>
                <div className="login-special-title">
                  <h5>Login</h5>
                </div>
                <FormGroup className='formGroup'>
                  <FormLabel>Email</FormLabel>
                  <div className="input-group login-form-inputs">
                    <InputGroup.Text id="basic-addon1">
                      <img src={emailIcon} style={{width: '19px'}} />
                    </InputGroup.Text>
                    <FormControl className="form-control" type="text" name='email' placeholder="e.g. jdoe@gmail.com" value={user.email} onChange={handleChange} />
                  </div>
                  <p className='invalidFeedback fullWidth'>{errors.email}</p>
                </FormGroup>
                <FormGroup className='formGroup'>
                  <FormLabel>Password</FormLabel>
                  <div className="input-group login-form-inputs">
                    <InputGroup.Text id="basic-addon1">
                      <img src={passwordIcon} style={{width: '19px'}} />
                    </InputGroup.Text>
                    <FormControl className="form-control" type="password" name="password" placeholder="*********" value={user.password} onChange={handleChange} />
                    <div className="show-hide"><span className="show" onClick={() => {
                      document.querySelector('input[name="password"]').type === 'password' ? document.querySelector('input[name="password"]').type = "text" : document.querySelector('input[name="password"]').type = 'password';
                    }}></span></div>
                  </div>
                  <p className='invalidFeedback fullWidth'>{errors.password}</p>
                </FormGroup>
                <FormGroup className='formGroup d-flex justify-content-between'>
                  <div className="checkbox">
                    <input id="checkbox1" type="checkbox" checked={checked || false} onChange={() => setChecked(!checked)}/>
                    <FormLabel className="text-muted" htmlFor="checkbox1">Remember password</FormLabel>
                  </div>
                  <FormLabel className="text-muted">Don't have an account? <Link to="/register">Register</Link></FormLabel>
                </FormGroup>
                <FormGroup className='formGroup d-flex justify-content-end'>
                  <Button className="login-btn" color="primary" onClick={handleClick}>Log In</Button>
                </FormGroup>
              </Form>
            </Card>
          </Container>
        </Col>
      </Row>
    </>
  )
}
export default Login;