import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";
import { Family, Milestone, Platform, Project, ProjectMilestone } from "../constants/DBSchema";
import { declareAction } from "../flux/Flux";

const reloadProjectListSubject = new Rx.Subject();
const reloadMilestonesSubject = new Rx.Subject();
const updateProjectSubject = new Rx.Subject();

export function reloadProjectList() {
  reloadProjectListSubject.onNext();
}

export function reloadMilestones(projectId) {
  reloadMilestonesSubject.onNext({ projectId });
}

/**
 * @param {Immutable.Map} oldValues 更新前の値
 * @param {Object} newValues 更新後の値
 * @param {Immutable.Map<String, Immutable.Map>} oldMilestones 更新前のマイルストーン
 * @param {Array<Object>} newMilestones 更新後のマイルストーン
 */
export function updateProject(oldValues, newValues, oldMilestones, newMilestones) {
  updateProjectSubject.onNext({
    oldValues, newValues, oldMilestones, newMilestones
  });
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   projects: Immutable.Map({
//     "ID1": Immutable.Map({
//       id: "ID1",
//       name: ...,
//       familyId: ...,
//       platformId: ...,
//       projectCode: ...,
//       version: ...,
//     }),
//     ...
//   }),
// })
declareAction("projectLoadAllAction", ({ db }) => {
  return reloadProjectListSubject
    .flatMapLatest(() => {
      const query = db.createQuery(Project.CLASS_NAME);
      return Rx.Observable.fromPromise(db.find(query))
        .map((result) => {
          const projectMap = Immutable.Map().withMutations(initial => {
            result.reduce((acc, project) => {
              return acc.set(project.getId(), Immutable.Map({
                id: project.getId(),
                name: project.get(Project.NAME),
                familyId: project.get(Project.FAMILY).getId(),
                platformId: project.get(Project.PLATFORM).getId(),
                projectCode: project.get(Project.PROJECT_CODE),
                version: project.get(Project.VERSION),
              }));
            }, initial);
          });
          
          return Immutable.Map({
            loading: false,
            projects: projectMap,
          });
        })
        .startWith(Immutable.Map({
          loading: true,
        }))
        .catch(error => {
          notifyError("プロジェクト一覧の取得に失敗", error.message);
          return Rx.Observable.just(Immutable.Map({
            loading: false,
          }));
        })
    })
});

function _loadProject(db, projectId) {
  const project = db.createEntity(Project.CLASS_NAME);
  project.setId(projectId);
  return Rx.Observable.fromPromise(db.fetch(project))
    .map((result) => Immutable.Map({
      id: project.getId(),
      name: project.get(Project.NAME),
      familyId: project.get(Project.FAMILY).getId(),
      platformId: project.get(Project.PLATFORM).getId(),
      projectCode: project.get(Project.PROJECT_CODE),
      version: project.get(Project.VERSION),
    }))
}

function _loadProjectMilestones(db, projectId) {
  const project = db.createEntity(Project.CLASS_NAME);
  project.setId(projectId);
  const query = db.createQuery(ProjectMilestone.CLASS_NAME);
  query.equalTo(ProjectMilestone.PROJECT, project);
  return Rx.Observable.fromPromise(db.find(query))
    .map((result) => {
      const projectMilestoneMap = Immutable.Map().withMutations(initial => {
        result.reduce((acc, projectMilestone) => {
          return acc.set(projectMilestone.getId(), Immutable.Map({
            id: projectMilestone.getId(),
            projectId: projectMilestone.get(ProjectMilestone.PROJECT).getId(),
            milestoneId: projectMilestone.get(ProjectMilestone.MILESTONE).getId(),
            internalDate: projectMilestone.get(ProjectMilestone.INTERNAL_DATE),
            dateString: projectMilestone.get(ProjectMilestone.DATE_STRING),
          }));
        }, initial);
      });
      
      return Immutable.Map({
        projectMilestones: projectMilestoneMap,
      });
    })  
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   projectId: "ID1",
//   projectMilestones: Immutable.Map({
//     "ID20": Immutable.Map({
//       id: "ID20",
//       projectId: "ID1",
//       milestoneId: ...,
//       internalDate: ...,
//       dateString: ...,
//     })
//     ...
//   }),
// })
declareAction("projectMilestoneLoadAction", ({ db }) => {
  return reloadMilestonesSubject
    .flatMapLatest(({ projectId }) => {
      return _loadProjectMilestones(db, projectId)
        .map((result) => {
          return result.merge(Immutable.Map({
            loading: false,
            projectId: projectId,
          }))
        })
        .startWith(Immutable.Map({
          loading: true,
          projectId: projectId,
        }))
        .catch(error => {
          notifyError("プロジェクトのマイルストーンが取得できませんでした", error.message);
          return Rx.Observable.just(Immutable.Map({
            loading: false,
            projectId: projectId,
          }));
        })
    })
});

function _updateProject(db, oldValues, newValues, oldMilestones, newMilestones) {
  // project本体について
  // -------------------
  const project = db.createEntity(Project.CLASS_NAME);
  project.setId(oldValues.get("id"));
  
  const needsUpdateProject
    =  (oldValues.get("name") != newValues.name)
    || (oldValues.get("familyId") != newValues.familyId)
    || (oldValues.get("platformId") != newValues.platformId)
    || (oldValues.get("projectCode") != newValues.projectCode)
    || (oldValues.get("version") != newValues.version)

  if (needsUpdateProject) {
    project.set(Project.NAME, newValues.name);
    project.set(Project.FAMILY, db.createEntity(Family.CLASS_NAME).setId(newValues.familyId));
    project.set(Project.PLATFORM, db.createEntity(Platform.CLASS_NAME).setId(newValues.platformId));
    project.set(Project.PROJECT_CODE, newValues.projectCode);
    project.set(Project.VERSION, newValues.version);
  }

  // projectのmilestonesについて
  // ---------------------------
  let doNotRemove = Immutable.Set();
  
  // 追加されたもの ＋ 変更されたもののリスト
  const addModList = newMilestones
    .map((newProjectMilestone) => {
      let projectMilestone = null;
      if (newProjectMilestone.isNew) {
        projectMilestone = db.createEntity(ProjectMilestone.CLASS_NAME, true);
        projectMilestone.set(ProjectMilestone.PROJECT, project);
        projectMilestone.set(ProjectMilestone.MILESTONE, db.createEntity(Milestone.CLASS_NAME).setId(newProjectMilestone.milestoneId));
        projectMilestone.set(ProjectMilestone.INTERNAL_DATE, newProjectMilestone.internalDate);
        projectMilestone.set(ProjectMilestone.DATE_STRING, newProjectMilestone.dateString);
      } else {
        doNotRemove = doNotRemove.add(newProjectMilestone.id);
        oldProjectMilestone = oldMilestones.get(newProjectMilestone.id);
        
        function equalDates(date1, date2) {
          if (date1 == null) {
            return date2 == null;
          } else if (date2 == null) {
            return false;
          } else {
            return date1.getTime() == date2.getTime();
          }
        }
        
        const needsUpdate
          =  (oldProjectMilestone.get("milestoneId") != newProjectMilestone.milestoneId)
          || (!equalDates(oldProjectMilestone.get("internalDate"), newProjectMilestone.internalDate))
          || (oldProjectMilestone.get("dateString") != newProjectMilestone.dateString)
        
        if (needsUpdate) {
          projectMilestone = db.createEntity(ProjectMilestone.CLASS_NAME);
          projectMilestone.set(ProjectMilestone.PROJECT, project);
          projectMilestone.set(ProjectMilestone.MILESTONE, db.createEntity(Milestone.CLASS_NAME).setId(newProjectMilestone.milestoneId));
          projectMilestone.set(ProjectMilestone.INTERNAL_DATE, newProjectMilestone.internalDate);
          projectMilestone.set(ProjectMilestone.DATE_STRING, newProjectMilestone.dateString);
        }
      }
    })
  .filter(value => value != null)
  
  // 削除されたもののリスト
  const delList = oldMilestones.filterNot(oldMilestone => doNotRemove.includes(oldMilestone.get("id"))).toArray();
  
  // 更新
  // ----
  if (needsUpdateProject) {
    addModList.push(project);
  }
  
  return Promise.all([
    Promise.resolve((addModList.length > 0) ? db.saveAll(addModList) : null),
    Promise.resolve((delList.length > 0) ? db.destroyAll(delList) : null),
  ]);
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   updating: false,
//   projectId: "ID1",
//   project: Immutable.Map({
//     id: "ID1",
//     name: ...,
//     familyId: ...,
//     platformId: ...,
//     projectCode: ...,
//     version: ...,
//   }),
//   projectMilestones: Immutable.Map({
//     "ID20": Immutable.Map({
//       id: "ID20",
//       projectId: "ID1",
//       milestoneId: ...,
//       internalDate: ...,
//       dateString: ...,
//     })
//     ...
//   }),
// })
declareAction("projectUpdateAction", ({ db }) => {
  return updateProjectSubject
    .flatMapLatest(({ oldValues, newValues, oldMilestones, newMilestones }) => {
      const projectId = oldValues.get("id");
      return Rx.Observable.fromPromise(_updateProject(db, oldValues, newValues, oldMilestones, newMilestones))
        .flatMapLatest(() => {
          const loadProject = _loadProject(db, projectId);
          const loadProjectMilestones = _loadProjectMilestones(db, projectId);
          
          return Rx.Observable.combineLatest(loadProject, loadProjectMilestones, (lp, lpm) => {
            return Immutable.Map({
              updating: false,
              projectId: projectId,
              project: lp,
              projectMilestones: lpm,
            });
          })
        })
        .startWith(Immutable.Map({
          updating: true,
          projectId: projectId,
        }))
        .catch(error => {
          notifyError("プロジェクトの更新に失敗しました", error.message);
          return Rx.Observable.just(Immutable.Map({
            updating: true,
            projectId: oldValues.get("id"),
          }));
        })
    })
});
