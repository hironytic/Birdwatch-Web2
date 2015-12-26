import Panel from "react-bootstrap/lib/Panel";
import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite-extras";
import Static from "react-bootstrap/lib/FormControls/Static";

import familyMasterStore from "../stores/FamilyMasterStore";
import platformMasterStore from "../stores/PlatformMasterStore";
import projectStore from "../stores/ProjectStore";
import milestoneMasterStore from "../stores/MilestoneMasterStore";

export default class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    
    this.disposeBag = new Rx.CompositeDisposable();
    
    this.state = {
      projectInfo: null,
      platformMaster: null,
      familyMaster: null,
    };
  }
  
  render() {
    const getMasterName = (master, itemId) => {
      if (master != null) {
        const item = master.get(itemId);
        if (item != null) {
          const name = item.get("name");
          if (name != null) {
            return name;
          }
        }
      }
      return "";
    };
    
    let projectForm;
    if (this.state.projectInfo == null) {
      projectForm = (<div />);
    } else {
      const projectName = this.state.projectInfo.get("name");
      const projectCode = this.state.projectInfo.get("projectCode");
      const familyName = getMasterName(this.state.familyMaster, this.state.projectInfo.get("familyId"));
      const platformName = getMasterName(this.state.platformMaster, this.state.projectInfo.get("platformId"));
      const version = this.state.projectInfo.get("version");      
      projectForm = (
        <form className="form-horizontal" action="#" onSubmit={this.handleSubmit.bind(this)}>
          <Static label="名称" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={projectName}/>
          <Static label="プロジェクトコード" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={projectCode}/>
          <Static label="プロダクト" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={familyName}/>
          <Static label="OS" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={platformName}/>
          <Static label="内部バージョン" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={version}/>
          <div className="form-group">
            <label className="col-sm-3 control-label">マイルストーン</label>
            <div className="col-sm-9">
              {this.renderMilestones()}
            </div>
          </div>
        </form>
      );
    }

    return (
      <div>
        {projectForm}
      </div>
    );
  }
  
  componentDidMount() {
    this.disposeBag.add(
      projectStore
        .map(value => value.get("projects").get(this.props.projectId))
        .subscribe(projectInfo => {
          this.setState({
            projectInfo: projectInfo,
          });
        })
    );
    
    this.disposeBag.add(
      platformMasterStore
        .map(value => value.get("items"))
        .subscribe(platformMaster => {
          this.setState({
            platformMaster: platformMaster,
          });
        })
    );
      
    this.disposeBag.add(
      familyMasterStore
        .map(value => value.get("items"))
        .subscribe(familyMaster => {
          this.setState({
            familyMaster: familyMaster,
          });
        })
    );
  }
  
  componentWillUnmount() {
    this.disposeBag.dispose();
  }
  
  renderMilestones() {
    return <div />;
  }
  
  handleSubmit(e) {
    e.preventDefault();
  }
}
