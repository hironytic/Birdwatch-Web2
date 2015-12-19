import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite-extras";
import ButtonInput from "react-bootstrap/lib/ButtonInput";
import Input from "react-bootstrap/lib/Input";

import * as AuthActions from "../actions/AuthActions";

import AuthStatus from "../constants/AuthStatus";

import authStateStore from "../stores/AuthStateStore";

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    
    this.disposeBag = new Rx.CompositeDisposable();
    this.state = {
      authStatus: AuthStatus.NOT_SIGNED_IN,
      userName: "",
      password: ""
    };
  }
  
  render() {
    let message;
    let bsStyle = "primary";
    let disabled = false;
    switch (this.state.authStatus) {
      case AuthStatus.NOT_SIGNED_IN:
        message = "サインイン";
        bsStyle = "primary";
        break;
      case AuthStatus.SIGNING_IN:
        message = "サインイン中…";
        bsStyle = "default";
        disabled = true;
        break;
    }

    return (
      <div>
        <div className="container">
          <form className="form-horizontal" action="#" onSubmit={this.handleSubmit.bind(this)}>
            <Input  type="text"
                    ref="userName"
                    label="ユーザー名"
                    labelClassName="col-xs-2 col-xs-offset-2"
                    wrapperClassName="col-xs-5"
                    onChange={this.handleInputTextChange.bind(this, "userName", "userName")}/>
            <Input  type="password"
                    ref="password"
                    label="パスワード"
                    labelClassName="col-xs-2 col-xs-offset-2"
                    wrapperClassName="col-xs-5"
                    onChange={this.handleInputTextChange.bind(this, "password", "password")}/>
            <ButtonInput  type="submit"
                          wrapperClassName="col-xs-5 col-xs-offset-4"
                          bsStyle={bsStyle}
                          disabled={disabled}
                          value={message}
                          block/>
          </form>
        </div>
      </div>
    );
  }
  
  componentDidMount() {
    this.disposeBag.add(
      authStateStore
        .subscribe((authState) => {
          this.setState({
            authStatus: authState.get("status"),
          });
        })
    );
  }
  
  componentWillUnmount() {
    this.disposeBag.dispose();
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.authStatus != AuthStatus.SIGNING_IN) {
      AuthActions.signIn(this.state.userName, this.state.password);
    }
  }
  
  handleInputTextChange(refName, stateName) {
    const state = {}
    state[stateName] = this.refs[refName].getValue();
    this.setState(state);
  }
}
