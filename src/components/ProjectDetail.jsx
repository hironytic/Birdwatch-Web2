import moment from "moment";
import Panel from "react-bootstrap/lib/Panel";
import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite-extras";
import Static from "react-bootstrap/lib/FormControls/Static";
import Table from "react-bootstrap/lib/Table";

import { reloadMilestones } from "../actions/ProjectActions";
import familyMasterStore from "../stores/FamilyMasterStore";
import platformMasterStore from "../stores/PlatformMasterStore";
import projectMilestoneStore from "../stores/ProjectMilestoneStore";
import projectStore from "../stores/ProjectStore";
import milestoneMasterStore from "../stores/MilestoneMasterStore";

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

export default class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    
    this.disposeBag = new Rx.CompositeDisposable();
    
    this.state = {
      projectInfo: null,
      projectMilestoneInfo: null,
      projectMilestoneLoading: null,
      platformMaster: null,
      familyMaster: null,
      milestoneMaster: null,
    };
  }
  
  render() {    
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
  
  renderMilestones() {
    let milestones;
    if (this.state.projectMilestoneInfo == null) {
      milestones = [];
    } else {
      milestones = this.state.projectMilestoneInfo
        .map(milestone => {
          const internalDate = milestone.get("internalDate");
          const internalMoment = moment(internalDate);
          const internalDateString = internalMoment.format("YYYY-MM-DD");
          let dateString = milestone.get("dateString");
          if (dateString == "") {
            dateString = internalMoment.format("M/D");
          }
          const milestoneName = getMasterName(this.state.milestoneMaster, milestone.get("milestoneId"));
          return (
            <tr key={"id_" + milestone.get("id")}>
              <td className="col-xs-4">{milestoneName}</td>
              <td className="col-xs-4">{internalDateString}</td>
              <td className="col-xs-4">{dateString}</td>
            </tr>
          );
        })
        .toArray();
    }
    
    if (this.state.projectMilestoneLoading) {
      milestones.push((
        <tr key="loading">
          <td colSpan="3" className="col-xs-12">
            <div className="text-center">
              <img src="image/loading.gif"/>
            </div>
          </td>
        </tr>
      ));
    }
    
    return (
      <Table condensed>
        <thead>
          <tr>
            <th className="col-xs-4">イベント</th>
            <th className="col-xs-4">内部日付</th>
            <th className="col-xs-4">表示</th>
          </tr>
        </thead>
        <tbody>
          {milestones}
        </tbody>
      </Table>
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
      projectMilestoneStore
        .map(value => value.get("loading"))
        .subscribe(projectMilestoneLoading => {
          this.setState({
            projectMilestoneLoading: projectMilestoneLoading,
          });
        })
    )
    
    this.disposeBag.add(
      projectMilestoneStore
        .map(value => value.get("projectMilestones"))
        .subscribe(projectMilestones => {
          const milestones = projectMilestones
            .filter(pm => pm.get("projectId") == this.props.projectId)
            .toList()
            .sortBy(pm => pm.get("internalDate"))
          this.setState({
            projectMilestoneInfo: milestones,
          });
        })
    )
    
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
    
    this.disposeBag.add(
      milestoneMasterStore
        .map(value => value.get("items"))
        .subscribe(milestoneMaster => {
          this.setState({
            milestoneMaster: milestoneMaster,
          });
        })
    );
    
    reloadMilestones(this.props.projectId);
  }
  
  componentWillUnmount() {
    this.disposeBag.dispose();
  }
  
  handleSubmit(e) {
    e.preventDefault();
  }
}
