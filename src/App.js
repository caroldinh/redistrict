import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <container>
            <h1>RedistrictMe</h1>

            <AddSchool></AddSchool>

            <br></br><br></br>

            <div class="row">
              <div class="col-3">
                Search Districts
              </div>
              <div class="col-9">
                Insert explanation here
              </div>
            </div>

            <div class="footer">
              <a href="#" class="small footerlink">Add Your School</a>
              <a href="#" class="small footerlink">Add Contact</a>
              <br></br>
              <p class="small">Built by Caroline Dinh for HellooHacks 2020</p>
            </div>
        </container>

      </header>
    </div>
  );
}

class AllData extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1>{this.props.schoolName}</h1>
    )
  }
}


class SchoolData extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1>{this.props.schoolName}</h1>
    )
  }
}

class AddSchool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      school: '',
      state: '',
      county: '',
      asian: 0,
      aian: 0,
      black: 0,
      hispanic: 0,
      pacific: 0,
      multi: 0,
      white: 0
    };

    this.handleChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(target.className == "stat"){
      this.setState({
        [name]: parseFloat(value)
      });
    } else{
      this.setState({
        [name]: value
      });
    }
  }

  handleSubmit(event) {


    if(this.state.county == ""){
      this.state.county = "Montgomery County Public Schools";
      this.setState({
        county: "Montgomery County Public Schools"
      });
    }
    if(this.state.state == ""){
      this.state.state = "Maryland";
      this.setState({
        state: "Maryland"
      });
    }
    if((parseFloat(this.state.asian) + parseFloat(this.state.aian) + parseFloat(this.state.black) + 
    parseFloat(this.state.hispanic) + parseFloat(this.state.pacific) + parseFloat(this.state.multi) + parseFloat(this.state.white)) > 100.0 ){
        alert("Error: Percentages may not sum to over 100")
    } else{

      if(this.state.graduation == 0){ // If no graduation data
        var db = firebase.database().ref().child("redistrict").child(this.state.state).child(this.state.county).child(this.state.school).child("demographics");
        db.set({
          asian: this.state.asian,
          aian: this.state.aian,
          black: this.state.black,
          hispanic: this.state.hispanic,
          pacific: this.state.pacific,
          multi: this.state.multi,
          white: this.state.white,
      });
      } else if((parseFloat(this.state.asian) + parseFloat(this.state.aian) + parseFloat(this.state.black) + 
      parseFloat(this.state.hispanic) + parseFloat(this.state.pacific) + parseFloat(this.state.multi) + parseFloat(this.state.white)) == 0 ){
        // If no demographics data
        var db = firebase.database().ref().child("redistrict").child(this.state.state).child(this.state.county).child(this.state.school).child("statistics");
      } else{
        var db = firebase.database().ref().child("redistrict").child(this.state.state).child(this.state.county).child(this.state.school);
        db.set({
          demographics:{
            asian: this.state.asian,
            aian: this.state.aian,
            black: this.state.black,
            hispanic: this.state.hispanic,
            pacific: this.state.pacific,
            multi: this.state.multi,
            white: this.state.white,
        }, statistics:{
            graduation_rate: this.state.graduation,
            dropout_rate: this.state.dropout,
        }
        });
      }

      //var db = firebase.database().ref().child("redistrict").child(this.state.state).child(this.state.county).child(this.state.school);
        
      // alert('Submission: ' + this.state.school + " from " + this.state.county + ", " + this.state.state);
      event.preventDefault();
        
    }
    
  }

  render() {
    return (

      <form onSubmit={this.handleSubmit}>
        <label>
          School: <input name="school" type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          School District: <input name="county" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Montgomery County Public Schools"/>
        </label>
        <label>
          State: <input name="state" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Maryland" />
        </label>
        <label>
          % American Indian/Alaska Native: <input name="aian" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          % Asian: <input name="asian" class="stat" type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          % Black/African American: <input name="black" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          % Hispanic/Latino (of any race): <input name="hispanic" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          % Pacific Islander: <input name="pacific" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          % White: <input name="white" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          % Multiracial/Mixed race: <input name="multi" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          Graduation Rate: <input name="graduation" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          Dropout Rate: <input name="dropout" class="stat" type="number" step="0.1" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


class AddContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'state',
      contactname: '',
      email: '',
    };

    this.handleChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(target.className == "stat"){
      this.setState({
        [name]: parseFloat(value)
      });
    } else{
      this.setState({
        [name]: value
      });
    }
  }

  handleSubmit(event) {

    if(this.state.state == ""){
      alert("State name may not be blank");
    }
    else if(this.state.type == "district" && this.state.district == ""){
      alert("District name may not be blank");
    } else if(this.state.contactname == ""){
      alert("Contact name may not be blank");
    } else if(this.state.email == ""){
      alert("Email may not be blank");
    } else{
      if(this.state.type == "state"){
        var db = firebase.database().ref().child("redistrict").child(this.state.state).child("contacts")
        db.push({
          [this.state.contactname]:this.state.email
        });
        // alert('Submission: ' + this.state.school + " from " + this.state.county + ", " + this.state.state);
      } else {
        var db = firebase.database().ref().child("redistrict").child(this.state.state).child(this.state.district).child("contacts")
        db.push({
          [this.state.contactname]:this.state.email
        });
      }
    }

    event.preventDefault();
    
  }

  render() {
    return (

      <form onSubmit={this.handleSubmit}>
        <label>
          Contact Type:
          <select name="type" onChange={this.handleChange}>
            <option value="state">State</option>
            <option value="district">District</option>
          </select>
        </label>
        <label>
          State: <input name="state" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Maryland"/>
        </label>
        <label>
          School District (if applicable): <input name="district" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Montgomery County Public Schools"/>
        </label>
        <label>
          Contact Name: <input name="contactname" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Board of Education"/>
        </label>
        <label>
          Email: <input name="email" type="email" value={this.state.value} onChange={this.handleChange} placeholder="boe@mcpsmd.org"/>
        </label>
        
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default App;