import Alert from "react-bootstrap/lib/Alert";
import Button from "react-bootstrap/lib/Button";
import Col from "react-bootstrap/lib/Col";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Grid from "react-bootstrap/lib/Grid";
import Immutable from "../stubs/immutable";
import Panel from "react-bootstrap/lib/Panel";
import React from "react";
import ReactDOM from "react-dom";
import Row from "react-bootstrap/lib/Row";
import Rx from "rx-lite-extras";

import * as ErrorActions from "../actions/ErrorActions";
import { getStores } from "../flux/Flux";

export default class ErrorList extends React.Component {
  constructor(props) {
    super(props);
    
    this.disposeBag = new Rx.CompositeDisposable();
    this.state = {
      errorList: Immutable.List(),
    };
  }
  
  render() {
    if (this.state.errorList.isEmpty()) {
      return <div/>;
    }

    const errorAlerts = this.state.errorList.map((error) => {
      return (
        <Alert key={error.get("id")} bsStyle="danger" onDismiss={this.handleErrorDismiss.bind(this, error)}>
          {(error.get("message1")) ? <h4>{error.get("message1")}</h4> : ""}
          {(error.get("message2")) ? <p>{error.get("message2")}</p> : ""}
        </Alert>
      );
    }).toArray();

    let clearAllErrors = "";
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
    const { errorStore } = getStores();
    
    this.disposeBag.add(
      errorStore
        .subscribe((errors) => {
          this.setState({
            errorList: errors,
          });
        })
    );
  }
  
  componentWillUnmount() {
    this.disposeBag.dispose();
  }
  
  handleErrorDismiss(error) {
    ErrorActions.clearError(error.get("id"));
  }

  handleClearAllErrors() {
    ErrorActions.clearAllErrors();
  }
}
