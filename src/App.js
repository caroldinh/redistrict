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

            <p>Segregated schooling may have been made illegal by <i>Brown vs. Board of Education</i>, but in reality, 
              many school zones still struggle with de-facto segregation today. 
              What this means is that some school zones are set up to encompass more wealthy neighborhoods whereas 
              others are set up to encompass poorer neighborhoods, and because public schools are paid for using tax money 
              collected from the area, schools in poorer areas have less funding. Combine this with housing segregation and 
              we get the unfortunate reality that many BIPOC attend underfunded schools.</p>
              <br></br>

              <p>
                RedistrictMe is a crowdsourced web application that displays this reality visually. Use the dropdown menus 
                below to navigate statistics from all of the schools in our database, and take action by composing a letter to your school district's 
                leadership board using the email template we've generated for you. If your school is not in the database, feel 
                free to add it.
              </p>

              <br></br>

            <div id="navlinks">
              <a href="#data">Exlore Data</a>
              <a href="#contact">Contact Your School Board</a>
              <a href="#addSchool">Add Your School</a>
              <a href="#addContact">Add Contact</a>
            </div>

            

            <a id="data" class="divider"></a>
            
            <AllData></AllData>
            <center class="spacer"><a href="#">Back to top</a></center>


            <a id="addSchool" class="divider"></a>

            <h3>Add Your School</h3>
            <p>Add your school's demographic data and graduation statistics using the form below. If you don't know one of the 
              values, please leave it blank. Enter the full name of your high school, state, and school district (no acronyms please - 
              "Richard Montgomery High School" rather than "Richard Montgomery HS", "Montgomery County Public Schools" rathern than "MCPS").
            </p>

            <AddSchool></AddSchool>
            <center class="spacer"><a href="#">Back to top</a></center>
            
            <a id="addContact" class="divider"></a>

            <h3>Add Contact Information</h3>
            <p>Add contact information for the leaders of your state/school district's board of education. </p>

            <AddContact></AddContact>
            <center class="spacer"><a href="#">Back to top</a></center>

            <div class="footer">
              <a href="https://github.com/cyborg48/redistrict" target="_blank" class="small footerlink">GitHub</a>
              <a href="https://devpost.com/software/redistrict" target="_blank" class="small footerlink">DevPost</a>
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
    this.setState({
      data:null,
      loading:true,
      state:'',
    });

    this.handleChange = this.handleInputChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(name == "state"){

      var newDistrict = Object.keys(this.state.snapshot.child(target.value).val())[0];

      var state_contacts = this.state.snapshot.child(value).child("contacts").val();
      var state_keys = [];
      if(state_contacts != null){
        state_keys = Object.keys(state_contacts);
      }
      var dist_contacts = this.state.snapshot.child(value).child(newDistrict).child("contacts").val();
      var dist_keys = [];
      if(dist_contacts != null){
        dist_keys = Object.keys(dist_contacts);
      }
      var contacts = [];
      state_keys.forEach(function(item){
        contacts.push(state_contacts[item]);
      });
      dist_keys.forEach(function(item){
        contacts.push(dist_contacts[item]);
      });

      this.setState({
        data:this.state.data,
        snapshot:this.state.snapshot,
        loading:false,
        state: value,
        district:newDistrict,
        school:"all",
        contacts: contacts,
      });
    }

    if(name == "district"){

      var state_contacts = this.state.snapshot.child(this.state.state).child("contacts").val();
      var state_keys = [];
      if(state_contacts != null){
        state_keys = Object.keys(state_contacts);
      }
      var dist_contacts = this.state.snapshot.child(this.state.state).child(value).child("contacts").val();
      console.log(dist_contacts);
      var dist_keys = [];
      if(dist_contacts != null){
        dist_keys = Object.keys(dist_contacts);
      }
      var contacts = [];
      state_keys.forEach(function(item){
        contacts.push(state_contacts[item]);
      });
      dist_keys.forEach(function(item){
        contacts.push(dist_contacts[item]);
      });
      console.log(contacts);

      this.setState({
        data:this.state.data,
        snapshot:this.state.snapshot,
        loading:false,
        state: this.state.state,
        district:value,
        school:"all",
        contacts:contacts,
      });
    }

    if(name == "school"){
      this.setState({
        data:this.state.data,
        snapshot:this.state.snapshot,
        loading:false,
        state: this.state.state,
        district:this.state.district,
        school:value,
        contacts:this.state.contacts,
      });
    }

  }

  componentWillMount(){  

    const ctx = this
    var db = firebase.database().ref().child("redistrict")
    this.setState(db.once("value").then(dataSnapshot => {
      var response = dataSnapshot.val();
      var state = Object.keys(response)[0];
      var district = Object.keys(dataSnapshot.child(Object.keys(response)[0]).val())[0];
      var state_contacts = dataSnapshot.child(state).child("contacts").val();
      var state_keys = Object.keys(state_contacts);
      var dist_contacts = dataSnapshot.child(state).child(district).child("contacts").val();
      var dist_keys = Object.keys(dist_contacts);
      var contacts = [];
      state_keys.forEach(function(item){
        contacts.push(state_contacts[item]);
      });
      dist_keys.forEach(function(item){
        contacts.push(dist_contacts[item]);
      });
      console.log(contacts);
      ctx.setState({ data: response, snapshot:dataSnapshot, loading: false, state:state,
        district: district,
        school:"all",
        contacts:contacts,
      });
    }));

  }

  render() {

    return this.state.data == null ? (
      <div>
          <div class="loader"></div>
      </div>
      ) : (
        <div>
            <form>
            <label>
              State:
              <select name="state" onChange={this.handleChange}>
                {Object.keys(this.state.data).map(name => (
                  <option value={name}>{name}</option>
                ))}
                
              </select>
            </label>  

            <label>
              School District:
              <select name="district" onChange={this.handleChange}>
                {Object.keys(this.state.snapshot.child(this.state.state).val()).map(name => name != "contacts" ? (
                  <option value={name}>{name}</option>
                ): (<div></div>)
                )}
                
              </select>
            </label> 

            <label>
              Schools:
              <select name="school" onChange={this.handleChange}>
                <option value="all">All</option>
                {Object.keys(this.state.snapshot.child(this.state.state).child(this.state.district).val()).map(name => name != "contacts" ? (
                  <option value={name}>{name}</option>
                ) : (<div></div>) 
                )}
                
              </select>
            </label> 

            {this.state.school != "all" &&
            <SchoolData state={this.state.state} district={this.state.district} school={this.state.school}></SchoolData>
            }

          {this.state.school == "all" &&
            <label>
              Schools:<br></br>
              {Object.keys(this.state.snapshot.child(this.state.state).child(this.state.district).val()).map(name => name != "contacts" ? (
                  <SchoolData state={this.state.state} district={this.state.district} school={name}></SchoolData>
                ) : (<div></div>)
                )}
            </label> 
            }
          </form>
          <center class="spacer"><a href="#">Back to top</a></center>

             <a id="contact" class="divider"></a>
             <h3>Contact your Leaders</h3>
            <p>Take action against school zone segregation and send your demands directly to the leaders of your school district
              using the email template below. Using the dropdowns above, select your state and your school district to incorporate it into 
              the email template.
            </p>
            <Letter contacts={this.state.contacts} state={this.state.state} district={this.state.district}></Letter>
      </div>
    );
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

    const ctx = this;
    var db = firebase.database().ref().child("redistrict").child(this.props.state).child(this.props.district).child(this.props.school);
    this.setState(db.once("value").then(dataSnapshot => {
      var response = dataSnapshot.val();
      ctx.setState({ data: response, loading: false });
    }));

  }

  componentWillReceiveProps(nextProps) {
    console.log("New school " + nextProps.school)
    if (nextProps.school !== this.props.school) {
      const ctx = this;
      var db = firebase.database().ref().child("redistrict").child(this.props.state).child(this.props.district).child(nextProps.school);
      this.setState(db.once("value").then(dataSnapshot => {
        var response = dataSnapshot.val();
        ctx.setState({ data: response, loading: false });
      }));
    }
    if (nextProps.district !== this.props.district) {
      const ctx = this;
      var db = firebase.database().ref().child("redistrict").child(this.props.state).child(nextProps.district).child(nextProps.school);
      this.setState(db.once("value").then(dataSnapshot => {
        var response = dataSnapshot.val();
        ctx.setState({ data: response, loading: false });
      }));
    }
    if (nextProps.state !== this.props.state) {
      const ctx = this;
      var db = firebase.database().ref().child("redistrict").child(nextProps.state).child(nextProps.district).child(nextProps.school);
      this.setState(db.once("value").then(dataSnapshot => {
        var response = dataSnapshot.val();
        ctx.setState({ data: response, loading: false });
      }));
    }
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
        <PieChart data={this.state.data.demographics}></PieChart><br></br>
        <p>Graduation rate: {this.state.data.statistics.graduation_rate}</p>
        <p>Dropout rate: {this.state.data.statistics.dropout_rate}</p>
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
            position:'left',
            labels: {
                font: {
                  color: '#FFFFFF'
              }
            }
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        labels: ["% American Indian / Alaska Native", "% Asian", "% Black", "% Hispanic / Latino", "% Pacific Islander", "% Multiracial / Mixed Race", "% White"],
      datasets:[{
        data: [nextProps.data.aian, nextProps.data.asian, nextProps.data.black, nextProps.data.hispanic, nextProps.data.pacific, nextProps.data.multi, nextProps.data.white],
        backgroundColor: ['red','orange','yellow','green','blue','purple','white'],
      }],
      options:{
        legend: {
            position:'left',
            labels: {
                font: {
                  color: '#FFFFFF'
              }
            }
        }
      }
    });
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
      //event.preventDefault();
    }
    
  }

  render() {
    return (

      <div class="card schoolcard">

        <form id="addSchool" onSubmit={this.handleSubmit}>

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
                <br></br>
                <label class="right-align">
                  Graduation Rate: <input name="graduation" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label class="right-align">
                  Dropout Rate: <input name="dropout" class="stat" type="number" step="0.1" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
                </label>
                </div>
                <div class="col-6 right-align">
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
      </div>
    );
  }
}

class AddContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'state',
      state: '',
      district: '',
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
        var db = firebase.database().ref().child("redistrict").child(this.state.state).child("contacts");
        db.push({[this.state.contactname]:this.state.email});
      } else {
        var db = firebase.database().ref().child("redistrict").child(this.state.state).child(this.state.district).child("contacts");
        db.push({[this.state.contactname]:this.state.email});
      }
    }

    alert("Added contact");
    
  }

  render() {
    return (

      <div class="card schoolcard">
        <form onSubmit={this.handleSubmit}>
          <label>
            Contact Type:
            <select name="type" onChange={this.handleChange}>
              <option value="state">State</option>
              <option value="district">District</option>
            </select>
          </label>
          <label>
            State: <input name="state" class="long-input"  type="text" value={this.state.value} onChange={this.handleChange} placeholder="Maryland" required/>
          </label>
          <label>
            School District (if applicable): <input name="district" class="long-input"  type="text" value={this.state.value} onChange={this.handleChange} placeholder="Montgomery County Public Schools"/>
          </label>
          <label>
            Contact Name: <input name="contactname" class="long-input"  type="text" value={this.state.value} onChange={this.handleChange} placeholder="Board of Education" required/>
          </label>
          <label>
            Email: <input name="email" class="long-input" type="email" value={this.state.value} onChange={this.handleChange} placeholder="boe@mcpsmd.org" required/>
          </label>
          
          <input type="submit" class="btn" value="Submit" />
        </form>
      </div>
    );
  }
}

class Letter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      observations:'',
      personal:'',
    };
    this.handleChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

      this.setState({
        [name]: value
      });

  }

  render() {
    return (

      <div class="card schoolcard">

        <div class="row">
        <div class="col-6">

        <form>
          <label>
            Your name: <input name="name" class="long-input"  type="text" value={this.state.value} onChange={this.handleChange} required/>
          </label>
          <label>
            Your email: <input name="email" class="long-input"  type="email" value={this.state.value} onChange={this.handleChange} required/>
          </label>
          <label>
            Your observations:
            <p class="prompt">What did you notice about the data? For the schools with higher graduation rates, what trend did you see in the 
              demographics? What about for the schools with lower graduation rates? Why do you thiink this is? 
              Where there any schools that didn't follow this trend?
            </p>
             <textarea name="observations" class="long-input" value={this.state.value} onChange={this.handleChange} placeholder="While reviewing
             statistics about schools in our county, I noticed..." required/>
          </label>
          <label>
            Why this is important to you:
            <p class="prompt">Do you have any personal experiences related to schooling and segregation? Anything you've noticed within 
            your own school or community? Why is it important to you? Do you have any additional demands? Your leaders are more likely to 
            listen if you send them a personalized letter - be sure to add your own take to the template so that your email isn't marked as spam.
            </p>
             <textarea name="personal" class="long-input" value={this.state.value} onChange={this.handleChange} placeholder="While reviewing
             statistics about schools in our county, I noticed..." required/>
          </label>
          <p>After filling in this information, open your inbox and copy and paste the email on the right into a new message. Copy 
            and paste the contacts into the recipients bar and the subject line into the subject bar, and you're good to go! </p>
        </form>

        </div>
        <div class="col-6">
          <h4>From: <div class="contact-email">{this.state.email}</div></h4>
          <h4>To: {Object.keys(this.props.contacts).map(key =>
            <div class="email-list"><div class="contact-email">{this.props.contacts[key][Object.keys(this.props.contacts[key])]}</div>,</div>
            )}</h4>
          <h4>Subject: <strong>Our Schools Are Still Segregated</strong></h4><br></br>
          <div class="letter">
          <p class="letter-paragraph">To whom it may concern,</p>
          <p class="letter-paragraph">I am a student from {this.props.district} in {this.props.state} and I am writing to demand 
          that you take action against segregated schooling. While <i>de jure</i> segregation may be illegal, <i>de facto</i> segregation 
          is still the reality all across America, and {this.props.district} is no exception. BIPOC students, especially
          those in poorer areas, are more likely than their white counterparts to attend an underfunded school. Hence, these students 
          have lesser access to the mentorship, technology, and quality courses than students in wealthier schools. Furthermore, 
          schools with higher concentration of BIPOC are more heavily monitored by police, which is absolutely unnecessary.</p>
          <p class="letter-paragraph">{this.state.observations}</p>
          <p class="letter-paragraph">{this.state.personal}</p>
          <p class="letter-paragraph">In light of all this, I am urging you to consider the school zones established by {this.props.district} and 
          redistrict. Due to segregated school zoning, many BIPOC students don't have the same opportunities that their white 
          counterparts do, and this is unacceptable. </p>
          <p class="letter-paragraph">Beyond redistricting, I demand that you take action to provide BIPOC with the educational opportunities they deserve,
          from increasing the funding of and decreasing the policing of their schools, giving them more opportunities to join accelerated courses, and revising the curricula of English and history 
          classes to represent their narratives in the classroom. Separate is inherently unequal as ruled by <i>Brown v. Board of Education</i>. As a leader 
          in public education, it is your responsibility to uphold this legacy and take action to make {this.props.district} a fully 
          integrated school district.</p>
          <p class="letter-paragraph">Regards,</p>
          <p class="letter-paragraph">{this.state.name}</p>
          </div>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;