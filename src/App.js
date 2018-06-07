import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ ImageLinkForm/ ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'bd72dbf17d004e34ae9235ae70e5574e'
 });

const particleOption = {
  particles: {
    number:{
      value:200,
      density:{
        enable:true,
        value_area: 800
      }
    }
  }
}


class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route: 'signin'
    }
  }

calCulateFaceLocation=(data)=>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  console.log(clarifaiFace);
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const heigth = Number(image.height);
  // console.log(width, heigth);
  return {
    leftCol: clarifaiFace.left_col  * width,
    topRow: clarifaiFace.top_row * heigth,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: heigth - (clarifaiFace.bottom_row * heigth),
  }

}
displayFaceBox  = (box)=>{
  this.setState({box: box})
  console.log(box);
}
  onInputChange=(event)=>{
    this.setState({input:event.target.value});

  }

  onSubmitButton=()=>{
   this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response=>this.displayFaceBox(this.calCulateFaceLocation(response)))
    .catch(err=>console.log(err));
  }
  onRouteChange=(route)=>{
    this.setState({route : route});  
  }

  render() {
    return (
      <div className="App">
      <Particles className="particles" 
      params={particleOption}
      />
        <Navigation onRouteChange={this.onRouteChange}/>
        {this.state.route === "signin"?
        <SignIn onRouteChange={this.onRouteChange}/>
        :<div><Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onSubmitButton={this.onSubmitButton} />
       
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
        }
      </div>
    );
  }
}

export default App;
