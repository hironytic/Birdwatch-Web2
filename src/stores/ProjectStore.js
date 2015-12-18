import Immutable from "../stubs/immutable";
import Rx from "rx-lite";

import { timelineAction } from "../actions/TimelineActions";
import { projectListAction } from "../actions/ProjectActions";

import LoadStatus from "../constants/LoadStatus";

import { createStore } from "../utils/FluxUtils";

const fromTimelineAction = timelineAction
  .map(({ loadStatus, timeline }) => {
    return {
      loadStatus: loadStatus,
      projectList: timeline.map(projectMilestone => projectMilestone.getProject()),
    };
  })

const fromProjectListAction = projectListAction

export default createStore("projectStore",
  Rx.Observable.merge(fromTimelineAction, fromProjectListAction)
    .scan((acc, { loadStatus, projectList }) => {
      // 誰かがsubscribeしている限り、新しいものを更新していくだけなので
      // NOT_LOADEDになっても一部ロードされた状態になる可能性があるため、
      // NOT_LOADEDはLOADEDにまるめてしまうことにする。
      let newLoadStatus = loadStatus;
      if (newLoadStatus == LoadStatus.NOT_LOADED) {
        newLoadStatus = LoadStatus.LOADED;
      }
      
      const newProjects = acc.get("projects").withMutations(projectMap => {
        projectList.forEach((project) => {
          projectMap.set(project.id, Immutable.Map({
            id: project.id,
            name: project.getName(),
            familyId: project.getFamily().id,
            platformId: project.getPlatform().id,
            projectCode: project.getProjectCode(),
            version: project.getVersion(),
          }));
        });
      });
      
      return Immutable.Map({
        loadStatus: newLoadStatus,
        projects: newProjects,
      });
    }, Immutable.Map({
      loadStatus: LoadStatus.NOT_LOADED,
      projects: Immutable.Map()
    }))
)
