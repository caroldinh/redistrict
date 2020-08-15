import React from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from "chart.js";
import {Pie} from 'react-chartjs-2'

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <container>
            <h1>RedistrictMe</h1>

            <br></br><br></br>

            <SchoolData state="Maryland" district="Montgomery County Public Schools" school="Richard Montgomery High School"></SchoolData>
            
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
    this.setState({
      data:null,
      loading:true,
    });
  }
  componentWillMount(){  

    const ctx = this
    var db = firebase.database().ref().child("redistrict").child(this.props.state).child(this.props.district).child(this.props.school);
    this.setState(db.once("value").then(dataSnapshot => {
      console.log(ctx)
      var response = dataSnapshot.val();
      ctx.setState({ data: response, loading: false });
    }));

  }

  render() {

    return this.state.data == null ? (
      <div>
          <div class="loader"></div>
      </div>
      ) : (
      <div class="card">
        <div class="card-header">{this.props.school}</div>
        <div class="card-body">
        <div class="row">
          <div class="col-12">
            <PieChart data={this.state.data.demographics}></PieChart>
          </div>
        </div>
        </div>    
      </div>
    );
  }
}

class PieChart extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      labels: ["% American Indian / Alaska Native", "% Asian", "% Black", "% Hispanic / Latino", "% Pacific Islander", "% Multiracial / Mixed Race", "% White"],
      datasets:[{
        data: [this.props.data.aian, this.props.data.asian, this.props.data.black, this.props.data.hispanic, this.props.data.pacific, this.props.data.multi, this.props.data.white],
        backgroundColor: ['red','orange','yellow','green','blue','purple','white'],
      }],
      options:{
        legend: {
            labels: {
                font: {
                  color: '#FFFFFF'
              }
            }
        }
      }
    }
  }

  render(){

    return(
      <div>
          <Pie data={{
            labels: this.state.labels,
            datasets: this.state.datasets,
            options: this.state.options
          }}></Pie>
      </div>
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
      white: 0,
      graduation:0,
      dropout:0,
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
    if(isNaN(this.state.aian)){this.state.aian=0;}
    if(isNaN(this.state.asian)){this.state.asian=0;}
    if(isNaN(this.state.black)){this.state.black=0;}
    if(isNaN(this.state.hispanic)){this.state.hispanic=0;}
    if(isNaN(this.state.pacific)){this.state.pacific=0;}
    if(isNaN(this.state.multi)){this.state.multi=0;}
    if(isNaN(this.state.white)){this.state.white=0;}
    if(isNaN(this.state.graduation)){this.state.graduation=0;}
    if(isNaN(this.state.dropout)){this.state.dropout=0;}
    if((parseFloat(this.state.asian) + parseFloat(this.state.aian) + parseFloat(this.state.black) + 
    parseFloat(this.state.hispanic) + parseFloat(this.state.pacific) + parseFloat(this.state.multi) + parseFloat(this.state.white)) > 100.0 ){
        alert("Error: Percentages may not sum to over 100")
    } else{

      if(this.state.graduation == 0){ // If no graduation data

        if((parseFloat(this.state.asian) + parseFloat(this.state.aian) + parseFloat(this.state.black) + 
        parseFloat(this.state.hispanic) + parseFloat(this.state.pacific) + parseFloat(this.state.multi) + parseFloat(this.state.white)) >= 50 ){

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
        } else{

          alert("Insufficient Data")

        }
      } else if((parseFloat(this.state.asian) + parseFloat(this.state.aian) + parseFloat(this.state.black) + 
      parseFloat(this.state.hispanic) + parseFloat(this.state.pacific) + parseFloat(this.state.multi) + parseFloat(this.state.white)) == 0 ){
        // If no demographics data
          var db = firebase.database().ref().child("redistrict").child(this.state.state).child(this.state.county).child(this.state.school).child("statistics");
          db.set({
            graduation_rate: this.state.graduation,
            dropout_rate: this.state.dropout,
        });
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
        
      alert('You have entered data for: ' + this.state.school + " from " + this.state.county + ", " + this.state.state);

    }

    //event.preventDefault();
    
  }

  render() {
    return (

      <form onSubmit={this.handleSubmit}>

        <div class="row">
              <div class="col-6">
              <label>
                  School: <input name="school" class="long-input" type="text" value={this.state.value} onChange={this.handleChange} required />
                </label>
                <label>
                  School District: <input name="county" class="long-input" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Montgomery County Public Schools"/>
                </label>
                <label>
                  State: <input name="state" class="long-input" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Maryland" />
              </label>
              <label>
                Graduation Rate: <input name="graduation" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
              </label>
              <label>
                Dropout Rate: <input name="dropout" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
              </label>
              </div>
              <div class="col-6">
                <strong>Demographics</strong>
              <label>
                  % American Indian/Alaska Native: <input name="aian" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label>
                  % Asian: <input name="asian" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label>
                  % Black/African American: <input name="black" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label>
                  % Hispanic/Latino (of any race): <input name="hispanic" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label>
                  % Pacific Islander: <input name="pacific" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label>
                  % White: <input name="white" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label>
                  % Multiracial/Mixed race: <input name="multi" class="stat" type="number" step="0.1" min="0" max="100"value={this.state.value} onChange={this.handleChange} />
                </label>
              </div>
          </div>
        <center><input type="submit" value="Submit" class="btn btn-primary"/></center>
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