import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Classes } from "../../api/classes.js";
import MenuBar from "../menu/MenuBar.jsx";
import ClassListEntry from "./ClassListEntry.jsx";
import AssignmentCreator from "../assignments/AssignmentCreator.jsx";
import AssignmentGrader from "../assignments/AssignmentGrader.jsx";
import AccountCreator from "./AccountCreator.jsx";
import WalkthroughButton from "../tools/WalkthroughButton.jsx";
import Joyride from "react-joyride";

class InstructorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: "",
      selectedStudent: "",
      selectedClass: "",
      newPassword: "",
      isRunning: false,
      locale: {
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip"
      },
      steps: [
        {
          title: "Welcome To Nebula Learning!",
          text: "Welcome to Nebula Learning, thanks for checking us out! To help get you situated, we’ve created a tour highlighting some key options and features. <br/> <br/> If you’d prefer to explore on your own, clicking the “X” in this dialogue’s upper-right corner or simply clicking anywhere in your page’s shaded region will bring the tour to a close. <br/> <br/> If you ever need a refresher, click the “?” in this portal’s lower-right corner to restart the tour at any time. <br/> <br/> Have fun!",
          selector: ".wt-instructor-portal-header",
          position: "bottom"
        },
        {
          text: "You can access all of your classes through this page, the instructor portal. Let’s take a look at some important class options…",
          selector: ".classes",
          position: "right"
        },
        {
          text: "First thing’s first: class creation. To make a new class, simply give it a name, and click “Create Class”.",
          selector: ".wt-createclass"
        },
        {
          text: "Let's take an more in-depth look at one of your classes.",
          selector: ".wt-class-panel"
        },
        {
          text: "You class name shows up here. Each class is associated with a unique string of letters and numbers called a class code. If you ever need your class code, click “Get Class Code” to copy it to your clipboard.",
          selector: ".wt-class-panel-heading",
          position: "top-left"
        },
        {
          text: "Each student has an entry just like this. Students are identified both by name and username, which they use to log in.",
          selector: ".wt-student",
          position: "top-left"
        },
        {
          text: "If a student forgets their password, it’s you to the rescue! Clicking here allows you to create a new password for any student.",
          selector: ".wt-changepassword"
        },
        {
          text: "Though we encourage students to learn and explore at their own pace, sometimes it’s time to switch units.  This tool directs all your students to a new unit at their next login.",
          selector: ".panel-footer"
        },
        {
          text: "Want to create custom assignments to drive home a tricky concept or provide an extra challenge? Clicking here lets you do just that!",
          selector: ".wt-assignment-creator"
        },
        {
          text: "Clicking here brings you to Gradebook, which tracks student performance on quizzes and assignments.",
          selector: ".wt-gradebook",
          position: "top-right"
        },
        {
          text: "Click here to grade your students' assignment submissions!",
          selector: ".wt-assignment-grader"
        },
        {
          text: "You have the capability of creating classes as well. Simply type in the name of the class, and press the button!",
          selector: ".wt-create-class"
        },
        {
          text: "No matter what page you’re on, you can find the navigation bar at the top of your screen.",
          selector: ".wt-navbar",
          position: "bottom",
          isFixed: true
        },
        {
          text: "Clicking here opens up the lesson sidebar, which allows you to navigate between lessons and their pages.",
          selector: ".menu-btn",
          position: "right",
          isFixed: true
        },
        // {
        //   text: "Click on a lesson title to view its pages. Clicking again will hide them.",
        //   selector: ".toc-unit",
        //   position: "right",
        //   isFixed: true
        // },
        // {
        //   text: "Click on any page to navigate to it. Don’t forget to scroll down, there may be more pages than you can see!",
        //   selector: ".menu-subitem",
        //   position: "right",
        //   isFixed: true
        // },
        {
          text: "If you ever want to get back to our homepage, just click the Nebula logo!",
          selector: ".navbar-brand",
          position: "right",
          isFixed: true
        },
        {
          text: "This brings you to the playground, where students (and you!) can experiment with code and save custom code files.",
          selector: ".wt-playground-btn",
          position: "right",
          isFixed: true
        },
        {
          text: "Clicking here will bring you back to the instructor portal, which is where we are right now.",
          selector: ".wt-instructor-portal-btn",
          position: "left",
          isFixed: true
        },
        {
          text: "Finally, clicking on your username brings up the option to log out, and any other account options available to you.",
          selector: ".wt-profile",
          position: "left",
          isFixed: true
        },
        {
          text: "We hope you enjoyed your tour! You can click here at any time to restart it. If you still have questions, don’t hesitate to drop us a line.",
          selector: ".wt-restart-btn",
          position: "top",
          isFixed: true
        }
      ]
    };
  }

  renderClasses() {
    return this.props.classes.map(c => (
      <ClassListEntry
        key={c._id}
        changeCurrentStudent={this.changeCurrentStudent.bind(this)}
        changeCurrentClass={this.changeCurrentClass.bind(this)}
        classObject={c}
      />
    ));
  }

  handleClassNameChange(e) {
    this.setState({ className: e.target.value });
  }

  handleCreateClass(e) {
    e.preventDefault();
    if (this.state.className.length > 0) {
      Meteor.call("classes.insert", this.state.className);
    }
    this.setState({ className: "" });
  }

  handleFormSubmit(e) {
    Meteor.call(
      "user.forceSetPassword",
      this.state.selectedStudent,
      this.state.newPassword
    );
  }

  resetModal(e) {
    this.setState({
      selectedStudent: null,
      selectedClass: null,
      newPassword: ""
    });
  }

  handleNewPasswordChange(e) {
    this.setState({ newPassword: e.target.value });
  }

  changeCurrentStudent(studentID) {
    this.setState({ selectedStudent: studentID });
  }

  changeCurrentClass(selectedClass) {
    this.setState({ selectedClass });
  }

  walkthroughCallback(data) {
    if (data.type === "step:after" && data.index == 11) {
      //Don't know how to do this yet
    }

    if (
      data.action === "close" ||
      data.type === "finished" ||
      data.action === "esc"
    ) {
      Meteor.call("user.setWalkthrough", false);
      this.setState({ isRunning: false });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isRunning: this.props.user.walkthrough
      });
    }, 1000);
  }

  reactivateWalkthrough(callback) {
    this.refs.joyride.reset(true);
    callback();
  }

  handleReactivateClick() {
    setTimeout(() => {
      this.setState({ isRunning: true });
      Meteor.call("user.setWalkthrough", true);
    }, 1000);
  }

  changeCurrentClass(selectedClass) {
    this.setState({ selectedClass });
  }

  render() {
    return (
      <div className="hasMenu instructor-portal">
        <Joyride
          ref="joyride"
          steps={this.state.steps}
          run={this.state.isRunning}
          callback={this.walkthroughCallback.bind(this)}
          autoStart={true}
          locale={this.state.locale}
          type="continuous"
        />
        <MenuBar />
        <div className="container-fluid">
          <div className="page-header wt-instructor-portal-header">
            <h1 className="text-center">Instructor Portal</h1>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="classes">
                <div className="panel panel-primary panel-shadow">
                  <div className="panel-heading">
                    My Classes
                  </div>
                  <div className="panel-body">
                    {this.renderClasses()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="panel panel-primary panel-shadow">
                <div className="panel-heading">
                  Teacher Tools
                </div>
                <div className="panel-body">
                  <AssignmentCreator />
                  <AssignmentGrader />
                  <br />
                  <form
                    onSubmit={this.handleCreateClass.bind(this)}
                    className="form-inline wt-create-class class-creation-form"
                  >
                    <input
                      className="form-control"
                      value={this.state.className}
                      onChange={this.handleClassNameChange.bind(this)}
                      type="text"
                      placeholder="Class name"
                    />
                    <button type="submit" className="btn btn-default">
                      Create Class
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade password-change-modal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={this.resetModal.bind(this)}
                  >
                    <span>×</span>
                  </button>
                  <h4 className="modal-title">Change Student's Password</h4>
                </div>
                <div className="modal-body">
                  <form onSubmit={this.handleFormSubmit.bind(this)}>
                    <div className="form-group">
                      <label>Enter Password</label>
                      <input
                        type="password"
                        value={this.state.newPassword}
                        onChange={this.handleNewPasswordChange.bind(this)}
                        className="form-control"
                        placeholder="New Password"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={this.handleFormSubmit.bind(this)}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <AccountCreator currentClass={this.state.selectedClass} />
        </div>
        <WalkthroughButton
          callback={this.reactivateWalkthrough.bind(
            this,
            this.handleReactivateClick.bind(this)
          )}
        />
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe("classes");
  Meteor.subscribe("myStudents");
  return {
    user: Meteor.user(),
    students: Meteor.users.find({}).fetch(),
    classes: Classes.find({}).fetch()
  };
}, InstructorPage);
