import React,{Component} from "react";
import Particles from 'react-particles-js';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Rank from "./components/Rank/Rank";
import './App.css';
import Clarifai from "clarifai";

const app = new Clarifai.App({
 apiKey: '0be60aeb60f047459df062b1d9ff2921'
});

const particlesOptions={
  particles: {
    number: {
      value:150,
      density:{ 
        enable: true,
        value_area:800
      }
    }
  }
}

class App extends Component{
  constructor(){
    super();
    this.state= {
      input:"",
      imageUrl:"",
      box:{},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation=(data)=>{
    const calarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image= document.getElementById("inputimage");
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      leftCol:calarifaiFace.left_col*width,
      topRow: calarifaiFace.top_row*height,
      rightCol: width-(calarifaiFace.right_col*width),
      bottomRow: height -(calarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box:box});
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input})
    app.models
    .predict(
      "a403429f2ddf4b49b307e318f00e528b",
      this.state.input)
    .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err=>console.log(err));
  }

  onRouteChange=(route)=>{
    if(route==="home"){
      this.setState({isSignedIn:true});
    }else if(route=== "signin"){
      this.setState({isSignedIn:false});
    }
    this.setState({route : route});
  }

  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles className="particles" 
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route==='home'
          ? <div>
              <Logo />
              <Rank/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition  imageUrl={imageUrl} box={box}/>
            </div>
          : (route==="signin")
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
        }
      </div>
    );
  }
}

export default App;
