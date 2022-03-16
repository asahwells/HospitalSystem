import React, { Component } from "react";
import firebase from "../../firebase";
import "react-datepicker/dist/react-datepicker.css";
import NewPersonDetailsForm from "./newpersondetailsform";
import Service from "../../Service/firebase";
import "./addpersonDetails.css";
import { Country, State, City }  from 'country-state-city';

class AddPersonDetails extends Component {
  constructor() {
    super();
    
  
    this.state = {
      imageAvatar: "",
      imagefile: "",
      date: null,
      // startDate: new Date(),
      isLoading: false,
      htmlelement: <i className="fa fa-user fa-8x" aria-hidden="true"></i>,

      formData: {
        firstname: "",
        lastname: "",
        sex: "",
        age: "",
        bloodgroup: "",
        phonenumber: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        Nextofkin: "",
        Nextofkinemail: "",
        Nextofkinaddress:"",
        remark: "",
        birthdate: null,
      },
    };
  }

  handleSubmit = () => {
    this.setState({
      isLoading: true,
    });

    // console.log(this.state.formData.lastname)
    this.props.setCloseBtnAppear();
    this.handleImageForUpload();
  };
  handleImageForUpload = () => {
    const image = this.state.imagefile;
    const url = "";

    if (this.state.imagefile !== "") {
      this.onUploadImage(image);
    } else {
      this.onAddPerson(url);
    }
  };
  onUploadImage = async (image) => {
    const url = await Service.uploadImage(image);
    if (url !== "") {
      this.onAddPerson(url);
    }
  };
  async onAddPerson(imageUrl) {
    let sendData = {
      ...this.state.formData,
      searchbyname: (
        this.state.formData.firstname + this.state.formData.lastname
      ).toLowerCase(),
      imgaeurl: imageUrl,
      timeStamp: firebase.firestore.Timestamp.fromDate(new Date()),
    };
    let emails = this.state.formData.email
    let passwords = this.state.formData.firstname + this.state.formData.lastname
    // console.log('email', email, password
    // )
    if (this.props.collectionName === "patients") {
      sendData = {
        ...sendData,

        bedallotementid: "",
        operationreportid: "",
        birthreportid: "",
        deathreportid: "",
        role: "patient",
      };
    }
    let res
    if (this.props.collectionName === "doctors") {
      sendData = {
        ...sendData,

        role: "doctor",
     }
      res = await Service.addData(
        sendData,
        emails,
        passwords,
        this.props.collectionName,
        this.props.id
      );
    } else if (this.props.collectionName === "pharmacists")
    {
      sendData ={...sendData,
      role: "pharmacists",
      }
      res = await Service.addRPharmData(
        sendData,
        emails,
        passwords,
        this.props.id
      );
    }
    else {
      
      res = await Service.addPatData(
        sendData,
        this.props.collectionName,
        this.props.id,
      );
}

    if (res && res === "success") {
      this.setState({
        isLoading: false,
      });

      this.props.handleSuccessDailog();
    } else {
      this.setState({
        isLoading: false,
      });
      this.props.handleErrorDailog();
    }
  }

  handleChange = (date) => {
    if (date !== null) {
      const birthDate = new Date(date);

      this.setState({
        date: date,
        formData: {
          ...this.state.formData,
          birthdate: `${birthDate.getMonth() + 1
            }/${birthDate.getDate()}/${birthDate.getFullYear()}`,
        },

        startDate: date,
      });
    } else {
      this.setState({
        date: date,
        formData: {
          ...this.state.formData,
          birthdate: date,
        },

        startDate: date,
      });
    }
  };
  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        imagefile: event.target.files[0],
      });
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({
          imageAvatar: e.target.result,
          htmlelement: (
            <div className="addpersonpage">
              <img
                className="netimage"
                srcSet={e.target.result}
                alt="profileImage"
              />
            </div>
          ),
        });
      };
      reader.readAsDataURL(event.target.files[0]);
      this.setState({});
    }
  };
  onImageRemove = () => {
    this.setState({
      imagefile: "",
      imageAvatar: "",
      htmlelement: (
        <div className="addpersonpage">
          <i className="fa fa-user fa-8x" aria-hidden="true"></i>
        </div>
      ),
    });
  };
  onEdit = (e) => {
    const formData = this.state.formData;
    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      },
    });
  };


  render() {
    // if (this.state.imageAvatar === "") {
    //   this.state.htmlelement = (
    //     <div className="addpersonpage">
    //       <i className="fa fa-user fa-8x" aria-hidden="true"></i>
    //     </div>
    //   );
    // } else {
    //   this.state.htmlelement = (
    //     <div className="addpersonpage">
    //       <img className="netimage" srcSet={this.state.imageAvatar} alt="" />
    //     </div>
    //   );
    // }
    return this.state.isLoading ? (
      <div className="addpersonpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className="addpersonpage">
        <div className="container main_section">
          <div className="row">
            <div className="col-sm">
              <NewPersonDetailsForm
                handleSubmit={this.handleSubmit}
                onEdit={this.onEdit}
                // startDate={this.state.startDate}
                date={this.state.date}
                htmlelement={this.state.htmlelement}
                handleChange={this.handleChange}
                onImageRemove={this.onImageRemove}
                onImageChange={this.onImageChange}
              ></NewPersonDetailsForm>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AddPersonDetails;
