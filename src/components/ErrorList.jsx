import Immutable from "immutable";
import React from "react";
import ReactDOM from "react-dom";
import Alert from "react-bootstrap/lib/Alert";
import Button from "react-bootstrap/lib/Button";
import Col from "react-bootstrap/lib/Col";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Grid from "react-bootstrap/lib/Grid";
import Panel from "react-bootstrap/lib/Panel";
import Row from "react-bootstrap/lib/Row";

import * as ErrorActions from "../actions/ErrorActions";

import ErrorStore from "../stores/ErrorStore";

export default class ErrorList extends React.Component {
  constructor(props) {
    super(props);
    
    this.errorSubscription = null;
    this.state = {
      errorList: Immutable.List(),
    };
  }
  
  render() {
    if (this.state.errorList.isEmpty()) {
      return <div/>;
    }

    var errorAlerts = this.state.errorList.map((error) => {
      return (
        <Alert key={error.get("id")} bsStyle="danger" onDismiss={this.handleErrorDismiss.bind(this, error)}>
          {(error.get("message1")) ? <h4>{error.get("message1")}</h4> : ""}
          {(error.get("message2")) ? <p>{error.get("message2")}</p> : ""}
        </Alert>
      );
    }).toArray();

    var clearAllErrors = "";
    if (this.state.errorList.count() > 1) {
      clearAllErrors = <Panel bsStyle="danger"><Button bsStyle="danger" className="pull-right" onClick={this.handleClearAllErrors.bind(this)}><Glyphicon glyph='remove'/> すべてのエラーを消去</Button></Panel>;
    }

    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            {errorAlerts}
            {clearAllErrors}
          </Col>
        </Row>
      </Grid>
    );
  }
  
  componentDidMount() {
    this.errorSubscription = this.props.errorStore.getSource()
    .subscribe((errors) => {
      this.setState({
        errorList: errors,
      });
    });
  }
  
  componentWillUnmount() {
    if (this.errorSubscription != null) {
      this.errorSubscription.dispose();
      this.errorSubscription = null;
    }
  }
  
  handleErrorDismiss(error) {
    ErrorActions.clearError(error.get("id"));
  }

  handleClearAllErrors() {
    ErrorActions.clearAllErrors();
  }
}
