import { Fragment, useContext, useState } from 'react';
import {Button, Row, Col, Container, Form, FormGroup, InputGroup, FormLabel, FormControl, Card} from 'react-bootstrap';
import { patterns } from '../Validation';
import { registerUser } from '../Endpoint';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import emailIcon from '../assets/images/email.png';
import userIcon from '../assets/images/user.png';
import passwordIcon from '../assets/images/lock.png';
import Swal from 'sweetalert2';

const Register = () => {
  const initialValues = {
    userName: '',
    email: '',
    password: ''
  }
  const [user, setUser] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const history = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({...user, [name]: value})
  }

  const validate = (vals) => {
    const errors = {};
    if(!patterns.userName.test(vals.userName)){
      errors.userName = 'Enter an existing Username!';
    }
    if(!patterns.email.test(vals.email)){
      errors.email = 'Enter an existing Email!';
    }
    if(!patterns.password.test(vals.password)){
      errors.password = 'Your password must contain more than 6 letters';
    }
    return errors;
  }

  //--------------------------DATA FORMAT FOR BACKEND------------------------//
  // const userData = {
  //   Name: "John Doe",
  //   Email: "john@example.com",
  //   UserName: "johndoe",
  //   PasswordHash: "Password1."
  // };


  const handleClick = async () => {
    setErrors(validate(user));
    if(patterns.userName.test(user.userName) && patterns.password.test(user.password)){
      try{
        axios.post(registerUser, {Name: user.userName, Email: user.email, UserName: user.userName, PasswordHash: user.password})
        .then((res) => {
          Swal.fire({
            title: res?.data?.message || "Registered Successfully!",
            icon: "success"
          })
          history('/login');
      })
      // .catch((res) => {
      //   Swal.fire({
      //     title: 'Something went wrong...',
      //     // html: `<div> ${res?.response?.data?.errors.map(item => (
      //     //   item.code + ' -> ' + item.description + '<br />'
      //     // ))}  </div>`,
      //     icon: 'error'
      //   });
      // })
    }
      catch (err) {
        if(!err.response){  
          setErrors({globalError: 'Error, No Server Response!'})
        } else if (err.response?.status === 400) {
          setErrors({globalError: 'Missing userName or Password!'})
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
                  <h5>Register</h5>
                </div>
                <FormGroup className='formGroup'>
                  <FormLabel>userName</FormLabel>
                  <div className="input-group login-form-inputs">
                    <InputGroup.Text id="basic-addon1">
                      <img src={userIcon} style={{width: '19px'}} />
                    </InputGroup.Text>
                    <FormControl className="form-control" type="text" name='userName' placeholder="e.g. johndoe" value={user.userName} onChange={handleChange} />
                  </div>
                  <p className='invalidFeedback fullWidth'>{errors.userName}</p>
                </FormGroup>
                <FormGroup className='formGroup'>
                  <FormLabel>email</FormLabel>
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
                    <div className="show-hide">
                      <span className="show" onClick={() => {
                        document.querySelector('input[name="password"]').type === 'password' ? document.querySelector('input[name="password"]').type = "text" : document.querySelector('input[name="password"]').type = 'password';
                      }}></span>
                    </div>
                  </div>
                  <p className='invalidFeedback fullWidth'>{errors.password}</p>
                </FormGroup>
                <FormGroup className='formGroup'>
                  <FormLabel className="text-muted">Already have an account? <Link to="/login">Log in</Link></FormLabel>
                </FormGroup>
                <FormGroup className='formGroup d-flex justify-content-end'>
                  <Button className="login-btn" color="primary" onClick={handleClick}>Sign In</Button>
                </FormGroup>
              </Form>
            </Card>
          </Container>
        </Col>
      </Row>
    </>
  )
}
export default Register;